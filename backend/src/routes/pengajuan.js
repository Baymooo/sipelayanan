const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadToS3 } = require('../config/s3');
const Pengajuan = require('../models/Pengajuan');
const { auth, adminOnly } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format file tidak didukung'));
  }
});

// POST /api/pengajuan — buat pengajuan baru
router.post('/', auth, upload.single('dokumen'), async (req, res) => {
  try {
    let dokumenUrl = null;
    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const fileName = `dokumen/${Date.now()}-${req.user.id}.${ext}`;
      dokumenUrl = await uploadToS3(req.file, fileName);
    }
    const pengajuan = await Pengajuan.create({
      ...req.body,
      dokumen_url: dokumenUrl,
      user_id: req.user.id
    });
    res.status(201).json({ success: true, data: pengajuan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pengajuan — list pengajuan milik user
router.get('/', auth, async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
    const data = await Pengajuan.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pengajuan/:id — detail satu pengajuan
router.get('/:id', auth, async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findByPk(req.params.id);
    if (!pengajuan) return res.status(404).json({ message: 'Tidak ditemukan' });
    res.json({ success: true, data: pengajuan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/pengajuan/:id/status — update status (admin only)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status, catatan_admin } = req.body;
    await Pengajuan.update({ status, catatan_admin }, { where: { id: req.params.id } });
    res.json({ success: true, message: 'Status diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
