const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    username: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    consistency: { type: Number, required: true },
    time: { type: Number, required: true },
    mode: { type: String, required: true },
    module: { type: String, required: true },
    period: {
      type: String,
      required: true,
      enum: ['daily', 'weekly', 'alltime'],
    },
    periodDate: { type: String, required: true }, // e.g. "2026-07-07" or "2026-W28" or "alltime"
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───
// One entry per user per period — upsert pattern
leaderboardSchema.index({ period: 1, periodDate: 1, wpm: -1 });
leaderboardSchema.index({ user: 1, period: 1, periodDate: 1 }, { unique: true });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
