import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/single', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  let sub = 'documents';
  if (req.file.mimetype.startsWith('image/')) sub = 'images';
  if (req.baseUrl.includes('assignment')) sub = 'assignments';

  const fileUrl = `/uploads/${sub}/${req.file.filename}`;

  res.status(200).json({
    success: true,
    fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
  });
});

export default router;
