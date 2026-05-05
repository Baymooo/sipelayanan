import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const s = {
  wrap: { maxWidth: 440, margin: '40px auto', padding: 32, border: '1px solid #dde', borderRadius: 12 },
  title: { textAlign: 'center', color: '#1a6eb5', marginBottom: 24 },
  label: { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#1a6eb5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  err: { color: 'red', fontSize: 13, marginBottom: 12 },
  ok: { color: 'green', fontSize: 13, marginBottom: 12 }
};

export default function Register() {
  const [form, setForm] = useState({ nama: '', nik: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nik.length !== 16) { setError('NIK harus 16 digit'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', form);
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <h2 style={s.title}>Daftar Akun Warga</h2>
      {error && <p style={s.err}>{error}</p>}
      {success && <p style={s.ok}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label style={s.label}>Nama Lengkap</label>
        <input style={s.input} required value={form.nama}
          onChange={e => setForm({ ...form, nama: e.target.value })} />
        <label style={s.label}>NIK (16 digit)</label>
        <input style={s.input} required maxLength={16} value={form.nik}
          onChange={e => setForm({ ...form, nik: e.target.value.replace(/\D/g, '') })} />
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <label style={s.label}>Password</label>
        <input style={s.input} type="password" required minLength={6} value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        Sudah punya akun? <Link to="/login">Masuk</Link>
      </p>
    </div>
  );
}
