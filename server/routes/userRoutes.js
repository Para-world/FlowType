const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  updateSettings,
  deleteAccount,
  uploadAvatar,
  saveLessonResult,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadAvatar: uploadMiddleware } = require('../middlewares/uploadMiddleware');
const {
  validate,
  registerRules,
  loginRules,
  changePasswordRules,
  updateProfileRules,
} = require('../middlewares/validateMiddleware');
const {
  facebookRedirect,
  facebookCallback,
} = require('../controllers/facebookController');
const {
  googleRedirect,
  googleCallback,
} = require('../controllers/googleController');

// ─── Regular Auth Routes ───────────────────────────
router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);

// ─── OAuth Routes (Facebook) ─────────────────────────
router.get('/auth/facebook', facebookRedirect);
router.get('/auth/facebook/callback', facebookCallback);

// ─── OAuth Routes (Google) ─────────────────────────
router.get('/auth/google', googleRedirect);
router.get('/auth/google/callback', googleCallback);

// ─── Protected ──────────────────────────────────────
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileRules, validate, updateProfile);
router.post('/avatar', protect, uploadMiddleware.single('avatar'), uploadAvatar);
router.put('/password', protect, changePasswordRules, validate, changePassword);
router.put('/settings', protect, updateSettings);
router.post('/lessons', protect, saveLessonResult);
router.delete('/me', protect, deleteAccount);

module.exports = router;
