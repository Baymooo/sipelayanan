const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check — diperlukan untuk ECS health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pengajuan', require('./routes/pengajuan'));
app.use('/api/pengaduan', require('./routes/pengaduan'));

// Sync database lalu start server
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected and synced');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
