import express from 'express';
import {
  getQuizzesForCourse,
  getQuizById,
  submitQuiz,
  getQuizAttempts,
  createQuiz,
  addQuestion,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import {
  createQuizSchema,
  createQuestionSchema,
  submitQuizSchema,
} from '../validators/quizValidator.js';

const router = express.Router();

router.use(protect);

router.get('/courses/:courseId', getQuizzesForCourse);
router.get('/:id', getQuizById);
router.post('/:id/submit', validate(submitQuizSchema), submitQuiz);
router.get('/:id/attempts', getQuizAttempts);

// Instructor routes
router.post(
  '/courses/:courseId',
  authorize('instructor', 'admin'),
  validate(createQuizSchema),
  createQuiz
);
router.post(
  '/:id/questions',
  authorize('instructor', 'admin'),
  validate(createQuestionSchema),
  addQuestion
);

export default router;
