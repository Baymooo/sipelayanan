import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const s = {
  label: { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', minHeight: 100 },
  btn: { padding: '12px 28px', background: '#1a6eb5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  err: { color: 'red', fontSize: 13, marginBottom: 12 },
  ok: { color: 'green', fontSize: 13, marginBottom: 12 }
};

export default function PengajuanBaru() {
  const [form, setForm] = useState({ nama_pemohon: '', nik: '', jenis_surat: 'domisili', keperluan: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Dokumen pendukung wajib diunggah (PDF/JPG/PNG)'); return; }
    setLoading(true); setError('');

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append('dokumen', file);

    try {
      await api.post('/pengajuan', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Pengajuan berhasil dikirim! Anda akan diarahkan ke riwayat...');
      setTimeout(() => navigate('/riwayat'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim pengajuan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 580 }}>
      <h2 style={{ color: '#1a6eb5', marginBottom: 8 }}>Pengajuan Surat Baru</h2>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Isi formulir di bawah dan lampirkan dokumen pendukung (KTP / KK).
      </p>

      {error && <p style={s.err}>{error}</p>}
      {success && <p style={s.ok}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label style={s.label}>Nama Lengkap Pemohon</label>
        <input style={s.input} required value={form.nama_pemohon}
          onChange={e => setForm({ ...form, nama_pemohon: e.target.value })} />

        <label style={s.label}>NIK (16 digit)</label>
        <input style={s.input} required maxLength={16} value={form.nik}
          onChange={e => setForm({ ...form, nik: e.target.value.replace(/\D/g, '') })} />

        <label style={s.label}>Jenis Surat</label>
        <select style={s.select} value={form.jenis_surat}
          onChange={e => setForm({ ...form, jenis_surat: e.target.value })}>
          <option value="domisili">Surat Domisili</option>
          <option value="usaha">Surat Keterangan Usaha</option>
          <option value="keterangan">Surat Keterangan</option>
          <option value="pengantar">Surat Pengantar</option>
        </select>

        <label style={s.label}>Keperluan / Keterangan</label>
        <textarea style={s.textarea} required value={form.keperluan}
          onChange={e => setForm({ ...form, keperluan: e.target.value })}
          placeholder="Jelaskan keperluan pengajuan surat ini..." />

        <label style={s.label}>Dokumen Pendukung (KTP/KK, PDF/JPG/PNG, maks 5MB)</label>
        <input style={{ ...s.input, padding: '8px 12px' }} type="file" required
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={e => setFile(e.target.files[0])} />

        {file && (
          <p style={{ fontSize: 13, color: '#27ae60', marginTop: -12, marginBottom: 12 }}>
            File dipilih: {file.name} ({(file.size / 1024).toFixed(0)} KB)
          </p>
        )}

        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Mengunggah & Mengirim...' : 'Kirim Pengajuan'}
        </button>
      </form>
    </div>
  );
}
