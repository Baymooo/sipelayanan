import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const s = {
  label: { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', minHeight: 100 },
  btn: { padding: '12px 28px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  err: { color: 'red', fontSize: 13, marginBottom: 12 },
  ok: { color: 'green', fontSize: 13, marginBottom: 12 }
};

export default function PengaduanBaru() {
  const [form, setForm] = useState({ judul: '', kategori: 'infrastruktur', deskripsi: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f && f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('foto', file);

    try {
      await api.post('/pengaduan', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Pengaduan berhasil dikirim!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim pengaduan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 580 }}>
      <h2 style={{ color: '#e67e22', marginBottom: 8 }}>Buat Pengaduan</h2>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Sampaikan laporan atau keluhan terkait lingkungan dan pelayanan kelurahan.
      </p>

      {error && <p style={s.err}>{error}</p>}
      {success && <p style={s.ok}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label style={s.label}>Judul Pengaduan</label>
        <input style={s.input} required value={form.judul}
          onChange={e => setForm({ ...form, judul: e.target.value })}
          placeholder="Contoh: Jalan berlubang di RT 03" />

        <label style={s.label}>Kategori</label>
        <select style={s.select} value={form.kategori}
          onChange={e => setForm({ ...form, kategori: e.target.value })}>
          <option value="infrastruktur">Infrastruktur (jalan, drainase)</option>
          <option value="kebersihan">Kebersihan & Sampah</option>
          <option value="keamanan">Keamanan & Ketertiban</option>
          <option value="pelayanan">Pelayanan Kelurahan</option>
          <option value="lainnya">Lainnya</option>
        </select>

        <label style={s.label}>Deskripsi Lengkap</label>
        <textarea style={s.textarea} required value={form.deskripsi}
          onChange={e => setForm({ ...form, deskripsi: e.target.value })}
          placeholder="Jelaskan masalah secara detail, termasuk lokasi dan waktu kejadian..." />

        <label style={s.label}>Foto Bukti (opsional, JPG/PNG, maks 5MB)</label>
        <input style={{ ...s.input, padding: '8px 12px' }} type="file"
          accept=".jpg,.jpeg,.png" onChange={handleFile} />

        {preview && (
          <img src={preview} alt="preview"
            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
        )}

        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Pengaduan'}
        </button>
      </form>
    </div>
  );
}
