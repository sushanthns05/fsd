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

export const getMyGrades = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('assignment', 'title totalMarks passingMarks deadline')
      .populate('course', 'title thumbnail slug')
      .populate('gradedBy', 'name email avatar')
      .sort({ updatedAt: -1 });

    const gradedSubmissions = submissions.filter((s) => s.status === 'graded');
    let totalMarksAwarded = 0;
    let totalPossibleMarks = 0;

    const gradesList = gradedSubmissions.map((sub) => {
      const awarded = sub.marksAwarded || 0;
      const total = sub.assignment?.totalMarks || 100;
      totalMarksAwarded += awarded;
      totalPossibleMarks += total;
      const pct = Math.round((awarded / total) * 100);

      let letter = 'F';
      let gradePoints = 0.0;
      if (pct >= 95) {
        letter = 'A+';
        gradePoints = 4.0;
      } else if (pct >= 90) {
        letter = 'A';
        gradePoints = 4.0;
      } else if (pct >= 85) {
        letter = 'A-';
        gradePoints = 3.7;
      } else if (pct >= 80) {
        letter = 'B+';
        gradePoints = 3.3;
      } else if (pct >= 75) {
        letter = 'B';
        gradePoints = 3.0;
      } else if (pct >= 70) {
        letter = 'B-';
        gradePoints = 2.7;
      } else if (pct >= 60) {
        letter = 'C';
        gradePoints = 2.0;
      }

      return {
        _id: sub._id,
        assignmentId: sub.assignment?._id,
        assignmentTitle: sub.assignment?.title,
        courseId: sub.course?._id,
        courseTitle: sub.course?.title,
        courseThumbnail: sub.course?.thumbnail,
        marksAwarded: awarded,
        totalMarks: total,
        percentage: pct,
        letterGrade: letter,
        gradePoints,
        feedback: sub.feedback,
        gradedAt: sub.gradedAt,
        gradedBy: sub.gradedBy?.name || 'Course Instructor',
        status: sub.status,
      };
    });

    const averagePercentage =
      totalPossibleMarks > 0
        ? Math.round((totalMarksAwarded / totalPossibleMarks) * 100)
        : 0;

    let cumulativeGPA = 0.0;
    let overallGrade = 'N/A';
    if (gradesList.length > 0) {
      const sumPoints = gradesList.reduce((acc, g) => acc + g.gradePoints, 0);
      cumulativeGPA = Number((sumPoints / gradesList.length).toFixed(2));
      if (averagePercentage >= 95) overallGrade = 'A+';
      else if (averagePercentage >= 90) overallGrade = 'A';
      else if (averagePercentage >= 85) overallGrade = 'A-';
      else if (averagePercentage >= 80) overallGrade = 'B+';
      else if (averagePercentage >= 75) overallGrade = 'B';
      else if (averagePercentage >= 70) overallGrade = 'B-';
      else overallGrade = 'C';
    }

    res.status(200).json({
      success: true,
      stats: {
        totalSubmissions: submissions.length,
        gradedCount: gradedSubmissions.length,
        pendingCount: submissions.filter((s) => s.status === 'submitted').length,
        totalMarksAwarded,
        totalPossibleMarks,
        averagePercentage,
        cumulativeGPA,
        overallGrade,
      },
      grades: gradesList,
      submissions,
    });
  } catch (err) {
    next(err);
  }
};
