const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    wpm: { type: Number, required: true, min: 0, max: 500 },
    rawWpm: { type: Number, required: true, min: 0, max: 500 },
    accuracy: { type: Number, required: true, min: 0, max: 100 },
    consistency: { type: Number, required: true, min: 0, max: 100 },
    time: { type: Number, required: true, min: 1 }, // duration in seconds
    correctChars: { type: Number, required: true, min: 0 },
    incorrectChars: { type: Number, required: true, min: 0 },
    extraChars: { type: Number, required: true, min: 0 },
    missedChars: { type: Number, required: true, min: 0 },
    totalChars: { type: Number, default: 0 }, // computed before save
    mode: {
      type: String,
      required: true,
      enum: ['time', 'words', 'paragraph', 'quotes'],
    },
    module: {
      type: String,
      required: true,
      enum: ['words', 'numbers', 'symbols', 'mixed', 'code', 'capitals', 'punctuation', 'adaptive'],
    },

    // Per-second WPM snapshots for charting
    wpmSnapshots: [{ type: Number }],
  },
  {
    timestamps: true,
  }
);

// ─── Compound Indexes for fast queries ───
testResultSchema.index({ user: 1, createdAt: -1 }); // History feed
testResultSchema.index({ user: 1, mode: 1, module: 1 }); // Personal bests per category
testResultSchema.index({ wpm: -1, createdAt: -1 }); // Leaderboard sorting

// ─── Pre-save: compute totalChars ───
testResultSchema.pre('save', function (next) {
  this.totalChars = this.correctChars + this.incorrectChars + this.extraChars + this.missedChars;
  next();
});

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
