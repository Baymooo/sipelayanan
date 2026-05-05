const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pengaduan = sequelize.define('Pengaduan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  judul: { type: DataTypes.STRING, allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: false },
  kategori: {
    type: DataTypes.ENUM('infrastruktur', 'kebersihan', 'keamanan', 'pelayanan', 'lainnya'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('masuk', 'diproses', 'selesai'),
    defaultValue: 'masuk'
  },
  foto_url: { type: DataTypes.STRING }, // CloudFront URL
  user_id: { type: DataTypes.UUID, allowNull: false }
}, { tableName: 'pengaduan', timestamps: true });

module.exports = Pengaduan;
