/**
 * Shared streak update logic.
 * Used by both userController (on login) and statsController (on test completion).
 *
 * @param {object} user - Mongoose User document (must have user.streak)
 */
function updateStreak(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.streak.lastActiveDate
    ? new Date(user.streak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      user.streak.current += 1;
    } else if (diffDays > 1) {
      // Streak broken
      user.streak.current = 1;
    }
    // diffDays === 0 means same day, don't change
  } else {
    user.streak.current = 1;
  }

  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastActiveDate = today;
}

module.exports = updateStreak;
