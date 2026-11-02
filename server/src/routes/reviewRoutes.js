import express from 'express';
import {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { createReviewSchema } from '../validators/reviewValidator.js';

const router = express.Router();

router.get('/courses/:courseId', getCourseReviews);
router.post(
  '/courses/:courseId',
  protect,
  validate(createReviewSchema),
  createReview
);
router.patch('/:id', protect, validate(createReviewSchema), updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
