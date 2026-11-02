import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';

export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = config.nodeEnv === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};
