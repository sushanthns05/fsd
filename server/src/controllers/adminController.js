import {
  User,
  Course,
  Enrollment,
  Payment,
  Category,
  Review,
  AuditLog,
  Notification,
} from '../models/index.js';
import { getPagination, slugify } from '../utils/helpers.js';
import { logAudit } from '../services/auditService.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'published' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const totalEnrollments = await Enrollment.countDocuments();

    // Total Revenue calculation
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Recent 5 enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name email avatar')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly growth simulated/real aggregation
    const monthlyStats = [
      { month: 'Jan', students: 120, revenue: 45000 },
      { month: 'Feb', students: 180, revenue: 62000 },
      { month: 'Mar', students: 260, revenue: 89000 },
      { month: 'Apr', students: 390, revenue: 135000 },
      { month: 'May', students: 510, revenue: 198000 },
      { month: 'Jun', students: 680, revenue: 275000 },
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        pendingCourses,
        totalEnrollments,
        totalRevenue,
      },
      recentEnrollments,
      monthlyStats,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role && role !== 'all') {
      query.role = role;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent suspending yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot alter your own admin status.',
      });
    }

    const previousStatus = user.status;
    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    await logAudit({
      adminId: req.user._id,
      action: user.status === 'suspended' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
      entityType: 'User',
      entityId: user._id,
      details: { previousStatus, newStatus: user.status, targetEmail: user.email },
      req,
    });

    res.status(200).json({
      success: true,
      message: `User account has been ${user.status}.`,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ status: 'pending' })
      .populate('instructor', 'name email avatar')
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

export const reviewCourseApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // action: 'approve' | 'reject'

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (action === 'approve') {
      course.status = 'published';
      course.rejectionReason = '';
    } else if (action === 'reject') {
      course.status = 'rejected';
      course.rejectionReason = rejectionReason || 'Course did not meet platform guidelines.';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be approve or reject.' });
    }

    await course.save();

    // In-app notification to instructor
    await Notification.create({
      recipient: course.instructor,
      title: action === 'approve' ? 'Course Approved! 🚀' : 'Course Review Update',
      message:
        action === 'approve'
          ? `Congratulations! Your course "${course.title}" has been approved and is now live.`
          : `Your course "${course.title}" was not approved: ${course.rejectionReason}`,
      type: 'course',
      linkUrl: `/instructor/courses`,
    });

    await logAudit({
      adminId: req.user._id,
      action: action === 'approve' ? 'COURSE_APPROVED' : 'COURSE_REJECTED',
      entityType: 'Course',
      entityId: course._id,
      details: { courseTitle: course.title, rejectionReason },
      req,
    });

    res.status(200).json({
      success: true,
      message: `Course has been ${course.status}.`,
      course,
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const slug = slugify(name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      icon: icon || 'BookOpen',
    });

    await logAudit({
      adminId: req.user._id,
      action: 'CATEGORY_CREATED',
      entityType: 'Category',
      entityId: category._id,
      details: { name },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('student', 'name email avatar')
      .populate('course', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteReviewAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    await logAudit({
      adminId: req.user._id,
      action: 'REVIEW_MODERATED_DELETE',
      entityType: 'Review',
      entityId: id,
      details: { comment: review.comment, rating: review.rating },
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Review removed by administrator.',
    });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    next(err);
  }
};
