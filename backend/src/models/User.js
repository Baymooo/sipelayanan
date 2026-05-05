const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nama: { type: DataTypes.STRING, allowNull: false },
  nik: { type: DataTypes.STRING(16), allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('warga', 'admin'), defaultValue: 'warga' }
}, { tableName: 'users', timestamps: true });

module.exports = User;
