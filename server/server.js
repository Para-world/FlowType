const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/AppError');

// ─── Connect to MongoDB ─────────────────────────────
connectDB();

const app = express();

// ─── Security Middleware ─────────────────────────────

// Set security HTTP headers
app.use(helmet());

// CORS — restrict to known origins
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting — general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
  },
});

app.use('/api', apiLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// ─── Body Parsing ────────────────────────────────────

// Serve static files (uploaded avatars, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser — limit payload size
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL injection (Express v5 compatible)
const sanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
};
app.use((req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  next();
});

// ─── Logging ─────────────────────────────────────────

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Static Files ────────────────────────────────────

app.use(express.static(path.join(__dirname, 'public')));

// ─── Routes ──────────────────────────────────────────

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FlowType API is running',
    version: '2.0.0',
    environment: process.env.NODE_ENV,
  });
});

// Health check with DB status
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    success: true,
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl}`, 404));
});

// ─── Global Error Handler ────────────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 FlowType API v2.0.0`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   CORS Origin: ${process.env.CORS_ORIGIN}\n`);
});

// ─── Graceful Shutdown ───────────────────────────────

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
