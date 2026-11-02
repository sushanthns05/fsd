import express from 'express';
import {
  createOrder,
  verifyPayment,
  getMyTransactions,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/my-transactions', getMyTransactions);

export default router;
