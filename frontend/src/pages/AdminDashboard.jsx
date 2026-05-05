import React, { useEffect, useState } from 'react';
import api from '../api';

const statusOpts = ['menunggu', 'diproses', 'selesai', 'ditolak'];
const statusBg   = { menunggu: '#fff3cd', diproses: '#cfe2ff', selesai: '#d1e7dd', ditolak: '#f8d7da' };
const statusColor = { menunggu: '#856404', diproses: '#084298', selesai: '#0a3622', ditolak: '#842029' };

export default function AdminDashboard() {
  const [pengajuan, setPengajuan] = useState([]);
  const [pengaduan, setPengaduan] = useState([]);
  const [tab, setTab] = useState('pengajuan');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/pengajuan'), api.get('/pengaduan')]).then(([p, a]) => {
      setPengajuan(p.data.data);
      setPengaduan(a.data.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (type, id, status, catatan_admin = '') => {
    setUpdating(id);
    try {
      await api.patch(`/${type}/${id}/status`, { status, catatan_admin });
      load();
    } finally {
      setUpdating(null);
    }
  };

  const tabBtn = (name, label) => (
    <button onClick={() => setTab(name)} style={{
      padding: '8px 20px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer',
      background: tab === name ? '#1a6eb5' : '#e9ecef',
      color: tab === name ? '#fff' : '#333', fontWeight: 600, fontSize: 14
    }}>{label}</button>
  );

  if (loading) return <p>Memuat data admin...</p>;

  return (
    <div>
      <h2 style={{ color: '#1a6eb5', marginBottom: 20 }}>Panel Admin Kelurahan</h2>

      <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
        {tabBtn('pengajuan', `Pengajuan Surat (${pengajuan.length})`)}
        {tabBtn('pengaduan', `Pengaduan (${pengaduan.length})`)}
      </div>

      <div style={{ border: '1px solid #dee2e6', borderRadius: '0 8px 8px 8px', padding: 20 }}>
        {tab === 'pengajuan' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f0f4ff' }}>
                {['Pemohon', 'NIK', 'Jenis', 'Keperluan', 'Dokumen', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#1a6eb5' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pengajuan.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.nama_pemohon}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>{p.nik}</td>
                  <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{p.jenis_surat}</td>
                  <td style={{ padding: '10px 12px', maxWidth: 200, color: '#555' }}>{p.keperluan?.substring(0, 40)}...</td>
                  <td style={{ padding: '10px 12px' }}>
                    {p.dokumen_url ? <a href={p.dokumen_url} target="_blank" rel="noreferrer" style={{ color: '#1a6eb5' }}>Lihat</a> : '-'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: statusBg[p.status], color: statusColor[p.status], padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      {p.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <select
                      value={p.status}
                      disabled={updating === p.id}
                      onChange={e => updateStatus('pengajuan', p.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #ccc', fontSize: 12 }}>
                      {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'pengaduan' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fff8f0' }}>
                {['Judul', 'Kategori', 'Foto', 'Status', 'Ubah Status'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#e67e22' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pengaduan.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.judul}</td>
                  <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{p.kategori}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {p.foto_url ? <a href={p.foto_url} target="_blank" rel="noreferrer" style={{ color: '#e67e22' }}>Lihat</a> : '-'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: statusBg[p.status] || '#eee', color: statusColor[p.status] || '#333', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      {p.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <select
                      value={p.status}
                      disabled={updating === p.id}
                      onChange={e => updateStatus('pengaduan', p.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #ccc', fontSize: 12 }}>
                      {['masuk', 'diproses', 'selesai'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
