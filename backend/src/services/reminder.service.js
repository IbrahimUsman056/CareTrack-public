const supabase = require('../config/supabase');

let twilioClient = null;
if (process.env.TWILIO_SID) {
  twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
}

// ─────────────────────────────────────────────
// Send a single reminder (mock or real via Twilio)
// ─────────────────────────────────────────────
async function sendReminder({ patient_id, type, message }) {
  const { data: rem, error } = await supabase
    .from('reminders')
    .insert([{
      patient_id,
      type,
      message,
      scheduled_for: new Date().toISOString(),
      status: 'pending'
    }])
    .select()
    .single();

  if (error) {
    console.log('[reminder] insert failed:', error.message);
    return { status: 'failed', error: error.message };
  }

  const { data: patient } = await supabase
    .from('patients')
    .select('users!patients_user_id_fkey(phone, full_name)')
    .eq('id', patient_id)
    .single();

  const phone = patient?.users?.phone;
  if (!phone) {
    await supabase.from('reminders').update({ status: 'failed' }).eq('id', rem.id);
    return { ...rem, status: 'failed', reason: 'no phone' };
  }

  if (twilioClient) {
    try {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_FROM,
        to: phone
      });
      await supabase.from('reminders')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', rem.id);
      return { ...rem, status: 'sent' };
    } catch (e) {
      await supabase.from('reminders').update({ status: 'failed' }).eq('id', rem.id);
      return { ...rem, status: 'failed', error: e.message };
    }
  }

  // Mock mode
  console.log(`[MOCK SMS] to ${phone}: ${message}`);
  await supabase.from('reminders')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', rem.id);
  return { ...rem, status: 'sent', mock: true };
}

// ─────────────────────────────────────────────
// Scan: checkups due or overdue
// ─────────────────────────────────────────────
async function runReminderScan() {
  const today = new Date().toISOString().split('T')[0];

  const { data: due } = await supabase
    .from('patients')
    .select('id, next_checkup_date, users!patients_user_id_fkey(full_name)')
    .lte('next_checkup_date', today);

  for (const p of due || []) {
    // Avoid duplicate reminders sent today for the same patient+type
    const startOfDay = today + 'T00:00:00.000Z';
    const { data: existing } = await supabase
      .from('reminders')
      .select('id')
      .eq('patient_id', p.id)
      .eq('type', 'checkup')
      .gte('scheduled_for', startOfDay)
      .limit(1);

    if (existing && existing.length) continue;

    await sendReminder({
      patient_id: p.id,
      type: 'checkup',
      message: `Hi ${p.users?.full_name}, your checkup was due on ${p.next_checkup_date}. Please book soon.`
    });
  }

  console.log(`[cron:checkup] scanned ${due?.length || 0} due patients`);
}

// ─────────────────────────────────────────────
// Scan: medication times matching current HH:MM
// ─────────────────────────────────────────────
async function runMedicationScan() {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5); // "08:00"
  const today = now.toISOString().split('T')[0];

  const { data: patients } = await supabase
    .from('patients')
    .select('id, medications, users!patients_user_id_fkey(full_name)');

  let count = 0;
  for (const p of patients || []) {
    for (const med of p.medications || []) {
      if (!(med.times || []).includes(hhmm)) continue;

      // Dedupe: skip if already sent this med today
      const startOfDay = today + 'T00:00:00.000Z';
      const { data: existing } = await supabase
        .from('reminders')
        .select('id')
        .eq('patient_id', p.id)
        .eq('type', 'medication')
        .gte('scheduled_for', startOfDay)
        .ilike('message', `%${med.name}%`)
        .limit(1);

      if (existing && existing.length) continue;

      await sendReminder({
        patient_id: p.id,
        type: 'medication',
        message: `Reminder: take ${med.name} (${med.dose}) now.`
      });
      count++;
    }
  }

  console.log(`[cron:medication] sent ${count} medication reminders at ${hhmm}`);
}

// ─────────────────────────────────────────────
// Scan: overdue tests (uses patients.tests jsonb)
// ─────────────────────────────────────────────
async function runTestScan() {
  const today = new Date().toISOString().split('T')[0];

  const { data: patients } = await supabase
    .from('patients')
    .select('id, tests, users!patients_user_id_fkey(full_name)');

  let count = 0;
  for (const p of patients || []) {
    for (const t of p.tests || []) {
      if (!t.due_date || t.due_date > today) continue;

      const startOfDay = today + 'T00:00:00.000Z';
      const { data: existing } = await supabase
        .from('reminders')
        .select('id')
        .eq('patient_id', p.id)
        .eq('type', 'test')
        .gte('scheduled_for', startOfDay)
        .ilike('message', `%${t.name}%`)
        .limit(1);

      if (existing && existing.length) continue;

      await sendReminder({
        patient_id: p.id,
        type: 'test',
        message: `Hi ${p.users?.full_name}, your ${t.name} test was due on ${t.due_date}. Please get it done.`
      });
      count++;
    }
  }

  console.log(`[cron:test] sent ${count} overdue test reminders`);
}

// ─────────────────────────────────────────────
// Auto-mark past scheduled appointments as missed
// ─────────────────────────────────────────────
async function markMissedAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'missed' })
    .lt('scheduled_at', new Date().toISOString())
    .eq('status', 'scheduled')
    .select();

  if (error) console.log('[cron:appointments] error:', error.message);
  else console.log(`[cron:appointments] marked ${data?.length || 0} as missed`);
}

module.exports = {
  sendReminder,
  runReminderScan,
  runMedicationScan,
  runTestScan,
  markMissedAppointments
};