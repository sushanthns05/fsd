import { Assignment, Submission, Course, Notification } from '../models/index.js';

export const getAssignmentsForCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId, isActive: true })
      .sort({ createdAt: 1 });

    // If student, attach their submission status
    const assignmentIds = assignments.map((a) => a._id);
    let mySubmissions = [];
    if (req.user && req.user.role === 'student') {
      mySubmissions = await Submission.find({
        assignment: { $in: assignmentIds },
        student: req.user._id,
      });
    }

    const submissionMap = {};
    mySubmissions.forEach((sub) => {
      submissionMap[sub.assignment.toString()] = sub;
    });

    const result = assignments.map((a) => ({
      ...a.toObject(),
      submission: submissionMap[a._id.toString()] || null,
    }));

    res.status(200).json({
      success: true,
      assignments: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).populate('course', 'title instructor');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    let mySubmission = null;
    if (req.user) {
      mySubmission = await Submission.findOne({
        assignment: id,
        student: req.user._id,
      }).populate('gradedBy', 'name');
    }

    res.status(200).json({
      success: true,
      assignment,
      submission: mySubmission,
    });
  } catch (err) {
    next(err);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, instructions, totalMarks, passingMarks, deadline, section, referenceFiles } =
      req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const assignment = await Assignment.create({
      course: courseId,
      section: section || undefined,
      title,
      instructions,
      totalMarks: totalMarks || 100,
      passingMarks: passingMarks || 50,
      deadline: deadline ? new Date(deadline) : undefined,
      referenceFiles: referenceFiles || [],
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully.',
      assignment,
    });
  } catch (err) {
    next(err);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { submissionFiles, studentNotes } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    let submission = await Submission.findOne({
      assignment: id,
      student: req.user._id,
    });

    if (submission) {
      submission.submissionFiles = submissionFiles;
      submission.studentNotes = studentNotes || '';
      submission.status = 'submitted';
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      submission = await Submission.create({
        assignment: id,
        student: req.user._id,
        course: assignment.course,
        submissionFiles,
        studentNotes: studentNotes || '',
        status: 'submitted',
      });
    }

    // In-app notification to student
    await Notification.create({
      recipient: req.user._id,
      title: 'Assignment Submitted',
      message: `Your submission for "${assignment.title}" has been received and is pending instructor evaluation.`,
      type: 'assignment',
      linkUrl: `/student/assignments`,
    });

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully!',
      submission,
    });
  } catch (err) {
    next(err);
  }
};

export const getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).populate('course');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    if (
      assignment.course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const submissions = await Submission.find({ assignment: id })
      .populate('student', 'name email avatar')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      assignmentTitle: assignment.title,
      totalMarks: assignment.totalMarks,
      submissions,
    });
  } catch (err) {
    next(err);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { marksAwarded, feedback, status } = req.body;

    const submission = await Submission.findById(submissionId).populate({
      path: 'assignment',
      populate: { path: 'course' },
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    const courseInstructor = submission.assignment?.course?.instructor;
    if (
      courseInstructor &&
      courseInstructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    submission.marksAwarded = marksAwarded;
    submission.feedback = feedback || '';
    submission.status = status || 'graded';
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    await submission.save();

    // In-app notification to student
    await Notification.create({
      recipient: submission.student,
      title: 'Assignment Graded! 📝',
      message: `Your assignment "${submission.assignment?.title}" was graded. You scored ${marksAwarded}/${submission.assignment?.totalMarks}.`,
      type: 'assignment',
      linkUrl: `/student/assignments`,
    });

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully.',
      submission,
    });
  } catch (err) {
    next(err);
  }
};
