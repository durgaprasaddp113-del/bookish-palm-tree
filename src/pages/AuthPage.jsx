import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'user' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const result =
      mode === 'login'
        ? await signIn(form.email, form.password)
        : await signUp(form.email, form.password, form.fullName, form.role);

    if (result.error) return setMessage(result.error.message);
    setMessage(mode === 'signup' ? 'Signup successful. Verify email before login.' : 'Login successful.');
    if (mode === 'login') navigate('/');
  };

  return (
    <div className="auth-card">
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={submit}>
        {mode === 'signup' && <input placeholder="Full name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />}
        <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {mode === 'signup' && (
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit">Continue</button>
      </form>
      <p>{message}</p>
      <button className="link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        Switch to {mode === 'login' ? 'Sign Up' : 'Login'}
      </button>
    </div>
  );
}
