const { body, query, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Runs validation chains and returns 400 with structured errors if any fail.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new AppError(messages.join('. '), 400));
  }
  next();
};

// ───────────────────────────────────────
// Auth Validators
// ───────────────────────────────────────

const registerRules = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3–20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// ───────────────────────────────────────
// Stats Validators
// ───────────────────────────────────────

const saveTestRules = [
  body('wpm').isInt({ min: 0, max: 500 }).withMessage('WPM must be 0–500'),
  body('rawWpm').isInt({ min: 0, max: 500 }).withMessage('Raw WPM must be 0–500'),
  body('accuracy').isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be 0–100'),
  body('consistency').isFloat({ min: 0, max: 100 }).withMessage('Consistency must be 0–100'),
  body('time').isInt({ min: 1, max: 3600 }).withMessage('Time must be 1–3600 seconds'),
  body('correctChars').isInt({ min: 0 }).withMessage('correctChars must be ≥ 0'),
  body('incorrectChars').isInt({ min: 0 }).withMessage('incorrectChars must be ≥ 0'),
  body('extraChars').isInt({ min: 0 }).withMessage('extraChars must be ≥ 0'),
  body('missedChars').isInt({ min: 0 }).withMessage('missedChars must be ≥ 0'),
  body('mode').isIn(['time', 'words', 'paragraph', 'quotes']).withMessage('Invalid mode'),
  body('module').isIn(['words', 'numbers', 'symbols', 'mixed', 'code', 'capitals', 'punctuation', 'adaptive']).withMessage('Invalid module'),
];

// ───────────────────────────────────────
// User Profile Validators
// ───────────────────────────────────────

const changePasswordRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

const updateProfileRules = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3–20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

// ───────────────────────────────────────
// Pagination Validators
// ───────────────────────────────────────

const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be ≥ 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  saveTestRules,
  changePasswordRules,
  updateProfileRules,
  paginationRules,
};
