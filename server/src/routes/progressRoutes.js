import express from 'express';
import {
  getCourseProgress,
  updateLessonProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/courses/:courseId', getCourseProgress);
router.patch('/courses/:courseId/lessons/:lessonId', updateLessonProgress);

export default router;
