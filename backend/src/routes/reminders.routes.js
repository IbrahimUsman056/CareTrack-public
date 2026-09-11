const router = require('express').Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const {
  sendReminder,
  runReminderScan,
  runMedicationScan,
  runTestScan,
  markMissedAppointments
} = require('../services/reminder.service');
const { requireRole } = require('../middleware/roles');
const { resolvePatientAccess } = require('../middleware/ownership');

// List reminders for a patient
router.get('/:patientId', auth, async (req, res) => {
  const access = await resolvePatientAccess(req, req.params.patientId);
  if (!access) return res.status(403).json({ error: 'Forbidden' });

  const { data } = await supabase
    .from('reminders')
    .select('*')
    .eq('patient_id', req.params.patientId)
    .order('scheduled_for', { ascending: false });
  res.json(data || []);
});

// Manually trigger one reminder (demo button)
router.post('/trigger', auth, requireRole('doctor'), async (req, res) => {
  const { patient_id, type, message } = req.body;

  const access = await resolvePatientAccess(req, patient_id);
  if (!access) return res.status(403).json({ error: 'Forbidden' });

  const result = await sendReminder({ patient_id, type, message });
  res.json(result);
});

// Force-run each scanner (handy for demo when you don't want to wait for cron)
router.post('/scan/checkups', auth, requireRole('doctor'), async (req, res) => {
  await runReminderScan();
  res.json({ ok: true, scan: 'checkups' });
});

router.post('/scan/medications', auth, requireRole('doctor'), async (req, res) => {
  await runMedicationScan();
  res.json({ ok: true, scan: 'medications' });
});

router.post('/scan/tests', auth, requireRole('doctor'), async (req, res) => {
  await runTestScan();
  res.json({ ok: true, scan: 'tests' });
});

router.post('/scan/appointments', auth, requireRole('doctor'), async (req, res) => {
  await markMissedAppointments();
  res.json({ ok: true, scan: 'appointments' });
});

module.exports = router;