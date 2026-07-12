const express = require('express');
const router = express.Router();
const {
  saveTestResult,
  getTestHistory,
  getAnalytics,
  getPersonalBests,
} = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');
const {
  validate,
  saveTestRules,
  paginationRules,
} = require('../middlewares/validateMiddleware');

// ─── Protected ──────────────────────────────────────
router
  .route('/')
  .post(protect, saveTestRules, validate, saveTestResult)
  .get(protect, paginationRules, validate, getTestHistory);

router.get('/analytics', protect, getAnalytics);
router.get('/personal-bests', protect, getPersonalBests);

module.exports = router;
