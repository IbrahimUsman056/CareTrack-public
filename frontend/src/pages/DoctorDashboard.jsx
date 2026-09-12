import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import PatientCard from '../components/PatientCard';
import { useAuth } from '../context/AuthContext';
import { Button, Card, EmptyState, LoadingState, StatCard } from '../components/ui';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => setPatients(res.data || []))
      .catch((e) => setError(e.response?.data?.error || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading clinic dashboard…" />;

  const flagged = patients.filter((p) => p.flags?.length);
  const ok = patients.filter((p) => !p.flags?.length);
  const missed = patients.filter((p) => p.flags?.includes('missed_followup'));
  const pendingAppts = patients.reduce((n, p) => n + (p.pendingAppts?.length || 0), 0);
  const recentReadings = patients
    .flatMap((p) =>
      (p.latestReadings || []).map((r) => ({
        ...r,
        patientName: p.users?.full_name,
        condition: p.condition,
      }))
    )
    .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))
    .slice(0, 6);

  const firstName = user?.full_name?.split(' ')[0] || 'Doctor';

  return (
    <div className="ct-container py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="ct-kicker">Clinic workspace</p>
          <h1 className="ct-display mt-1 text-3xl sm:text-4xl">Good day, {firstName}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Here&apos;s what needs your attention across chronic-care follow-up.
          </p>
        </div>
        <Button as={Link} to="/add-patient" variant="teal">
          + Add Patient
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total patients" value={patients.length} hint="In your clinic" />
        <StatCard
          label="Needs attention"
          value={flagged.length}
          hint={flagged.length ? 'Review flagged patients' : 'All clear right now'}
          tone={flagged.length ? 'warning' : 'default'}
        />
        <StatCard
          label="Missed follow-ups"
          value={missed.length}
          hint="Overdue checkups"
          tone={missed.length ? 'danger' : 'default'}
        />
        <StatCard
          label="Appointment requests"
          value={pendingAppts}
          hint="Awaiting confirmation"
          tone={pendingAppts ? 'info' : 'default'}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          {flagged.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy">Needs attention</h2>
                <span className="text-xs font-semibold text-warning">{flagged.length} flagged</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {flagged.map((p) => (
                  <PatientCard key={p.id} patient={p} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">On track</h2>
              <span className="text-xs font-semibold text-care-teal">{ok.length} patients</span>
            </div>
            {patients.length === 0 ? (
              <EmptyState
                title="No patients yet"
                description="Onboard your first chronic-care patient to start reminders, logging, and follow-up flags."
                action={
                  <Button as={Link} to="/add-patient" variant="navy">
                    Add your first patient
                  </Button>
                }
              />
            ) : ok.length === 0 ? (
              <EmptyState
                title="No patients currently on track"
                description="Everyone in your list currently has at least one attention flag."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {ok.map((p) => (
                  <PatientCard key={p.id} patient={p} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-navy">Recent health readings</h3>
            {recentReadings.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                Readings will appear here once patients start logging.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentReadings.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-navy">{r.patientName}</p>
                      <p className="text-xs capitalize text-ink-muted">
                        {r.type.replace(/_/g, ' ')} · {new Date(r.logged_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-navy">{r.value}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="bg-navy p-5 text-white">
            <h3 className="font-semibold">Quick actions</h3>
            <div className="mt-4 flex flex-col gap-2">
              <Button as={Link} to="/add-patient" variant="teal" className="w-full">
                Onboard patient
              </Button>
              <p className="text-xs leading-relaxed text-slate-300">
                Workflow: Onboard → Remind → Log → Monitor → Flag → Act
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
