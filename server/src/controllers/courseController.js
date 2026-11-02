import { Course, Category, Section, Lesson, Enrollment, Review } from '../models/index.js';
import { slugify, getPagination } from '../utils/helpers.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { search, category, difficulty, isFree, sort } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const query = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    if (isFree !== undefined && isFree !== '') {
      query.isFree = isFree === 'true';
    }

    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'popular') {
      sortOption = { enrolledCount: -1 };
    } else if (sort === 'rating') {
      sortOption = { ratingAverage: -1 };
    } else if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar headline')
      .populate('category', 'name slug icon')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

export const getCourseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug })
      .populate('instructor', 'name avatar headline bio')
      .populate('category', 'name slug icon');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Retrieve sections and public lessons (with preview flag)
    const sections = await Section.find({ course: course._id }).sort({ orderIndex: 1 });
    const sectionIds = sections.map((s) => s._id);

    const lessons = await Lesson.find({ section: { $in: sectionIds } })
      .select('title description orderIndex type videoDurationSeconds isPreviewAllowed section')
      .sort({ orderIndex: 1 });

    // Group lessons by section
    const curriculum = sections.map((sec) => {
      return {
        ...sec.toObject(),
        lessons: lessons.filter((les) => les.section.toString() === sec._id.toString()),
      };
    });

    // Check if user is enrolled (if logged in)
    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
        status: 'active',
      });
      isEnrolled = !!enrollment;
    }

    // Recent reviews
    const reviews = await Review.find({ course: course._id, isApproved: true })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      course,
      curriculum,
      isEnrolled,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

export const getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      difficulty,
      language,
      price,
      isFree,
      thumbnail,
      trailerVideoUrl,
      objectives,
      requirements,
      targetAudience,
    } = req.body;

    let baseSlug = slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Course.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const course = await Course.create({
      title,
      slug: uniqueSlug,
      subtitle: subtitle || '',
      description,
      instructor: req.user._id,
      category,
      difficulty: difficulty || 'all-levels',
      language: language || 'English',
      price: isFree ? 0 : price,
      isFree: isFree || price === 0,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      trailerVideoUrl: trailerVideoUrl || '',
      objectives: objectives || [],
      requirements: requirements || [],
      targetAudience: targetAudience || [],
      status: 'draft',
    });

    // Increment category courseCount
    await Category.findByIdAndUpdate(category, { $inc: { courseCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Course draft created successfully.',
      course,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Must be course instructor or admin
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this course.',
      });
    }

    Object.assign(course, req.body);
    if (course.isFree) {
      course.price = 0;
    }
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      course,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this course.',
      });
    }

    // Clean up sections, lessons, reviews
    const sections = await Section.find({ course: course._id });
    const sectionIds = sections.map((s) => s._id);

    await Lesson.deleteMany({ section: { $in: sectionIds } });
    await Section.deleteMany({ course: course._id });
    await Review.deleteMany({ course: course._id });
    await Category.findByIdAndUpdate(course.category, { $inc: { courseCount: -1 } });
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Course and related content deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const submitCourseForReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this course.',
      });
    }

    // Verify course has at least 1 section and 1 lesson
    const sectionCount = await Section.countDocuments({ course: course._id });
    const lessonCount = await Lesson.countDocuments({ course: course._id });

    if (sectionCount === 0 || lessonCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot submit course. A course must contain at least 1 section and 1 lesson.',
      });
    }

    course.status = 'pending';
    course.totalLessons = lessonCount;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course submitted for admin review successfully!',
      course,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
};
