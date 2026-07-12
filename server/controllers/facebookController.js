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

// ─── Redirect to Facebook OAuth ─────────────────────
// GET /api/users/auth/facebook
const facebookRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    scope: 'public_profile',
    response_type: 'code',
    state: Math.random().toString(36).substring(2), // CSRF protection
  });

  res.redirect(`https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`);
};

// ─── Facebook Callback ──────────────────────────────
// GET /api/users/auth/facebook/callback
const facebookCallback = asyncHandler(async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/login?error=facebook_denied`
    );
  }

  // 1. Exchange code for access token
  const tokenParams = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    code,
  });

  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`
  );
  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    console.error('Facebook token error:', tokenData.error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/login?error=facebook_token_failed`
    );
  }

  // 2. Fetch user profile from Facebook
  const profileRes = await fetch(
    `https://graph.facebook.com/v21.0/me?fields=id,name,email,picture.width(200).height(200)&access_token=${tokenData.access_token}`
  );
  const profile = await profileRes.json();

  if (!profile.id) {
    console.error('Facebook profile error:', profile);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/login?error=facebook_profile_failed`
    );
  }

  // 3. Find or create user
  let user = await User.findOne({ facebookId: profile.id });

  if (!user) {
    // Check if a user with the same email already exists (registered via email/password)
    if (profile.email) {
      user = await User.findOne({ email: profile.email });
    }

    if (user) {
      // Link Facebook to existing account
      user.facebookId = profile.id;
      user.authProvider = 'facebook';
      if (!user.avatarUrl && profile.picture?.data?.url) {
        user.avatarUrl = profile.picture.data.url;
      }
      await user.save();
    } else {
      // Create a brand new user
      // Generate a unique username from Facebook name
      const baseUsername = (profile.name || 'user')
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
        email: profile.email || `fb_${profile.id}@flowtype.local`,
        facebookId: profile.id,
        authProvider: 'facebook',
        avatarUrl: profile.picture?.data?.url || '',
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
  facebookRedirect,
  facebookCallback,
};
