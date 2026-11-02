import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUploadDir = path.join(__dirname, '../../uploads');

// Ensure directories exist
['images', 'documents', 'assignments', 'certificates'].forEach((folder) => {
  const dir = path.join(baseUploadDir, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subFolder = 'documents';
    if (file.mimetype.startsWith('image/')) {
      subFolder = 'images';
    } else if (req.baseUrl.includes('assignment')) {
      subFolder = 'assignments';
    }
    cb(null, path.join(baseUploadDir, subFolder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|pdf|doc|docx|zip|mp4/;
  const ext = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (ext) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Allowed: images, PDFs, Word docs, zip, mp4'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
  fileFilter,
});
