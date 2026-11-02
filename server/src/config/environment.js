import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edusphere',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_edusphere_jwt_key_98374298734298',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_secret_refresh_key_872364872364',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'edusphere_cookie_secret_key_823749823',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'EduSphere <no-reply@edusphere.learn>',
  },
  adminSetupKey: process.env.ADMIN_SETUP_KEY || 'edusphere_master_admin_bootstrap_2026',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};
