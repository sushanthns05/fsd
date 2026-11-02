import { Lesson, Section, Course, Enrollment } from '../models/index.js';

export const createLesson = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const {
      title,
      description,
      type,
      videoUrl,
      videoDurationSeconds,
      contentBody,
      isPreviewAllowed,
      orderIndex,
      resources,
    } = req.body;

    const section = await Section.findById(sectionId).populate('course');
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found.' });
    }

    if (
      section.course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const count = await Lesson.countDocuments({ section: sectionId });
    const lesson = await Lesson.create({
      course: section.course._id,
      section: sectionId,
      title,
      description: description || '',
      type: type || 'video',
      videoUrl: videoUrl || '',
      videoDurationSeconds: videoDurationSeconds || 0,
      contentBody: contentBody || '',
      isPreviewAllowed: !!isPreviewAllowed,
      orderIndex: orderIndex !== undefined ? orderIndex : count,
      resources: resources || [],
    });

    // Update course metadata
    const allLessons = await Lesson.find({ course: section.course._id });
    const totalDurationSeconds = allLessons.reduce((acc, l) => acc + (l.videoDurationSeconds || 0), 0);
    await Course.findByIdAndUpdate(section.course._id, {
      totalLessons: allLessons.length,
      totalDurationMinutes: Math.round(totalDurationSeconds / 60),
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully.',
      lesson,
    });
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).populate('course');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    if (
      lesson.course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    Object.assign(lesson, req.body);
    await lesson.save();

    // Recalculate duration
    const allLessons = await Lesson.find({ course: lesson.course._id });
    const totalDurationSeconds = allLessons.reduce((acc, l) => acc + (l.videoDurationSeconds || 0), 0);
    await Course.findByIdAndUpdate(lesson.course._id, {
      totalDurationMinutes: Math.round(totalDurationSeconds / 60),
    });

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully.',
      lesson,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).populate('course');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    if (
      lesson.course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const courseId = lesson.course._id;
    await Lesson.findByIdAndDelete(id);

    const allLessons = await Lesson.find({ course: courseId });
    const totalDurationSeconds = allLessons.reduce((acc, l) => acc + (l.videoDurationSeconds || 0), 0);
    await Course.findByIdAndUpdate(courseId, {
      totalLessons: allLessons.length,
      totalDurationMinutes: Math.round(totalDurationSeconds / 60),
    });

    res.status(200).json({
      success: true,
      message: 'Lesson removed successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const getCourseCurriculumProtected = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const isInstructor = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    let isEnrolled = false;
    if (!isInstructor && !isAdmin) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
        status: 'active',
      });
      isEnrolled = !!enrollment;
    }

    if (!isInstructor && !isAdmin && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Protected curriculum: You must enroll in this course to access complete lessons.',
      });
    }

    const sections = await Section.find({ course: courseId }).sort({ orderIndex: 1 });
    const sectionIds = sections.map((s) => s._id);

    const lessons = await Lesson.find({ section: { $in: sectionIds } }).sort({ orderIndex: 1 });

    const curriculum = sections.map((sec) => ({
      ...sec.toObject(),
      lessons: lessons.filter((les) => les.section.toString() === sec._id.toString()),
    }));

    res.status(200).json({
      success: true,
      course,
      curriculum,
    });
  } catch (err) {
    next(err);
  }
};
