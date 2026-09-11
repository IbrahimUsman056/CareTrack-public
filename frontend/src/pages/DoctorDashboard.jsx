import { useEffect, useState } from 'react';
import api from '../api/client';
import PatientCard from '../components/PatientCard';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setPatients(res.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading dashboard…</p>;

  const flagged = patients.filter((p) => p.flags?.length);
  const ok = patients.filter((p) => !p.flags?.length);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        {flagged.length} patient(s) need attention • {ok.length} on track
      </p>

      {flagged.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-red-700 mb-2">⚠ Needs Attention</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {flagged.map((p) => <PatientCard key={p.id} patient={p} />)}
          </div>
        </>
      )}

      <h2 className="text-lg font-semibold text-green-700 mb-2">On Track</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ok.map((p) => <PatientCard key={p.id} patient={p} />)}
      </div>
    </div>
  );
}