import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button, Field } from '../components/ui';
import heroImg from '../assets/doctor-patient.jpg';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.full_name.trim() || !form.email.trim() || !form.password || !form.phone.trim()) {
      setError('Please complete all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...form, role: 'doctor' });
      login(data.token, data.user);
      nav('/doctor');
    } catch (err) {
      setError(err.response?.data?.error || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="ct-container grid min-h-[calc(100vh-4.5rem)] items-center gap-8 py-10 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-[1.75rem] bg-navy lg:block lg:min-h-[680px]">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-teal-200">
            For clinics
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight">
            Start your CareTrack clinic workspace.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-slate-200">
            Onboard patients, send reminders, and see who needs attention between visits.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md rounded-card border border-line bg-white p-8 shadow-card">
        <Logo to="/" className="mb-6" />
        <p className="ct-kicker">Get started</p>
        <h2 className="ct-display mt-2 text-3xl">Register as Doctor</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Create your clinic account. Patients are onboarded by their doctor.
        </p>

        {error && (
          <div className="mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-6" noValidate>
          <Field label="Full name" id="reg-name">
            <input id="reg-name" className="ct-input" placeholder="Dr. Sara Ahmed" value={form.full_name} onChange={set('full_name')} required />
          </Field>
          <Field label="Email address" id="reg-email">
            <input id="reg-email" className="ct-input" type="email" placeholder="you@clinic.com" value={form.email} onChange={set('email')} required />
          </Field>
          <Field label="Password" id="reg-password" hint="At least 6 characters">
            <input id="reg-password" className="ct-input" type="password" placeholder="Create a password" value={form.password} onChange={set('password')} required />
          </Field>
          <Field label="Phone" id="reg-phone" hint="Include country code, e.g. +92…">
            <input id="reg-phone" className="ct-input" placeholder="+92 300 0000000" value={form.phone} onChange={set('phone')} required />
          </Field>
          <Button type="submit" variant="teal" className="mt-2 w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Have an account?{' '}
          <Link to="/login" className="font-semibold text-care-teal hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
