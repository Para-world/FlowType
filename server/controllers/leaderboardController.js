const Leaderboard = require('../models/Leaderboard');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Get Leaderboard ────────────────────────────────
// GET /api/leaderboard?period=daily&limit=50
const getLeaderboard = asyncHandler(async (req, res) => {
  const period = req.query.period || 'alltime';
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);

  // Determine periodDate
  let periodDate;
  const now = new Date();

  if (period === 'daily') {
    periodDate = now.toISOString().split('T')[0];
  } else if (period === 'weekly') {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - startOfYear) / (1000 * 60 * 60 * 24) + startOfYear.getDay() + 1) / 7);
    periodDate = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  } else {
    periodDate = 'alltime';
  }

  const leaderboard = await Leaderboard.find({ period, periodDate })
    .sort({ wpm: -1 })
    .limit(limit)
    .select('username wpm accuracy consistency mode time')
    .lean();

  // Attach ranks
  const ranked = leaderboard.map((entry, i) => ({
    rank: i + 1,
    ...entry,
  }));

  res.json({
    success: true,
    data: ranked,
    meta: { period, periodDate, total: ranked.length },
  });
});

// ─── Get My Rank ────────────────────────────────────
// GET /api/leaderboard/me?period=alltime
const getMyRank = asyncHandler(async (req, res) => {
  const period = req.query.period || 'alltime';

  let periodDate;
  const now = new Date();

  if (period === 'daily') {
    periodDate = now.toISOString().split('T')[0];
  } else if (period === 'weekly') {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - startOfYear) / (1000 * 60 * 60 * 24) + startOfYear.getDay() + 1) / 7);
    periodDate = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  } else {
    periodDate = 'alltime';
  }

  // Get my entry
  const myEntry = await Leaderboard.findOne({
    user: req.user._id,
    period,
    periodDate,
  }).lean();

  if (!myEntry) {
    return res.json({
      success: true,
      data: { rank: null, message: 'No entry for this period yet' },
    });
  }

  // Count how many are above me
  const higherCount = await Leaderboard.countDocuments({
    period,
    periodDate,
    wpm: { $gt: myEntry.wpm },
  });

  res.json({
    success: true,
    data: {
      rank: higherCount + 1,
      wpm: myEntry.wpm,
      accuracy: myEntry.accuracy,
      period,
    },
  });
});

module.exports = {
  getLeaderboard,
  getMyRank,
};
