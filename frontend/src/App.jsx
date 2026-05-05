import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PengajuanBaru from './pages/PengajuanBaru';
import PengaduanBaru from './pages/PengaduanBaru';
import RiwayatPengajuan from './pages/RiwayatPengajuan';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/pengajuan/baru" element={<PrivateRoute><PengajuanBaru /></PrivateRoute>} />
          <Route path="/pengaduan/baru" element={<PrivateRoute><PengaduanBaru /></PrivateRoute>} />
          <Route path="/riwayat" element={<PrivateRoute><RiwayatPengajuan /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
