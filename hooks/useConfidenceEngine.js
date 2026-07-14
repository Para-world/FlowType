import { useState, useEffect, useCallback } from 'react';

const CONFIDENCE_STORAGE_KEY = 'flowtype-key-confidence';

/**
 * Calculates a confidence score (0 to 1) for individual keys.
 * A score of 0.8 means the user is quite proficient with that key.
 */
export function useConfidenceEngine() {
  const [confidenceMap, setConfidenceMap] = useState({});

  // Load on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CONFIDENCE_STORAGE_KEY);
        if (stored) {
          setConfidenceMap(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load confidence map', e);
      }
    }
  }, []);

  /**
   * Update confidence scores based on a charErrorMap from a completed test.
   * charErrorMap format: { 'a': { correct: 10, incorrect: 2 }, 'b': ... }
   */
  const updateConfidence = useCallback((charErrorMap) => {
    setConfidenceMap(prev => {
      const newMap = { ...prev };
      
      for (const [char, stats] of Object.entries(charErrorMap)) {
        const totalAttempts = stats.correct + stats.incorrect;
        if (totalAttempts === 0) continue;

        // Base confidence is the accuracy rate
        const accuracy = stats.correct / totalAttempts;
        
        // We could also incorporate speed if we track per-keystroke timestamps,
        // but accuracy is the most critical metric for muscle memory.
        
        // Exponential moving average to blend old and new confidence
        // If they don't have a score yet, they start at 0.5 (neutral)
        const oldScore = newMap[char] !== undefined ? newMap[char] : 0.5;
        
        // The more attempts in this session, the more weight the new accuracy holds
        const weight = Math.min(totalAttempts * 0.05, 0.4); // max 40% weight to new test
        
        newMap[char] = oldScore * (1 - weight) + accuracy * weight;
        
        // Cap between 0 and 1
        newMap[char] = Math.max(0, Math.min(1, newMap[char]));
      }

      // Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONFIDENCE_STORAGE_KEY, JSON.stringify(newMap));
      }
      
      return newMap;
    });
  }, []);

  /**
   * Checks if the user has reached the required confidence threshold for a specific set of keys.
   */
  const checkLessonPassed = useCallback((unlockedKeys, threshold = 0.8) => {
    if (!unlockedKeys || unlockedKeys.length === 0) return false;
    
    // We only care about the alphabetic/numeric keys for confidence scoring usually,
    // but let's check all required keys.
    for (const key of unlockedKeys) {
      const k = key.toLowerCase();
      const score = confidenceMap[k] || 0;
      if (score < threshold) {
        return false;
      }
    }
    return true;
  }, [confidenceMap]);

  return {
    confidenceMap,
    updateConfidence,
    checkLessonPassed
  };
}
