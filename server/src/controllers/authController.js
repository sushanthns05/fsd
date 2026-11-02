import crypto from 'crypto';
import { User } from '../models/User.js';
import { generateTokens, setAuthCookies, clearAuthCookies, verifyRefreshToken } from '../utils/jwt.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, headline } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Security check: never allow public registration of admin
    const safeRole = role === 'instructor' ? 'instructor' : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      headline: headline || '',
      isVerified: true, // Mark verified for demo convenience
    });

    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    // Send async welcome email (don't block)
    sendWelcomeEmail(user).catch((e) => console.error(e));

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact platform administration.',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  clearAuthCookies(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found.',
      });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || user.status === 'suspended') {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: 'Invalid session or suspended account.',
      });
    }

    const tokens = generateTokens(user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      user,
    });
  } catch (err) {
    clearAuthCookies(res);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token. Please log in again.',
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal account existence for security
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a password reset link has been sent.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address.',
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, email, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, headline, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (err) {
    next(err);
  }
};
