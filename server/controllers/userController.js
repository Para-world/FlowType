const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TestResult = require('../models/TestResult');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Helpers ────────────────────────────────────────

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const sanitizeUser = (user, token) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  settings: user.settings,
  stats: user.stats,
  streak: user.streak,
  achievements: user.achievements,
  lessons: user.lessons,
  level: user.level,
  xp: user.xp,
  token,
});

// ─── Register ───────────────────────────────────────
// POST /api/users/register
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);
  res.status(201).json({
    success: true,
    data: sanitizeUser(user, token),
  });
});

// ─── Login ──────────────────────────────────────────
// POST /api/users/login
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Explicitly select password (excluded by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Update streak
  updateStreak(user);
  await user.save();

  const token = generateToken(user._id);
  res.json({
    success: true,
    data: sanitizeUser(user, token),
  });
});

// ─── Get Me ─────────────────────────────────────────
// GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

// ─── Update Profile ─────────────────────────────────
// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res, next) => {
  const { username, email, avatarUrl } = req.body;
  const updates = {};

  if (username) {
    // Check uniqueness
    const existing = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existing) return next(new AppError('Username already taken', 400));
    updates.username = username;
  }

  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) return next(new AppError('Email already taken', 400));
    updates.email = email;
  }

  if (avatarUrl !== undefined) {
    updates.avatarUrl = avatarUrl;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: user });
});

// ─── Upload Avatar ──────────────────────────────────
// POST /api/users/avatar
const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image file', 400));
  }

  // The file is saved by multer in public/uploads/avatars
  // We store the relative URL in the DB so it can be served statically
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: { avatarUrl: user.avatarUrl } });
});

// ─── Change Password ────────────────────────────────
// PUT /api/users/password
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 401));
  }

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  const token = generateToken(user._id);
  res.json({ success: true, message: 'Password updated', token });
});

// ─── Update Settings ────────────────────────────────
// PUT /api/users/settings
const updateSettings = asyncHandler(async (req, res) => {
  const allowedFields = [
    'themeAccent', 'fontSize', 'fontFamily', 'cursorStyle',
    'soundEnabled', 'animationLevel', 'keyboardGuide',
    'timerDisplay', 'wpmDisplay', 'accuracyDisplay',
    'progressBar', 'focusMode', 'zenMode',
  ];

  // Only allow whitelisted setting fields
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[`settings.${key}`] = req.body[key];
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: user.settings });
});

// ─── Delete Account ─────────────────────────────────
// DELETE /api/users/me
const deleteAccount = asyncHandler(async (req, res) => {
  // Delete all test results
  await TestResult.deleteMany({ user: req.user._id });
  // Delete user
  await User.findByIdAndDelete(req.user._id);

  res.json({ success: true, message: 'Account and all data deleted' });
});

// ─── Save Lesson Result ─────────────────────────────
// POST /api/users/lessons
const saveLessonResult = asyncHandler(async (req, res, next) => {
  const { lessonId, stars, wpm, accuracy } = req.body;

  if (!lessonId) {
    return next(new AppError('Lesson ID is required', 400));
  }

  const user = await User.findById(req.user._id);

  const existingLessonIndex = user.lessons.completed.findIndex(
    (l) => l.lessonId === lessonId
  );

  if (existingLessonIndex > -1) {
    // Update if better
    const existing = user.lessons.completed[existingLessonIndex];
    if (stars > existing.stars) existing.stars = stars;
    if (wpm > existing.bestWpm) existing.bestWpm = wpm;
    if (accuracy > existing.accuracy) existing.accuracy = accuracy;
    existing.completedAt = Date.now();
  } else {
    // Add new
    user.lessons.completed.push({
      lessonId,
      stars: stars || 0,
      bestWpm: wpm || 0,
      accuracy: accuracy || 0,
    });
  }

  await user.save();

  res.json({ success: true, data: user.lessons });
});

// ─── Streak Helper ──────────────────────────────────
function updateStreak(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.streak.lastActiveDate
    ? new Date(user.streak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      user.streak.current += 1;
    } else if (diffDays > 1) {
      // Streak broken
      user.streak.current = 1;
    }
    // diffDays === 0 means same day, don't change
  } else {
    user.streak.current = 1;
  }

  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastActiveDate = today;
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  updateSettings,
  deleteAccount,
  uploadAvatar,
  saveLessonResult,
};
