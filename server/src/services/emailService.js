import nodemailer from 'nodemailer';
import { config } from '../config/environment.js';

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (config.smtp.user && config.smtp.pass) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  } else {
    // Development fallback: mock or test transporter
    transporter = {
      sendMail: async (mailOptions) => {
        console.log(`[Email Mock Service] Simulated Email to: ${mailOptions.to} | Subject: "${mailOptions.subject}"`);
        return { messageId: `mock-${Date.now()}` };
      },
    };
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from: config.smtp.from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html,
    });
    return info;
  } catch (err) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, err.message);
    // Don't crash main flow for email failure
    return null;
  }
};

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to EduSphere — Smart Online Learning Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e7ff; border-radius: 8px;">
        <h2 style="color: #4338ca;">Welcome to EduSphere, ${user.name}!</h2>
        <p>We are thrilled to have you join our global community of learners and educators.</p>
        <p>Explore thousands of industry-standard courses, test your skills with smart assessments, and earn certified credentials.</p>
        <a href="${config.clientUrl}/courses" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Explore Courses</a>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
  return sendEmail({
    to: user.email,
    subject: 'EduSphere — Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e7ff; border-radius: 8px;">
        <h2 style="color: #4338ca;">Reset Your Password</h2>
        <p>You requested a password reset for your EduSphere account. Click the button below to choose a new password. This link is valid for 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0;">Reset Password</a>
        <p style="color: #64748b; font-size: 13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

export const sendEnrollmentConfirmation = async (user, course) => {
  return sendEmail({
    to: user.email,
    subject: `Enrollment Confirmed: ${course.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e7ff; border-radius: 8px;">
        <h2 style="color: #4338ca;">You are enrolled!</h2>
        <p>Hi ${user.name}, you have successfully enrolled in <strong>${course.title}</strong>.</p>
        <p>Start watching lessons and completing milestones now.</p>
        <a href="${config.clientUrl}/learn/${course._id}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Go to Course</a>
      </div>
    `,
  });
};
