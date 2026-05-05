import React, { useEffect, useState } from 'react';
import api from '../api';

const statusColor = { menunggu: '#856404', diproses: '#084298', selesai: '#0a3622', ditolak: '#842029' };
const statusBg   = { menunggu: '#fff3cd', diproses: '#cfe2ff', selesai: '#d1e7dd', ditolak: '#f8d7da' };

export default function RiwayatPengajuan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pengajuan').then(r => {
      setData(r.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Memuat data...</p>;

  return (
    <div>
      <h2 style={{ color: '#1a6eb5', marginBottom: 20 }}>Riwayat Pengajuan Surat</h2>
      {data.length === 0 ? (
        <p style={{ color: '#999' }}>Belum ada pengajuan.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#1a6eb5', color: '#fff' }}>
              {['Jenis Surat', 'Keperluan', 'Tanggal', 'Status', 'Dokumen'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? '#f8faff' : '#fff' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, textTransform: 'capitalize' }}>{p.jenis_surat}</td>
                <td style={{ padding: '10px 14px', color: '#555' }}>{p.keperluan?.substring(0, 50)}{p.keperluan?.length > 50 ? '...' : ''}</td>
                <td style={{ padding: '10px 14px', color: '#777' }}>{new Date(p.createdAt).toLocaleDateString('id-ID')}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: statusBg[p.status], color: statusColor[p.status], padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {p.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {p.dokumen_url
                    ? <a href={p.dokumen_url} target="_blank" rel="noreferrer" style={{ color: '#1a6eb5' }}>Lihat</a>
                    : <span style={{ color: '#ccc' }}>-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data.some(p => p.catatan_admin) && (
        <div style={{ marginTop: 24 }}>
          <h3>Catatan Admin</h3>
          {data.filter(p => p.catatan_admin).map(p => (
            <div key={p.id} style={{ padding: '12px 16px', background: '#fff8e1', borderRadius: 8, marginBottom: 8, fontSize: 14 }}>
              <strong>Surat {p.jenis_surat}:</strong> {p.catatan_admin}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
