const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pengajuan = sequelize.define('Pengajuan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nama_pemohon: { type: DataTypes.STRING, allowNull: false },
  nik: { type: DataTypes.STRING(16), allowNull: false },
  jenis_surat: {
    type: DataTypes.ENUM('domisili', 'usaha', 'keterangan', 'pengantar'),
    allowNull: false
  },
  keperluan: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('menunggu', 'diproses', 'selesai', 'ditolak'),
    defaultValue: 'menunggu'
  },
  dokumen_url: { type: DataTypes.STRING },
  catatan_admin: { type: DataTypes.TEXT },
  user_id: { type: DataTypes.UUID, allowNull: false }
}, { tableName: 'pengajuan', timestamps: true });

module.exports = Pengajuan;
