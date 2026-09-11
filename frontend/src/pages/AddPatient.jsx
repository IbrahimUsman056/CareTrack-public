import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function AddPatient() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    full_name: '', email: '', password: 'pass123', phone: '',
    condition: 'diabetes', followup_interval_days: 30,
    medication_name: 'Metformin', dose: '500mg', times: '08:00,20:00',
  });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      condition: form.condition,
      followup_interval_days: Number(form.followup_interval_days),
      medications: form.medication_name
        ? [{ name: form.medication_name, dose: form.dose, times: form.times.split(',').map(s => s.trim()) }]
        : [],
    };
    try {
      const { data } = await api.post('/patients', payload);
      nav(`/patient/${data.patient.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Full name" onChange={set('full_name')} required />
        <input className="w-full border p-2 rounded" placeholder="Email" onChange={set('email')} required />
        <input className="w-full border p-2 rounded" placeholder="Password" value={form.password} onChange={set('password')} required />
        <input className="w-full border p-2 rounded" placeholder="Phone (+92...)" onChange={set('phone')} required />

        <select className="w-full border p-2 rounded" value={form.condition} onChange={set('condition')}>
          <option value="diabetes">Diabetes</option>
          <option value="hypertension">Hypertension</option>
          <option value="asthma">Asthma</option>
        </select>

        <input className="w-full border p-2 rounded" type="number" placeholder="Follow-up days"
          value={form.followup_interval_days} onChange={set('followup_interval_days')} />

        <input className="w-full border p-2 rounded" placeholder="Medication name" value={form.medication_name} onChange={set('medication_name')} />
        <input className="w-full border p-2 rounded" placeholder="Dose (e.g. 500mg)" value={form.dose} onChange={set('dose')} />
        <input className="w-full border p-2 rounded" placeholder="Times (comma-separated HH:MM)" value={form.times} onChange={set('times')} />

        <button className="w-full bg-blue-600 text-white py-2 rounded">Create Patient</button>
      </form>
    </div>
  );
}