const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for the given user ID.
 *
 * @param {string|import('mongoose').Types.ObjectId} id - The user's MongoDB _id
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
