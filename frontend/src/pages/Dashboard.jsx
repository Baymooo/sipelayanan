import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const badge = (status) => {
  const map = {
    menunggu: { bg: '#fff3cd', color: '#856404' },
    diproses: { bg: '#cfe2ff', color: '#084298' },
    selesai:  { bg: '#d1e7dd', color: '#0a3622' },
    ditolak:  { bg: '#f8d7da', color: '#842029' },
    masuk:    { bg: '#fff3cd', color: '#856404' },
  };
  const st = map[status] || { bg: '#eee', color: '#333' };
  return (
    <span style={{ ...st, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {status.toUpperCase()}
    </span>
  );
};

const card = {
  border: '1px solid #e0e7ef', borderRadius: 10, padding: '16px 20px',
  marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [pengajuan, setPengajuan] = useState([]);
  const [pengaduan, setPengaduan] = useState([]);

  useEffect(() => {
    api.get('/pengajuan').then(r => setPengajuan(r.data.data.slice(0, 3)));
    api.get('/pengaduan').then(r => setPengaduan(r.data.data.slice(0, 3)));
  }, []);

  return (
    <div>
      <h2 style={{ color: '#1a6eb5' }}>Selamat datang, {user.nama}</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>Kelurahan Maju Bersama - Sistem Pelayanan Online</p>

      {/* Shortcut buttons */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { to: '/pengajuan/baru', label: 'Ajukan Surat Baru', bg: '#1a6eb5' },
          { to: '/pengaduan/baru', label: 'Buat Pengaduan', bg: '#e67e22' },
          { to: '/riwayat', label: 'Lihat Riwayat', bg: '#27ae60' },
        ].map(btn => (
          <Link key={btn.to} to={btn.to} style={{
            background: btn.bg, color: '#fff', padding: '12px 24px',
            borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14
          }}>{btn.label}</Link>
        ))}
      </div>

      {/* Pengajuan terbaru */}
      <h3 style={{ marginBottom: 12 }}>Pengajuan Surat Terbaru</h3>
      {pengajuan.length === 0 ? (
        <p style={{ color: '#999', fontSize: 14 }}>Belum ada pengajuan. <Link to="/pengajuan/baru">Buat sekarang</Link></p>
      ) : pengajuan.map(p => (
        <div key={p.id} style={card}>
          <div>
            <div style={{ fontWeight: 600 }}>Surat {p.jenis_surat}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{p.keperluan?.substring(0, 60)}...</div>
          </div>
          {badge(p.status)}
        </div>
      ))}

      {/* Pengaduan terbaru */}
      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Pengaduan Terbaru</h3>
      {pengaduan.length === 0 ? (
        <p style={{ color: '#999', fontSize: 14 }}>Belum ada pengaduan.</p>
      ) : pengaduan.map(p => (
        <div key={p.id} style={card}>
          <div>
            <div style={{ fontWeight: 600 }}>{p.judul}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{p.kategori}</div>
          </div>
          {badge(p.status)}
        </div>
      ))}
    </div>
  );
}
