const TestResult = require('../models/TestResult');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Save Test Result ───────────────────────────────
// POST /api/stats
const saveTestResult = asyncHandler(async (req, res) => {
  const {
    wpm, rawWpm, accuracy, consistency, time,
    correctChars, incorrectChars, extraChars, missedChars,
    mode, module, wpmSnapshots,
  } = req.body;

  // Create test result
  const testResult = await TestResult.create({
    user: req.user._id,
    wpm, rawWpm, accuracy, consistency, time,
    correctChars, incorrectChars, extraChars, missedChars,
    mode, module,
    wpmSnapshots: wpmSnapshots || [],
  });

  // ─── Update user aggregate stats ───
  const user = await User.findById(req.user._id);

  const oldTotal = user.stats.totalTests;
  const newTotal = oldTotal + 1;

  user.stats.totalTests = newTotal;
  user.stats.bestWpm = Math.max(user.stats.bestWpm, wpm);
  user.stats.avgWpm = Math.round(((user.stats.avgWpm * oldTotal) + wpm) / newTotal);
  user.stats.bestAccuracy = Math.max(user.stats.bestAccuracy, accuracy);
  user.stats.avgAccuracy = Math.round(((user.stats.avgAccuracy * oldTotal) + accuracy) / newTotal);
  user.stats.totalPracticeTime += time;
  user.stats.totalWordsTyped += Math.round(correctChars / 5);
  user.stats.totalCharsTyped += correctChars + incorrectChars;

  // ─── Update streak ───
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActive = user.streak.lastActiveDate
    ? new Date(user.streak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      user.streak.current += 1;
    } else if (diffDays > 1) {
      user.streak.current = 1;
    }
  } else {
    user.streak.current = 1;
  }
  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastActiveDate = today;

  // ─── XP and Leveling ───
  const xpGained = Math.round(wpm * (accuracy / 100) * (time / 30));
  user.xp += xpGained;
  const nextLevelXp = user.level * 1000;
  if (user.xp >= nextLevelXp) {
    user.level += 1;
    user.xp -= nextLevelXp;
  }

  // ─── Check achievements ───
  checkAchievements(user, wpm, accuracy, testResult);

  await user.save();

  // ─── Update leaderboard entries ───
  await updateLeaderboard(user, testResult);

  res.status(201).json({
    success: true,
    data: {
      testResult,
      xpGained,
      userStats: user.stats,
      streak: user.streak,
      level: user.level,
      xp: user.xp,
      newAchievements: user.achievements.slice(-3), // Return last 3
    },
  });
});

// ─── Get Test History (Paginated) ───────────────────
// GET /api/stats?page=1&limit=20
const getTestHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    TestResult.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TestResult.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    data: history,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// ─── Get Analytics ──────────────────────────────────
// GET /api/stats/analytics?range=7 (days)
const getAnalytics = asyncHandler(async (req, res) => {
  const range = parseInt(req.query.range) || 30; // days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - range);

  // Daily WPM/Accuracy averages
  const dailyStats = await TestResult.aggregate([
    {
      $match: {
        user: req.user._id,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        avgWpm: { $avg: '$wpm' },
        avgAccuracy: { $avg: '$accuracy' },
        avgConsistency: { $avg: '$consistency' },
        maxWpm: { $max: '$wpm' },
        tests: { $sum: 1 },
        totalTime: { $sum: '$time' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Mode breakdown
  const modeBreakdown = await TestResult.aggregate([
    { $match: { user: req.user._id, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$mode',
        avgWpm: { $avg: '$wpm' },
        avgAccuracy: { $avg: '$accuracy' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Module breakdown
  const moduleBreakdown = await TestResult.aggregate([
    { $match: { user: req.user._id, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$module',
        avgWpm: { $avg: '$wpm' },
        avgAccuracy: { $avg: '$accuracy' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Hourly activity heatmap
  const hourlyActivity = await TestResult.aggregate([
    { $match: { user: req.user._id, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $hour: '$createdAt' },
        count: { $sum: 1 },
        avgWpm: { $avg: '$wpm' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      dailyStats,
      modeBreakdown,
      moduleBreakdown,
      hourlyActivity,
      range,
    },
  });
});

// ─── Get Personal Bests ─────────────────────────────
// GET /api/stats/personal-bests
const getPersonalBests = asyncHandler(async (req, res) => {
  // Best result per mode+module combination
  const personalBests = await TestResult.aggregate([
    { $match: { user: req.user._id } },
    { $sort: { wpm: -1 } },
    {
      $group: {
        _id: { mode: '$mode', module: '$module' },
        bestWpm: { $first: '$wpm' },
        bestAccuracy: { $first: '$accuracy' },
        bestConsistency: { $first: '$consistency' },
        time: { $first: '$time' },
        date: { $first: '$createdAt' },
      },
    },
    { $sort: { bestWpm: -1 } },
  ]);

  // Overall bests
  const overallBest = await TestResult.findOne({ user: req.user._id })
    .sort({ wpm: -1 })
    .lean();

  res.json({
    success: true,
    data: {
      byCategory: personalBests,
      overall: overallBest,
    },
  });
});

// ─── Helpers ────────────────────────────────────────

function checkAchievements(user, wpm, accuracy, test) {
  const earned = user.achievements.map((a) => a.key);
  const add = (key) => {
    if (!earned.includes(key)) {
      user.achievements.push({ key, unlockedAt: new Date() });
    }
  };

  // First test
  if (user.stats.totalTests === 0) add('first_test');

  // Speed milestones
  if (wpm >= 30) add('speed_30');
  if (wpm >= 50) add('speed_50');
  if (wpm >= 75) add('speed_75');
  if (wpm >= 100) add('speed_100');
  if (wpm >= 125) add('speed_125');
  if (wpm >= 150) add('speed_150');

  // Accuracy milestones
  if (accuracy === 100) add('perfect_accuracy');
  if (accuracy >= 99) add('accuracy_99');
  if (accuracy >= 95) add('accuracy_95');

  // Volume milestones
  const newTotal = user.stats.totalTests + 1;
  if (newTotal >= 10) add('tests_10');
  if (newTotal >= 50) add('tests_50');
  if (newTotal >= 100) add('tests_100');
  if (newTotal >= 500) add('tests_500');

  // Streak milestones
  if (user.streak.current >= 3) add('streak_3');
  if (user.streak.current >= 7) add('streak_7');
  if (user.streak.current >= 30) add('streak_30');

  // Practice time milestones (in seconds)
  const totalTime = user.stats.totalPracticeTime + test.time;
  if (totalTime >= 3600) add('practice_1h');
  if (totalTime >= 36000) add('practice_10h');
}

async function updateLeaderboard(user, test) {
  const now = new Date();
  const dailyDate = now.toISOString().split('T')[0]; // "2026-07-07"

  // ISO week
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now - startOfYear) / (1000 * 60 * 60 * 24) + startOfYear.getDay() + 1) / 7);
  const weeklyDate = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;

  const entry = {
    user: user._id,
    username: user.username,
    wpm: test.wpm,
    accuracy: test.accuracy,
    consistency: test.consistency,
    time: test.time,
    mode: test.mode,
    module: test.module,
  };

  // Upsert: only update if new WPM is higher
  const upsertIfBetter = async (period, periodDate) => {
    await Leaderboard.findOneAndUpdate(
      { user: user._id, period, periodDate },
      {
        $max: { wpm: test.wpm }, // Only update if higher
        $set: { ...entry, period, periodDate },
      },
      { upsert: true, new: true }
    );
  };

  await Promise.all([
    upsertIfBetter('daily', dailyDate),
    upsertIfBetter('weekly', weeklyDate),
    upsertIfBetter('alltime', 'alltime'),
  ]);
}

module.exports = {
  saveTestResult,
  getTestHistory,
  getAnalytics,
  getPersonalBests,
};
