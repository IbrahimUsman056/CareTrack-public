import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function PatientHome() {
  const [profile, setProfile] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [appts, setAppts] = useState([]);

  const [newDate, setNewDate] = useState('');
  const [reschedId, setReschedId] = useState(null);
  const [reschedDate, setReschedDate] = useState('');
  const [msg, setMsg] = useState('');

  // ── load profile + reminders + appointments ──
  useEffect(() => {
    api.get('/patients/me/profile')
      .then((r) => {
        setProfile(r.data);
        return Promise.all([
          api.get(`/reminders/${r.data.id}`),
          api.get(`/appointments/patient/${r.data.id}`),
        ]);
      })
      .then(([remRes, apptRes]) => {
        setReminders(remRes.data || []);
        setAppts(apptRes.data || []);
      })
      .catch(console.error);
  }, []);

  // ── helpers ──────────────────────────────────
  const reloadAppts = async () => {
    if (!profile) return;
    const r = await api.get(`/appointments/patient/${profile.id}`);
    setAppts(r.data || []);
  };

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 2500);
  };

  const book = async () => {
    if (!newDate) return;
    try {
      await api.post('/appointments', {
        scheduled_at: new Date(newDate).toISOString(),
        notes: 'Patient requested',
      });
      setNewDate('');
      await reloadAppts();
      flash('Appointment requested');
    } catch (e) {
      flash(e.response?.data?.error || 'Booking failed');
    }
  };

  const reschedule = async (id) => {
    if (!reschedDate) return;
    try {
      await api.patch(`/appointments/${id}`, {
        scheduled_at: new Date(reschedDate).toISOString(),
      });
      setReschedId(null);
      setReschedDate('');
      await reloadAppts();
      flash('Reschedule requested');
    } catch (e) {
      flash(e.response?.data?.error || 'Reschedule failed');
    }
  };

  const cancel = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      await reloadAppts();
      flash('Appointment cancelled');
    } catch (e) {
      flash(e.response?.data?.error || 'Cancel failed');
    }
  };

  if (!profile) return <p className="p-6">Loading…</p>;

  const statusColor = (s) => {
    if (s === 'requested') return 'text-orange-600';
    if (s === 'scheduled') return 'text-green-600';
    if (s === 'completed') return 'text-blue-600';
    if (s === 'cancelled') return 'text-gray-400';
    if (s === 'missed') return 'text-red-600';
    return 'text-gray-700';
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Hello, {profile.users?.full_name}</h1>
      <p className="text-sm text-gray-600">{profile.condition}</p>
      <p className="text-sm">
        Next checkup: <b>{profile.next_checkup_date}</b>
      </p>

      {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}

      <div className="my-4">
        <Link to="/log" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">
          Log a Reading
        </Link>
      </div>

      {/* ── Medications ───────────────────────── */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">My Medications</h2>
        {(profile.medications || []).length === 0 && (
          <p className="text-sm text-gray-400">No medications assigned.</p>
        )}
        <ul className="text-sm list-disc pl-5">
          {(profile.medications || []).map((m, i) => (
            <li key={i}>
              {m.name} — {m.dose} at {(m.times || []).join(', ')}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Appointments ──────────────────────── */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold mb-2">My Appointments</h2>

        {appts.length === 0 && (
          <p className="text-sm text-gray-400">No appointments yet.</p>
        )}

        <ul className="text-sm space-y-2">
          {appts.map((a) => (
            <li key={a.id} className="border-b pb-2">
              <div>
                {new Date(a.scheduled_at).toLocaleString()} —{' '}
                <b className={statusColor(a.status)}>{a.status}</b>
              </div>

              {a.status !== 'cancelled' && a.status !== 'completed' && (
                <div className="flex gap-3 mt-1 items-center">
                  {reschedId === a.id ? (
                    <>
                      <input
                        type="datetime-local"
                        className="border p-1 rounded text-xs"
                        value={reschedDate}
                        onChange={(e) => setReschedDate(e.target.value)}
                      />
                      <button
                        onClick={() => reschedule(a.id)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setReschedId(null)}
                        className="text-xs text-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setReschedId(a.id);
                          setReschedDate('');
                        }}
                        className="text-blue-600 text-xs"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => cancel(a.id)}
                        className="text-red-600 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t">
          <p className="text-sm font-semibold mb-1">Request a new appointment</p>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              className="border p-2 rounded text-sm"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <button
              onClick={book}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Request
            </button>
          </div>
        </div>
      </div>

      {/* ── Reminders ─────────────────────────── */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold mb-2">Recent Reminders</h2>
        {reminders.length === 0 && (
          <p className="text-sm text-gray-400">No reminders yet.</p>
        )}
        <ul className="text-sm space-y-1">
          {reminders.slice(0, 10).map((r) => (
            <li key={r.id}>
              <span className="text-gray-500">
                {new Date(r.scheduled_for).toLocaleString()}
              </span>{' '}
              — {r.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}