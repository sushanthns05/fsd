import express from 'express';
import {
  generateCertificate,
  getMyCertificates,
  verifyCertificatePublic,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public verification
router.get('/verify/:certificateId', verifyCertificatePublic);

// Student protected
router.get('/my-certificates', protect, getMyCertificates);
router.post('/generate', protect, generateCertificate);

export default router;
