import { Enrollment, Course, Progress, Notification } from '../models/index.js';
import { sendEnrollmentConfirmation } from '../services/emailService.js';

export const enrollFreeCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.status !== 'published') {
      return res.status(400).json({ success: false, message: 'Course is not currently available for enrollment.' });
    }

    if (!course.isFree && course.price > 0) {
      return res.status(400).json({
        success: false,
        message: 'This is a premium course. Please complete checkout to enroll.',
      });
    }

    // Check existing
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.',
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      status: 'active',
      pricePaid: 0,
    });

    // Create learning progress
    await Progress.create({
      student: req.user._id,
      course: courseId,
      completedLessons: [],
      lessonProgress: [],
      percentCompleted: 0,
      isCompleted: false,
    });

    // Increment enrolledCount
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    // In-app Notification
    await Notification.create({
      recipient: req.user._id,
      title: 'Enrollment Confirmed!',
      message: `You have successfully enrolled in "${course.title}". Start your learning journey now!`,
      type: 'course',
      linkUrl: `/learn/${course._id}`,
    });

    sendEnrollmentConfirmation(req.user, course).catch((e) => console.error(e));

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: { $in: ['active', 'completed'] },
    })
      .populate({
        path: 'course',
        populate: [
          { path: 'instructor', select: 'name avatar headline' },
          { path: 'category', select: 'name slug icon' },
        ],
      })
      .sort({ updatedAt: -1 });

    const courseIds = enrollments.map((e) => e.course?._id).filter(Boolean);
    const progresses = await Progress.find({
      student: req.user._id,
      course: { $in: courseIds },
    });

    const progressMap = {};
    progresses.forEach((p) => {
      progressMap[p.course.toString()] = {
        percentCompleted: p.percentCompleted,
        isCompleted: p.isCompleted,
        completedLessonsCount: p.completedLessons.length,
      };
    });

    const results = enrollments
      .filter((e) => e.course)
      .map((e) => ({
        enrollmentId: e._id,
        course: e.course,
        enrolledAt: e.enrolledAt,
        status: e.status,
        progress: progressMap[e.course._id.toString()] || {
          percentCompleted: 0,
          isCompleted: false,
          completedLessonsCount: 0,
        },
      }));

    res.status(200).json({
      success: true,
      courses: results,
    });
  } catch (err) {
    next(err);
  }
};

export const checkEnrollmentStatus = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: { $in: ['active', 'completed'] },
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};
