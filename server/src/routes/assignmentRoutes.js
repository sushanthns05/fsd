import express from 'express';
import {
  getAssignmentsForCourse,
  getAssignmentById,
  createAssignment,
  submitAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  getMyGrades,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import {
  createAssignmentSchema,
  submitAssignmentSchema,
  gradeAssignmentSchema,
} from '../validators/assignmentValidator.js';

const router = express.Router();

router.use(protect);

router.get('/my/grades', getMyGrades);
router.get('/courses/:courseId', getAssignmentsForCourse);
router.get('/:id', getAssignmentById);
router.post('/:id/submit', validate(submitAssignmentSchema), submitAssignment);

// Instructor routes
router.post(
  '/courses/:courseId',
  authorize('instructor', 'admin'),
  validate(createAssignmentSchema),
  createAssignment
);
router.get(
  '/:id/submissions',
  authorize('instructor', 'admin'),
  getSubmissionsForAssignment
);
router.patch(
  '/submissions/:submissionId/grade',
  authorize('instructor', 'admin'),
  validate(gradeAssignmentSchema),
  gradeSubmission
);

export default router;
