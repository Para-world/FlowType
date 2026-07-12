const express = require('express');
const router = express.Router();
const { getLeaderboard, getMyRank } = require('../controllers/leaderboardController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');

// ─── Public (with optional auth) ────────────────────
router.get('/', optionalAuth, getLeaderboard);

// ─── Protected ──────────────────────────────────────
router.get('/me', protect, getMyRank);

module.exports = router;
