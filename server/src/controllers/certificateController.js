import { Certificate, Course, Progress, Enrollment, Notification } from '../models/index.js';
import { generateCertificateId } from '../utils/helpers.js';
import { generateCertificatePDF } from '../services/certificateService.js';
import { config } from '../config/environment.js';

export const generateCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId).populate('instructor', 'name');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: { $in: ['active', 'completed'] },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course.',
      });
    }

    // Check progress completion criteria
    const progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress || progress.percentCompleted < 100) {
      return res.status(400).json({
        success: false,
        message: `Incomplete requirements: You have completed ${progress ? progress.percentCompleted : 0}% of the course. You must complete 100% of all lessons to earn your certificate.`,
      });
    }

    // Check if certificate already generated
    let existing = await Certificate.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Certificate already issued for this course.',
        certificate: existing,
      });
    }

    const certificateId = generateCertificateId();
    const verificationUrl = `${config.clientUrl}/verify/${certificateId}`;

    const pdfUrl = await generateCertificatePDF({
      certificateId,
      studentName: req.user.name,
      courseTitle: course.title,
      instructorName: course.instructor?.name || 'EduSphere Faculty',
      issueDate: new Date(),
      verificationUrl,
    });

    const certificate = await Certificate.create({
      certificateId,
      student: req.user._id,
      course: courseId,
      studentName: req.user.name,
      courseTitle: course.title,
      instructorName: course.instructor?.name || 'EduSphere Faculty',
      verificationUrl,
      pdfUrl,
      issueDate: new Date(),
    });

    // Link to progress
    progress.certificate = certificate._id;
    await progress.save();

    // In-app notification
    await Notification.create({
      recipient: req.user._id,
      title: 'Certificate Awarded! 🎓',
      message: `Your verified certificate for "${course.title}" is ready to view and download.`,
      type: 'certificate',
      linkUrl: `/student/certificates`,
    });

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully!',
      certificate,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title thumbnail category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      certificates,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyCertificatePublic = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId }).populate(
      'course',
      'title thumbnail difficulty'
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        isValid: false,
        message: 'Certificate not found. This credential ID does not exist in our registry.',
      });
    }

    res.status(200).json({
      success: true,
      isValid: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseTitle: certificate.courseTitle,
        instructorName: certificate.instructorName,
        issueDate: certificate.issueDate,
        verificationUrl: certificate.verificationUrl,
        pdfUrl: certificate.pdfUrl,
        course: certificate.course,
      },
    });
  } catch (err) {
    next(err);
  }
};
