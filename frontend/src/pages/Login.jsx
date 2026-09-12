import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button, Field } from '../components/ui';
import heroImg from '../assets/doctor-patient.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      nav(data.user.role === 'doctor' ? '/doctor' : '/me');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ct-container grid min-h-[calc(100vh-4.5rem)] items-center gap-8 py-10 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-[1.75rem] bg-navy lg:block lg:min-h-[640px]">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-teal-200">
            Care that continues
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight">
            Stay on track.
            <br />
            Stay healthier.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-slate-200">
            A connected experience for clinics and patients between visits.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md rounded-card border border-line bg-white p-8 shadow-card">
        <Logo to="/" className="mb-6" />
        <p className="ct-kicker">Secure access</p>
        <h2 className="ct-display mt-2 text-3xl">Welcome back</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Log in to continue to your CareTrack workspace.
        </p>

        {error && (
          <div className="mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-6" noValidate>
          <Field label="Email address" id="login-email">
            <input
              id="login-email"
              className="ct-input"
              type="email"
              autoComplete="email"
              placeholder="you@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Password" id="login-password">
            <input
              id="login-password"
              className="ct-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" variant="navy" className="mt-2 w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          No account?{' '}
          <Link to="/register" className="font-semibold text-care-teal hover:underline">
            Register as doctor
          </Link>
        </p>
      </div>
    </div>
  );
}
