import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import TrendChart from '../components/TrendChart';
import FlagBadge from '../components/FlagBadge';

export default function PatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState('');
  const [apptDate, setApptDate] = useState('');

  // ── load patient + readings + appointments ───
  const load = () => api.get(`/patients/${id}`).then((r) => setData(r.data));

  useEffect(() => {
    load();
  }, [id]);

  // ── helpers ──────────────────────────────────
  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 2500);
  };

  const sendReminder = async () => {
    if (!data) return;
    try {
      await api.post('/reminders/trigger', {
        patient_id: id,
        type: 'checkup',
        message: `Hi ${data.patient.users.full_name}, please book your next checkup.`,
      });
      flash('Reminder sent (mock)');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed');
    }
  };

  const bookAppt = async () => {
    if (!apptDate) return;
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
      flash(e.response?.data?.error || 'Failed');
    }
  };

  const confirmAppt = async (apptId) => {
    try {
      await api.patch(`/appointments/${apptId}`, { status: 'scheduled' });
      await load();
      flash('Appointment confirmed');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed');
    }
  };

  const cancelAppt = async (apptId) => {
    try {
      await api.delete(`/appointments/${apptId}`);
      await load();
      flash('Appointment cancelled');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed');
    }
  };

  if (!data) return <p className="p-6">Loading…</p>;

  const { patient, readings, appointments } = data;

  const statusColor = (s) => {
    if (s === 'requested') return 'text-orange-600';
    if (s === 'scheduled') return 'text-green-600';
    if (s === 'completed') return 'text-blue-600';
    if (s === 'cancelled') return 'text-gray-400';
    if (s === 'missed') return 'text-red-600';
    return 'text-gray-700';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ── header ─────────────────────────────── */}
      <h1 className="text-2xl font-bold">{patient.users.full_name}</h1>
      <p className="text-sm text-gray-600">
        {patient.condition} • Next checkup: {patient.next_checkup_date}
      </p>
      <p className="text-sm text-gray-500">
        {patient.users.email} • {patient.users.phone}
      </p>

      <div className="my-4 flex gap-3 items-center">
        <button
          onClick={sendReminder}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Send Reminder
        </button>
        {msg && <span className="text-green-600 text-sm">{msg}</span>}
      </div>

      {/* ── trends ─────────────────────────────── */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Trends</h2>
        <TrendChart readings={readings} type="sugar" />
        <TrendChart readings={readings} type="bp_sys" />
        <TrendChart readings={readings} type="bp_dia" />
        <TrendChart readings={readings} type="weight" />
      </div>

      {/* ── medications ────────────────────────── */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold mb-2">Medications</h2>
        {(patient.medications || []).length === 0 && (
          <p className="text-sm text-gray-400">No medications assigned.</p>
        )}
        <ul className="text-sm list-disc pl-5">
          {(patient.medications || []).map((m, i) => (
            <li key={i}>
              {m.name} — {m.dose} at {(m.times || []).join(', ')}
            </li>
          ))}
        </ul>
      </div>

      {/* ── appointments ───────────────────────── */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold mb-2">Appointments</h2>

        {appointments.length === 0 && (
          <p className="text-sm text-gray-400">No appointments yet.</p>
        )}

        <ul className="text-sm space-y-2">
          {appointments.map((a) => (
            <li key={a.id} className="border-b pb-2 flex items-center gap-3 flex-wrap">
              <span>
                {new Date(a.scheduled_at).toLocaleString()} —{' '}
                <b className={statusColor(a.status)}>{a.status}</b>
              </span>

              {a.status === 'requested' && (
                <button
                  onClick={() => confirmAppt(a.id)}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                >
                  Confirm
                </button>
              )}

              {a.status !== 'cancelled' && a.status !== 'completed' && a.status !== 'missed' && (
                <button
                  onClick={() => cancelAppt(a.id)}
                  className="text-red-600 text-xs"
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t">
          <p className="text-sm font-semibold mb-1">Schedule new appointment</p>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              className="border p-2 rounded text-sm"
              value={apptDate}
              onChange={(e) => setApptDate(e.target.value)}
            />
            <button
              onClick={bookAppt}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Book
            </button>
          </div>
        </div>
      </div>

      {/* ── tests ──────────────────────────────── */}
      {(patient.tests || []).length > 0 && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="font-semibold mb-2">Tests</h2>
          <ul className="text-sm">
            {patient.tests.map((t, i) => (
              <li key={i}>
                {t.name} — due {t.due_date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── flags ──────────────────────────────── */}
      {patient.flags?.length > 0 && (
        <div className="mt-4">
          {patient.flags.map((f) => (
            <FlagBadge key={f} flag={f} />
          ))}
        </div>
      )}
    </div>
  );
}