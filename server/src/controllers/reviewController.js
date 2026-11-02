import { Review, Enrollment, Course } from '../models/index.js';

export const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId, isApproved: true })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: { $in: ['active', 'completed'] },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Only enrolled students can review this course.',
      });
    }

    // Check duplicate
    const existing = await Review.findOne({
      course: courseId,
      student: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course. You can update your existing review.',
      });
    }

    const review = await Review.create({
      course: courseId,
      student: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review,
    });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully.',
      review,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review removed successfully.',
    });
  } catch (err) {
    next(err);
  }
};
