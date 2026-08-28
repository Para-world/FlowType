import { describe, it, expect } from 'vitest';
import {
  calculateWpm,
  calculateRawWpm,
  calculateAccuracy,
  calculateConsistency,
  gradePerformance,
  rateTypist,
  generateSuggestions,
} from './scoring';

// ─── calculateWpm ──────────────────────────────────────

describe('calculateWpm', () => {
  it('returns 0 when elapsed time is 0', () => {
    expect(calculateWpm(100, 0)).toBe(0);
  });

  it('returns 0 when elapsed time is negative', () => {
    expect(calculateWpm(100, -5)).toBe(0);
  });

  it('calculates WPM correctly for standard input', () => {
    // 300 correct chars / 5 = 60 words, in 60 seconds = 60 WPM
    expect(calculateWpm(300, 60)).toBe(60);
  });

  it('calculates WPM correctly for partial minute', () => {
    // 100 correct chars / 5 = 20 words, in 30 seconds (0.5 min) = 40 WPM
    expect(calculateWpm(100, 30)).toBe(40);
  });

  it('rounds the result', () => {
    // 7 chars / 5 = 1.4 words, in 60 seconds = 1.4 WPM → rounds to 1
    expect(calculateWpm(7, 60)).toBe(1);
  });
});

// ─── calculateRawWpm ───────────────────────────────────

describe('calculateRawWpm', () => {
  it('returns 0 when elapsed time is 0', () => {
    expect(calculateRawWpm(100, 0)).toBe(0);
  });

  it('calculates raw WPM correctly', () => {
    // 500 total chars / 5 = 100 words, in 60 seconds = 100 WPM
    expect(calculateRawWpm(500, 60)).toBe(100);
  });
});

// ─── calculateAccuracy ─────────────────────────────────

describe('calculateAccuracy', () => {
  it('returns 100 when no characters have been typed', () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it('returns 100 for perfect accuracy', () => {
    expect(calculateAccuracy(100, 100)).toBe(100);
  });

  it('calculates accuracy correctly', () => {
    // 90 correct out of 100 total = 90%
    expect(calculateAccuracy(90, 100)).toBe(90);
  });

  it('returns 0 when all characters are wrong', () => {
    expect(calculateAccuracy(0, 100)).toBe(0);
  });

  it('rounds the result', () => {
    // 33 / 100 = 33%
    expect(calculateAccuracy(33, 100)).toBe(33);
  });
});

// ─── calculateConsistency ──────────────────────────────

describe('calculateConsistency', () => {
  it('returns 100 for a single WPM value', () => {
    expect(calculateConsistency([60])).toBe(100);
  });

  it('returns 100 for empty array (less than 2)', () => {
    expect(calculateConsistency([])).toBe(100);
  });

  it('returns 100 for perfectly consistent typing', () => {
    expect(calculateConsistency([60, 60, 60, 60])).toBe(100);
  });

  it('returns lower score for inconsistent typing', () => {
    const result = calculateConsistency([20, 80, 30, 90, 40]);
    expect(result).toBeLessThan(50);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('clamps result between 0 and 100', () => {
    const result = calculateConsistency([10, 200, 5, 190]);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });
});

// ─── gradePerformance ──────────────────────────────────

describe('gradePerformance', () => {
  it('returns S for exceptional performance', () => {
    expect(gradePerformance(120, 99, 95)).toBe('S');
  });

  it('returns A for excellent performance', () => {
    expect(gradePerformance(85, 97, 85)).toBe('A');
  });

  it('returns B for good performance', () => {
    expect(gradePerformance(65, 95, 70)).toBe('B');
  });

  it('returns C for average performance', () => {
    expect(gradePerformance(45, 92, 60)).toBe('C');
  });

  it('returns D for below average performance', () => {
    expect(gradePerformance(25, 85, 50)).toBe('D');
  });

  it('returns F for poor performance', () => {
    expect(gradePerformance(10, 70, 30)).toBe('F');
  });

  it('returns F when speed is zero', () => {
    expect(gradePerformance(0, 100, 100)).toBe('F');
  });
});

// ─── rateTypist ────────────────────────────────────────

describe('rateTypist', () => {
  it('returns "Typing Master" for 120+ WPM', () => {
    expect(rateTypist(130)).toBe('Typing Master');
  });

  it('returns "Expert Typist" for 90-119 WPM', () => {
    expect(rateTypist(95)).toBe('Expert Typist');
  });

  it('returns "Fast Typist" for 60-89 WPM', () => {
    expect(rateTypist(70)).toBe('Fast Typist');
  });

  it('returns "Average Typist" for 40-59 WPM', () => {
    expect(rateTypist(50)).toBe('Average Typist');
  });

  it('returns "Beginner" for 20-39 WPM', () => {
    expect(rateTypist(25)).toBe('Beginner');
  });

  it('returns "Just Starting" for < 20 WPM', () => {
    expect(rateTypist(10)).toBe('Just Starting');
  });

  it('handles boundary values correctly', () => {
    expect(rateTypist(120)).toBe('Typing Master');
    expect(rateTypist(90)).toBe('Expert Typist');
    expect(rateTypist(60)).toBe('Fast Typist');
    expect(rateTypist(40)).toBe('Average Typist');
    expect(rateTypist(20)).toBe('Beginner');
    expect(rateTypist(19)).toBe('Just Starting');
  });
});

// ─── generateSuggestions ───────────────────────────────

describe('generateSuggestions', () => {
  it('suggests focusing on accuracy when it is low', () => {
    const suggestion = generateSuggestions(60, 85, 80);
    expect(suggestion).toContain('accuracy');
  });

  it('suggests consistent rhythm when consistency is low', () => {
    const suggestion = generateSuggestions(60, 95, 50);
    expect(suggestion).toContain('fluctuates');
  });

  it('encourages practice for slow typists', () => {
    const suggestion = generateSuggestions(30, 95, 80);
    expect(suggestion).toContain('practicing');
  });

  it('congratulates high performers', () => {
    const suggestion = generateSuggestions(110, 99, 95);
    expect(suggestion).toContain('Incredible');
  });

  it('gives generic encouragement for good performers', () => {
    const suggestion = generateSuggestions(70, 96, 80);
    expect(suggestion).toContain('Great job');
  });
});
