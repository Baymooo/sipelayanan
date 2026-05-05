import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const s = {
  nav: { background: '#1a6eb5', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 },
  brand: { color: '#fff', fontWeight: 700, fontSize: 18, textDecoration: 'none' },
  links: { display: 'flex', gap: 16, alignItems: 'center' },
  link: { color: '#cce4ff', textDecoration: 'none', fontSize: 14 },
  btn: { background: '#fff', color: '#1a6eb5', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }
};

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={s.nav}>
      <Link to="/dashboard" style={s.brand}>SiPelayanan</Link>
      {token ? (
        <div style={s.links}>
          <Link to="/dashboard" style={s.link}>Beranda</Link>
          <Link to="/pengajuan/baru" style={s.link}>Ajukan Surat</Link>
          <Link to="/pengaduan/baru" style={s.link}>Pengaduan</Link>
          <Link to="/riwayat" style={s.link}>Riwayat</Link>
          {user.role === 'admin' && <Link to="/admin" style={s.link}>Admin</Link>}
          <span style={{ color: '#cce4ff', fontSize: 13 }}>Hai, {user.nama}</span>
          <button style={s.btn} onClick={logout}>Keluar</button>
        </div>
      ) : (
        <div style={s.links}>
          <Link to="/login" style={s.link}>Masuk</Link>
          <Link to="/register" style={{ ...s.link, ...s.btn }}>Daftar</Link>
        </div>
      )}
    </nav>
  );
}
