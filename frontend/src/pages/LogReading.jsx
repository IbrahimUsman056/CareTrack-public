import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function LogReading() {
  const [profile, setProfile] = useState(null);
  const [type, setType] = useState('sugar');
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    api.get('/patients/me/profile').then((r) => setProfile(r.data)).catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    await api.post('/readings', { patient_id: profile.id, type, value: Number(value) });
    setMsg('Logged!');
    setValue('');
    setTimeout(() => { setMsg(''); nav('/me'); }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Log a Reading</h2>
      {msg && <p className="text-green-600 text-sm mb-2">{msg}</p>}
      <form onSubmit={submit} className="space-y-3">
        <select className="w-full border p-2 rounded" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="sugar">Sugar</option>
          <option value="bp_sys">Blood Pressure (systolic)</option>
          <option value="bp_dia">Blood Pressure (diastolic)</option>
          <option value="weight">Weight</option>
        </select>
        <input className="w-full border p-2 rounded" type="number" step="any" placeholder="Value"
          value={value} onChange={(e) => setValue(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Save</button>
      </form>
    </div>
  );
}