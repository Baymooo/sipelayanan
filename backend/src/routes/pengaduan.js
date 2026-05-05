const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadToS3 } = require('../config/s3');
const Pengaduan = require('../models/Pengaduan');
const { auth, adminOnly } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/pengaduan — buat pengaduan baru dengan upload foto
router.post('/', auth, upload.single('foto'), async (req, res) => {
  try {
    let fotoUrl = null;
    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const fileName = `pengaduan/${Date.now()}-${req.user.id}.${ext}`;
      fotoUrl = await uploadToS3(req.file, fileName);
    }
    const pengaduan = await Pengaduan.create({
      ...req.body,
      foto_url: fotoUrl,
      user_id: req.user.id
    });
    res.status(201).json({ success: true, data: pengaduan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pengaduan
router.get('/', auth, async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
    const data = await Pengaduan.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/pengaduan/:id/status (admin only)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    await Pengaduan.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ success: true, message: 'Status diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
