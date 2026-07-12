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

// ─── Public ─────────────────────────────────────────
router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);

// ─── Protected ──────────────────────────────────────
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileRules, validate, updateProfile);
router.post('/avatar', protect, uploadMiddleware.single('avatar'), uploadAvatar);
router.put('/password', protect, changePasswordRules, validate, changePassword);
router.put('/settings', protect, updateSettings);
router.post('/lessons', protect, saveLessonResult);
router.delete('/me', protect, deleteAccount);

module.exports = router;
