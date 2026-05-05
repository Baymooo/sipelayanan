import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const s = {
  wrap: { maxWidth: 400, margin: '60px auto', padding: 32, border: '1px solid #dde', borderRadius: 12 },
  title: { textAlign: 'center', color: '#1a6eb5', marginBottom: 24 },
  label: { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#1a6eb5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  err: { color: 'red', fontSize: 13, marginBottom: 12 }
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <h2 style={s.title}>Masuk ke SiPelayanan</h2>
      {error && <p style={s.err}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <label style={s.label}>Password</label>
        <input style={s.input} type="password" required value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
}
