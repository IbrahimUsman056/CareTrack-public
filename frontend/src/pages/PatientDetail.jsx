import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import TrendChart from '../components/TrendChart';
import FlagBadge, { StatusBadge } from '../components/FlagBadge';
import { Button, Card, EmptyState, Field, LoadingState } from '../components/ui';

export default function PatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgTone, setMsgTone] = useState('success');
  const [apptDate, setApptDate] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get(`/patients/${id}`).then((r) => setData(r.data));

  useEffect(() => {
    let active = true;
    api
      .get(`/patients/${id}`)
      .then((r) => {
        if (active) setData(r.data);
      })
      .catch(console.error);
    return () => {
      active = false;
    };
  }, [id]);

  const flash = (text, tone = 'success') => {
    setMsg(text);
    setMsgTone(tone);
    setTimeout(() => setMsg(''), 2800);
  };

  const sendReminder = async () => {
    if (!data) return;
    setBusy(true);
    try {
      await api.post('/reminders/trigger', {
        patient_id: id,
        type: 'checkup',
        message: `Hi ${data.patient.users.full_name}, please book your next checkup.`,
      });
      flash('Reminder sent');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to send reminder', 'error');
    } finally {
      setBusy(false);
    }
  };

  const bookAppt = async () => {
    if (!apptDate) return;
    setBusy(true);
    try {
      await api.post('/appointments', {
        patient_id: id,
        scheduled_at: new Date(apptDate).toISOString(),
        notes: 'Follow-up',
      });
      setApptDate('');
      await load();
      flash('Appointment scheduled');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to book', 'error');
    } finally {
      setBusy(false);
    }
  };

  const confirmAppt = async (apptId) => {
    try {
      await api.patch(`/appointments/${apptId}`, { status: 'scheduled' });
      await load();
      flash('Appointment confirmed');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed', 'error');
    }
  };

  const cancelAppt = async (apptId) => {
    try {
      await api.delete(`/appointments/${apptId}`);
      await load();
      flash('Appointment cancelled');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed', 'error');
    }
  };

  if (!data) return <LoadingState label="Loading patient…" />;

  const { patient, readings, appointments } = data;
  const flags = (() => {
    if (patient.flags?.length) return patient.flags;
    const computed = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const sorted = [...readings].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
    if (patient.next_checkup_date && new Date(patient.next_checkup_date) < today) {
      computed.push('missed_followup');
    }
    const bp = sorted.filter((r) => r.type === 'bp_sys').slice(0, 3);
    if (bp.length >= 3 && bp.every((r) => Number(r.value) > 140)) computed.push('high_bp_trend');
    const sugar = sorted.filter((r) => r.type === 'sugar').slice(0, 3);
    if (sugar.length >= 3 && sugar.every((r) => Number(r.value) > 180)) computed.push('high_sugar_trend');
    const last = sorted[0];
    if (last && (today - new Date(last.logged_at)) / 86400000 > 14) computed.push('no_recent_logs');
    const overdueTests = (patient.tests || []).filter((t) => t.due_date && t.due_date < todayStr);
    if (overdueTests.length) computed.push('overdue_test');
    if (appointments.some((a) => a.status === 'requested')) computed.push('pending_appointment_request');
    return computed;
  })();
  const latestByType = (type) =>
    [...readings].filter((r) => r.type === type).sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))[0];

  const statusColor = (s) => {
    if (s === 'requested') return 'text-warning';
    if (s === 'scheduled') return 'text-success';
    if (s === 'completed') return 'text-care-blue';
    if (s === 'cancelled') return 'text-ink-muted';
    if (s === 'missed') return 'text-danger';
    return 'text-navy';
  };

  return (
    <div className="ct-container py-8 sm:py-10">
      <Link to="/doctor" className="text-sm font-semibold text-care-blue hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="ct-display text-3xl sm:text-4xl">{patient.users.full_name}</h1>
            <StatusBadge status={flags.length ? 'attention' : 'on_track'} />
          </div>
          <p className="mt-2 text-sm capitalize text-ink-muted">
            {patient.condition} · Next checkup: <span className="font-semibold text-navy">{patient.next_checkup_date || 'Not set'}</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {patient.users.email} · {patient.users.phone}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={sendReminder} variant="navy" disabled={busy}>
            Send Reminder
          </Button>
          {msg && (
            <span className={`text-sm font-medium ${msgTone === 'error' ? 'text-danger' : 'text-success'}`}>
              {msg}
            </span>
          )}
        </div>
      </div>

      {flags.length > 0 && (
        <Card className="mt-6 border-amber-200 bg-amber-50/50 p-4">
          <p className="mb-2 text-sm font-semibold text-navy">Attention flags</p>
          <div className="flex flex-wrap">
            {flags.map((f) => (
              <FlagBadge key={f} flag={f} />
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Blood sugar', latestByType('sugar'), 'mg/dL'],
          ['BP systolic', latestByType('bp_sys'), 'mmHg'],
          ['BP diastolic', latestByType('bp_dia'), 'mmHg'],
          ['Weight', latestByType('weight'), 'kg'],
        ].map(([label, reading, unit]) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
            <p className="mt-1 font-display text-2xl text-navy">
              {reading ? reading.value : '—'}
              {reading && <span className="ml-1 text-sm font-sans text-ink-muted">{unit}</span>}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {reading ? new Date(reading.logged_at).toLocaleString() : 'No reading yet'}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Health trends</h2>
          <p className="mt-1 text-sm text-ink-muted">Longitudinal readings for this patient.</p>
          <TrendChart readings={readings} type="sugar" />
          <TrendChart readings={readings} type="bp_sys" />
          <TrendChart readings={readings} type="bp_dia" />
          <TrendChart readings={readings} type="weight" />
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-bold text-navy">Medications</h2>
            {(patient.medications || []).length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No medications assigned.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {(patient.medications || []).map((m, i) => (
                  <li key={i} className="rounded-xl border border-line bg-slate-50 px-3 py-3 text-sm">
                    <p className="font-semibold text-navy">{m.name}</p>
                    <p className="text-ink-muted">
                      {m.dose} · {(m.times || []).join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-navy">Appointments</h2>
            {appointments.length === 0 ? (
              <EmptyState title="No appointments yet" description="Schedule a follow-up below." />
            ) : (
              <ul className="mt-3 space-y-3">
                {appointments.map((a) => (
                  <li key={a.id} className="rounded-xl border border-line p-3">
                    <p className="text-sm font-semibold text-navy">
                      {new Date(a.scheduled_at).toLocaleString()}
                    </p>
                    <p className={`text-xs font-bold capitalize ${statusColor(a.status)}`}>{a.status}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {a.status === 'requested' && (
                        <button
                          type="button"
                          onClick={() => confirmAppt(a.id)}
                          className="rounded-lg bg-success px-2.5 py-1 text-xs font-semibold text-white"
                        >
                          Confirm
                        </button>
                      )}
                      {a.status !== 'cancelled' && a.status !== 'completed' && a.status !== 'missed' && (
                        <button
                          type="button"
                          onClick={() => cancelAppt(a.id)}
                          className="text-xs font-semibold text-danger"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-sm font-semibold text-navy">Schedule new appointment</p>
              <Field id="appt-date" label="Date & time">
                <input
                  id="appt-date"
                  type="datetime-local"
                  className="ct-input"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                />
              </Field>
              <Button onClick={bookAppt} variant="teal" disabled={!apptDate || busy}>
                Book appointment
              </Button>
            </div>
          </Card>

          {(patient.tests || []).length > 0 && (
            <Card className="p-5">
              <h2 className="font-bold text-navy">Tests</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {patient.tests.map((t, i) => (
                  <li key={i} className="flex justify-between gap-3 border-b border-line pb-2 last:border-0">
                    <span className="font-medium text-navy">{t.name}</span>
                    <span className="text-ink-muted">due {t.due_date}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
