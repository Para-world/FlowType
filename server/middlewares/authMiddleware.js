const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

/**
 * Protects routes by verifying JWT from Authorization header.
 * Attaches user document (minus password) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized — no token provided', 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Ensure user still exists
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    return next(new AppError('User belonging to this token no longer exists', 401));
  }

  req.user = user;
  next();
});

/**
 * Optional auth — attaches user if token is present, but doesn't block if missing.
 * Useful for public endpoints that behave differently for logged-in users.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Token invalid — proceed as guest
      req.user = null;
    }
  }

  next();
});

module.exports = { protect, optionalAuth };
