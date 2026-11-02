import { Course, Enrollment, Payment } from '../models/index.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  completeEnrollmentAfterPayment,
} from '../services/paymentService.js';

export const createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.status !== 'published') {
      return res.status(400).json({ success: false, message: 'Course is not currently active.' });
    }

    // Check duplicate
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: 'active',
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course.',
      });
    }

    const orderData = await createRazorpayOrder({ course, user: req.user });

    res.status(200).json({
      success: true,
      message: 'Payment order created.',
      ...orderData,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, courseId } = req.body;

    if (!orderId || !paymentId || !signature || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters.',
      });
    }

    const isValid = verifyPaymentSignature({ orderId, paymentId, signature });
    if (!isValid) {
      // Record failed payment
      await Payment.findOneAndUpdate(
        { orderId },
        { status: 'failed', failureReason: 'Cryptographic signature mismatch' }
      );

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature.',
      });
    }

    const enrollment = await completeEnrollmentAfterPayment({
      userId: req.user._id,
      courseId,
      orderId,
      paymentId,
      signature,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and enrollment completed successfully!',
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('course', 'title thumbnail slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (err) {
    next(err);
  }
};
