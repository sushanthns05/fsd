import express from 'express';
import { submitContactMessage, getAllMessages } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/', protect, authorize('admin'), getAllMessages);

export default router;
