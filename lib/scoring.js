export function calculateWpm(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  // Standard WPM: 5 characters = 1 word
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}

export function calculateRawWpm(totalTypedChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  return Math.round((totalTypedChars / 5) / (elapsedSeconds / 60));
}

export function calculateAccuracy(correctChars, totalTypedChars) {
  if (totalTypedChars === 0) return 100;
  return Math.round((correctChars / totalTypedChars) * 100);
}

export function calculateConsistency(wpmHistory) {
  if (wpmHistory.length < 2) return 100;
  // Calculate standard deviation of WPM history
  const sum = wpmHistory.reduce((a, b) => a + b, 0);
  const avg = sum / wpmHistory.length;
  const squareDiffs = wpmHistory.map(wpm => Math.pow(wpm - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  // Convert to 0-100 score (higher is better). A stdDev of 0 is 100%.
  // Typically, a stdDev of 20 WPM is quite inconsistent.
  let consistency = 100 - (stdDev * 2);
  return Math.max(0, Math.min(100, Math.round(consistency)));
}

export function gradePerformance(wpm, accuracy, consistency) {
  // A simple grading matrix
  if (wpm >= 100 && accuracy >= 98 && consistency >= 90) return 'S';
  if (wpm >= 80 && accuracy >= 96 && consistency >= 80) return 'A';
  if (wpm >= 60 && accuracy >= 94) return 'B';
  if (wpm >= 40 && accuracy >= 90) return 'C';
  if (wpm >= 20 && accuracy >= 80) return 'D';
  return 'F';
}

export function rateTypist(wpm) {
  if (wpm >= 120) return 'Typing Master';
  if (wpm >= 90) return 'Expert Typist';
  if (wpm >= 60) return 'Fast Typist';
  if (wpm >= 40) return 'Average Typist';
  if (wpm >= 20) return 'Beginner';
  return 'Just Starting';
}

export function generateSuggestions(wpm, accuracy, consistency) {
  if (accuracy < 90) return "Focus on accuracy over speed. Slow down and ensure you hit the right keys.";
  if (consistency < 70) return "Your typing speed fluctuates a lot. Try to maintain a steady rhythm.";
  if (wpm < 40) return "Keep practicing! Building muscle memory takes time.";
  if (wpm >= 100 && accuracy >= 98) return "Incredible performance! You have mastered the keyboard.";
  return "Great job! Keep pushing your limits.";
}
