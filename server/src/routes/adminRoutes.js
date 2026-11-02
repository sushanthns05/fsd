import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getPendingCourses,
  reviewCourseApproval,
  createCategory,
  getAllReviewsAdmin,
  deleteReviewAdmin,
  getAuditLogs,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/courses/pending', getPendingCourses);
router.patch('/courses/:id/approval', reviewCourseApproval);
router.post('/categories', createCategory);
router.get('/reviews', getAllReviewsAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);
router.get('/audit-logs', getAuditLogs);

export default router;
