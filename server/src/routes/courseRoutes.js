import express from 'express';
import {
  getAllCourses,
  getCourseBySlug,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  submitCourseForReview,
  getCategories,
} from '../controllers/courseController.js';
import {
  createSection,
  updateSection,
  deleteSection,
} from '../controllers/sectionController.js';
import {
  createLesson,
  updateLesson,
  deleteLesson,
  getCourseCurriculumProtected,
} from '../controllers/lessonController.js';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import {
  createCourseSchema,
  updateCourseSchema,
  sectionSchema,
  lessonSchema,
} from '../validators/courseValidator.js';

const router = express.Router();

// Categories
router.get('/categories', getCategories);

// Instructor-specific
router.get(
  '/instructor/my-courses',
  protect,
  authorize('instructor', 'admin'),
  getInstructorCourses
);

// Course CRUD
router.get('/', getAllCourses);
router.post(
  '/',
  protect,
  authorize('instructor', 'admin'),
  validate(createCourseSchema),
  createCourse
);

router.get('/:slug', optionalAuth, getCourseBySlug);
router.patch(
  '/:id',
  protect,
  authorize('instructor', 'admin'),
  validate(updateCourseSchema),
  updateCourse
);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.post(
  '/:id/submit',
  protect,
  authorize('instructor', 'admin'),
  submitCourseForReview
);

// Protected learning curriculum
router.get('/:courseId/curriculum', protect, getCourseCurriculumProtected);

// Sections
router.post(
  '/:courseId/sections',
  protect,
  authorize('instructor', 'admin'),
  validate(sectionSchema),
  createSection
);
router.patch(
  '/sections/:id',
  protect,
  authorize('instructor', 'admin'),
  validate(sectionSchema),
  updateSection
);
router.delete(
  '/sections/:id',
  protect,
  authorize('instructor', 'admin'),
  deleteSection
);

// Lessons
router.post(
  '/sections/:sectionId/lessons',
  protect,
  authorize('instructor', 'admin'),
  validate(lessonSchema),
  createLesson
);
router.patch(
  '/lessons/:id',
  protect,
  authorize('instructor', 'admin'),
  updateLesson
);
router.delete(
  '/lessons/:id',
  protect,
  authorize('instructor', 'admin'),
  deleteLesson
);

export default router;
