import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Button, Card, Field, LoadingState } from '../components/ui';

const TYPES = [
  { value: 'sugar', label: 'Blood sugar', unit: 'mg/dL', hint: 'Typical fasting range varies — enter your meter reading.' },
  { value: 'bp_sys', label: 'Blood pressure (systolic)', unit: 'mmHg', hint: 'Top number of your BP reading.' },
  { value: 'bp_dia', label: 'Blood pressure (diastolic)', unit: 'mmHg', hint: 'Bottom number of your BP reading.' },
  { value: 'weight', label: 'Weight', unit: 'kg', hint: 'Use the same scale when possible.' },
];

export default function LogReading() {
  const [profile, setProfile] = useState(null);
  const [type, setType] = useState('sugar');
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/patients/me/profile').then((r) => setProfile(r.data)).catch(console.error);
  }, []);

  const meta = TYPES.find((t) => t.value === type) || TYPES[0];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!profile) return;

    const num = Number(value);
    if (value === '' || Number.isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }
    if (num <= 0) {
      setError('Value must be greater than zero.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/readings', { patient_id: profile.id, type, value: num });
      setMsg('Reading saved successfully.');
      setValue('');
      setTimeout(() => {
        setMsg('');
        nav('/me');
      }, 900);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save reading');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <LoadingState label="Preparing logging form…" />;

  return (
    <div className="ct-container py-10">
      <div className="mx-auto max-w-lg">
        <Link to="/me" className="text-sm font-semibold text-care-blue hover:underline">
          ← Back to my health
        </Link>

        <Card className="mt-4 p-6 sm:p-8">
          <p className="ct-kicker">Health logging</p>
          <h1 className="ct-display mt-2 text-3xl">Log a reading</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Keep your care team updated between visits. Choose a reading type and enter the value.
          </p>

          {msg && (
            <div className="mt-4 rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-success" role="status">
              {msg}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-6" noValidate>
            <Field label="Reading type" id="reading-type">
              <select
                id="reading-type"
                className="ct-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={`Value (${meta.unit})`} id="reading-value" hint={meta.hint}>
              <input
                id="reading-value"
                className="ct-input text-lg"
                type="number"
                step="any"
                inputMode="decimal"
                placeholder={`e.g. ${type === 'weight' ? '72.5' : type.startsWith('bp') ? '120' : '110'}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </Field>

            <p className="mb-4 text-xs text-ink-muted">
              Date & time are recorded automatically when you save.
            </p>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Save reading'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
