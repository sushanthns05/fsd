import { Section, Course, Lesson } from '../models/index.js';

export const createSection = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description, orderIndex } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const count = await Section.countDocuments({ course: courseId });
    const section = await Section.create({
      course: courseId,
      title,
      description: description || '',
      orderIndex: orderIndex !== undefined ? orderIndex : count,
    });

    res.status(201).json({
      success: true,
      message: 'Section created successfully.',
      section,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, orderIndex } = req.body;

    const section = await Section.findById(id).populate('course');
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found.' });
    }

    if (
      section.course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (title) section.title = title;
    if (description !== undefined) section.description = description;
    if (orderIndex !== undefined) section.orderIndex = orderIndex;

    await section.save();

    res.status(200).json({
      success: true,
      message: 'Section updated successfully.',
      section,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id).populate('course');
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found.' });
    }

    if (
      section.course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await Lesson.deleteMany({ section: section._id });
    await Section.findByIdAndDelete(id);

    // Update course lesson count
    const lessonCount = await Lesson.countDocuments({ course: section.course._id });
    await Course.findByIdAndUpdate(section.course._id, { totalLessons: lessonCount });

    res.status(200).json({
      success: true,
      message: 'Section and associated lessons removed.',
    });
  } catch (err) {
    next(err);
  }
};
