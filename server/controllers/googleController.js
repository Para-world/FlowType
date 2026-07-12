const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Helpers ────────────────────────────────────────

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// ─── Redirect to Google OAuth ───────────────────────
// GET /api/users/auth/google
const googleRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    state: Math.random().toString(36).substring(2), // CSRF protection
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

// ─── Google Callback ────────────────────────────────
// GET /api/users/auth/google/callback
const googleCallback = asyncHandler(async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/login?error=google_denied`
    );
  }

  // 1. Exchange code for access token
  const tokenParams = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    grant_type: 'authorization_code',
    code,
  });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString(),
  });
  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    console.error('Google token error:', tokenData.error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/login?error=google_token_failed`
    );
  }

  // 2. Fetch user profile from Google
  const profileRes = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );
  const profile = await profileRes.json();

  if (!profile.id) {
    console.error('Google profile error:', profile);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/login?error=google_profile_failed`
    );
  }

  // 3. Find or create user
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    // Check if a user with the same email already exists
    if (profile.email) {
      user = await User.findOne({ email: profile.email });
    }

    if (user) {
      // Link Google to existing account
      user.googleId = profile.id;
      user.authProvider = 'google';
      if (!user.avatarUrl && profile.picture) {
        user.avatarUrl = profile.picture;
      }
      await user.save();
    } else {
      // Create a brand new user
      // Generate a unique username from Google name or email prefix
      const baseName = profile.name || profile.email.split('@')[0];
      const baseUsername = baseName
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .substring(0, 15)
        .toLowerCase();

      // Ensure uniqueness
      let username = baseUsername;
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        username,
        email: profile.email,
        googleId: profile.id,
        authProvider: 'google',
        avatarUrl: profile.picture || '',
      });
    }
  }

  // 4. Generate JWT and redirect to frontend
  const token = generateToken(user._id);

  // Redirect to the frontend callback page with the token
  const frontendCallback = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${user._id}`;
  res.redirect(frontendCallback);
});

module.exports = {
  googleRedirect,
  googleCallback,
};
