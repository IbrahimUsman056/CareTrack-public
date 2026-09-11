import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { ...form, role: 'doctor' });
      login(data.token, data.user);
      nav('/doctor');
    } catch (err) {
      setError(err.response?.data?.error || 'Register failed');
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register as Doctor</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Full name" onChange={set('full_name')} />
        <input className="w-full border p-2 rounded" placeholder="Email" onChange={set('email')} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={set('password')} />
        <input className="w-full border p-2 rounded" placeholder="Phone (+92...)" onChange={set('phone')} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
      <p className="text-sm mt-3">
        Have an account? <Link to="/" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
}