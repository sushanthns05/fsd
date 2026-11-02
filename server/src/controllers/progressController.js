import { Progress, Course, Lesson, Enrollment, Notification } from '../models/index.js';

export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    let progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress) {
      // Create if enrolled
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (enrollment) {
        progress = await Progress.create({
          student: req.user._id,
          course: courseId,
          completedLessons: [],
          lessonProgress: [],
          percentCompleted: 0,
          isCompleted: false,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No enrollment found for this course.',
        });
      }
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (err) {
    next(err);
  }
};

export const updateLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const { lastPositionSeconds, markCompleted } = req.body;

    let progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        student: req.user._id,
        course: courseId,
        completedLessons: [],
        lessonProgress: [],
        percentCompleted: 0,
        isCompleted: false,
      });
    }

    // Update position
    const itemIndex = progress.lessonProgress.findIndex(
      (lp) => lp.lesson.toString() === lessonId
    );

    if (itemIndex > -1) {
      progress.lessonProgress[itemIndex].lastPositionSeconds = lastPositionSeconds || progress.lessonProgress[itemIndex].lastPositionSeconds;
      if (markCompleted) {
        progress.lessonProgress[itemIndex].completedAt = new Date();
      }
    } else {
      progress.lessonProgress.push({
        lesson: lessonId,
        lastPositionSeconds: lastPositionSeconds || 0,
        completedAt: markCompleted ? new Date() : undefined,
      });
    }

    // Add to completedLessons if requested
    if (markCompleted) {
      const alreadyMarked = progress.completedLessons.some(
        (id) => id.toString() === lessonId
      );
      if (!alreadyMarked) {
        progress.completedLessons.push(lessonId);
      }
    }

    // Calculate completion percentage
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    if (totalLessons > 0) {
      const percent = Math.min(
        100,
        Math.round((progress.completedLessons.length / totalLessons) * 100)
      );
      progress.percentCompleted = percent;

      if (percent === 100 && !progress.isCompleted) {
        progress.isCompleted = true;
        // Update enrollment
        await Enrollment.findOneAndUpdate(
          { student: req.user._id, course: courseId },
          { status: 'completed', completedAt: new Date() }
        );

        // Course completion notification
        const course = await Course.findById(courseId);
        await Notification.create({
          recipient: req.user._id,
          title: 'Course Completed! 🎉',
          message: `Congratulations! You have completed 100% of "${course?.title}". Claim your certificate now!`,
          type: 'certificate',
          linkUrl: `/student/certificates`,
        });
      }
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully.',
      progress,
    });
  } catch (err) {
    next(err);
  }
};
