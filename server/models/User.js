const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries by default
    },
    authProvider: {
      type: String,
      enum: ['local', 'facebook', 'google'],
      default: 'local',
    },
    facebookId: {
      type: String,
      sparse: true,
      unique: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },

    // ─── Settings (matches frontend settingsSlice) ───
    settings: {
      themeAccent: { type: Number, default: 0, min: 0, max: 4 },
      fontSize: { type: String, default: 'md', enum: ['sm', 'md', 'lg'] },
      fontFamily: { type: String, default: 'mono', enum: ['mono', 'sans', 'serif'] },
      cursorStyle: { type: String, default: 'line', enum: ['line', 'block', 'underline'] },
      soundEnabled: { type: Boolean, default: true },
      animationLevel: { type: String, default: 'full', enum: ['full', 'reduced', 'none'] },
      keyboardGuide: { type: Boolean, default: true },
      timerDisplay: { type: Boolean, default: true },
      wpmDisplay: { type: Boolean, default: true },
      accuracyDisplay: { type: Boolean, default: true },
      progressBar: { type: Boolean, default: true },
      focusMode: { type: Boolean, default: false },
      zenMode: { type: Boolean, default: false },
    },

    // ─── Aggregate Stats ───
    stats: {
      bestWpm: { type: Number, default: 0 },
      avgWpm: { type: Number, default: 0 },
      bestAccuracy: { type: Number, default: 0 },
      avgAccuracy: { type: Number, default: 0 },
      totalTests: { type: Number, default: 0 },
      totalPracticeTime: { type: Number, default: 0 }, // seconds
      totalWordsTyped: { type: Number, default: 0 },
      totalCharsTyped: { type: Number, default: 0 },
    },

    // ─── Streaks ───
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },

    // ─── Achievements ───
    achievements: [
      {
        key: { type: String }, // e.g. 'first_test', 'speed_demon_100'
        unlockedAt: { type: Date, default: Date.now },
      },
    ],

    // ─── Gamification ───
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },

    // ─── Lessons ───
    lessons: {
      completed: [
        {
          lessonId: { type: String, required: true },
          stars: { type: Number, default: 0 },
          bestWpm: { type: Number, default: 0 },
          accuracy: { type: Number, default: 0 },
          completedAt: { type: Date, default: Date.now },
        }
      ]
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───
// email and username already indexed via unique: true
userSchema.index({ 'stats.bestWpm': -1 }); // For leaderboard queries

const User = mongoose.model('User', userSchema);

module.exports = User;
