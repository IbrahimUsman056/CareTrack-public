import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Button, Card, Field } from '../components/ui';

export default function AddPatient() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: 'pass123',
    phone: '',
    condition: 'diabetes',
    followup_interval_days: 30,
    medication_name: 'Metformin',
    dose: '500mg',
    times: '08:00,20:00',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      condition: form.condition,
      followup_interval_days: Number(form.followup_interval_days),
      medications: form.medication_name
        ? [
            {
              name: form.medication_name,
              dose: form.dose,
              times: form.times.split(',').map((s) => s.trim()).filter(Boolean),
            },
          ]
        : [],
    };
    try {
      const { data } = await api.post('/patients', payload);
      nav(`/patient/${data.patient.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ct-container py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/doctor" className="text-sm font-semibold text-care-blue hover:underline">
          ← Back to dashboard
        </Link>

        <Card className="mt-4 p-6 sm:p-8">
          <p className="ct-kicker">Onboard</p>
          <h1 className="ct-display mt-2 text-3xl">Add new patient</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Create a chronic-care profile with medications and follow-up cadence. The patient can then
            log in and record readings.
          </p>

          {error && (
            <div className="mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-6 grid gap-1 sm:grid-cols-2 sm:gap-x-4">
            <div className="sm:col-span-2">
              <Field label="Full name" id="full_name">
                <input id="full_name" className="ct-input" placeholder="Patient full name" value={form.full_name} onChange={set('full_name')} required />
              </Field>
            </div>
            <Field label="Email" id="email">
              <input id="email" className="ct-input" type="email" placeholder="patient@email.com" value={form.email} onChange={set('email')} required />
            </Field>
            <Field label="Password" id="password" hint="Shared with patient for portal access">
              <input id="password" className="ct-input" value={form.password} onChange={set('password')} required />
            </Field>
            <Field label="Phone" id="phone">
              <input id="phone" className="ct-input" placeholder="+92…" value={form.phone} onChange={set('phone')} required />
            </Field>
            <Field label="Condition" id="condition">
              <select id="condition" className="ct-input" value={form.condition} onChange={set('condition')}>
                <option value="diabetes">Diabetes</option>
                <option value="hypertension">Hypertension</option>
                <option value="asthma">Asthma</option>
              </select>
            </Field>
            <Field label="Follow-up interval (days)" id="followup">
              <input
                id="followup"
                className="ct-input"
                type="number"
                min="1"
                value={form.followup_interval_days}
                onChange={set('followup_interval_days')}
              />
            </Field>
            <div className="sm:col-span-2 mt-2 border-t border-line pt-4">
              <p className="mb-3 text-sm font-semibold text-navy">Initial medication (optional)</p>
            </div>
            <Field label="Medication name" id="med_name">
              <input id="med_name" className="ct-input" value={form.medication_name} onChange={set('medication_name')} />
            </Field>
            <Field label="Dose" id="dose">
              <input id="dose" className="ct-input" placeholder="500mg" value={form.dose} onChange={set('dose')} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Times" id="times" hint="Comma-separated HH:MM values">
                <input id="times" className="ct-input" placeholder="08:00,20:00" value={form.times} onChange={set('times')} />
              </Field>
            </div>
            <div className="sm:col-span-2 mt-2">
              <Button type="submit" variant="teal" className="w-full" disabled={loading}>
                {loading ? 'Creating…' : 'Create patient'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
