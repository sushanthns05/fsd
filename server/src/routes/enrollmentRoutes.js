import express from 'express';
import {
  enrollFreeCourse,
  getMyCourses,
  checkEnrollmentStatus,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/free', enrollFreeCourse);
router.get('/my-courses', getMyCourses);
router.get('/check/:courseId', checkEnrollmentStatus);

export default router;
