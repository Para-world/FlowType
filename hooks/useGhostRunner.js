import { useState, useEffect, useRef } from 'react';

/**
 * Calculates the position of the "Ghost Runner" (Pace Car) based on a target WPM.
 */
export function useGhostRunner(isActive, targetWpm, formattedWords) {
  const [ghostIndices, setGhostIndices] = useState({ wordIndex: 0, charIndex: 0 });
  const lastTimeRef = useRef(null);
  const flatGhostIndexRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Helper to map a flat character index to a word/char index
  const getIndicesFromFlatIndex = (flatIndex, words) => {
    let currentFlat = 0;
    
    for (let w = 0; w < words.length; w++) {
      const wordLen = words[w].original.length;
      
      // If the flat index is within this word
      if (flatIndex < currentFlat + wordLen) {
        return { wordIndex: w, charIndex: flatIndex - currentFlat };
      }
      
      currentFlat += wordLen;
      
      // If the flat index is exactly on the space after the word
      if (flatIndex === currentFlat && w < words.length - 1) {
        // Technically it's in the space, but we'll represent that as being at the very end of the current word
        return { wordIndex: w, charIndex: wordLen };
      }
      
      // Add 1 for the space character
      currentFlat += 1;
    }

    // If it exceeds the text, stay on the last char of the last word
    const lastWordIdx = words.length - 1;
    return { wordIndex: lastWordIdx, charIndex: words[lastWordIdx].original.length };
  };

  useEffect(() => {
    if (!isActive || !targetWpm || !formattedWords || formattedWords.length === 0) {
      if (!isActive) {
        // Reset when inactive
        flatGhostIndexRef.current = 0;
        setGhostIndices({ wordIndex: 0, charIndex: 0 });
        lastTimeRef.current = null;
      }
      return;
    }

    const charsPerSecond = (targetWpm * 5) / 60;

    const updateGhost = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      
      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = timestamp;

      flatGhostIndexRef.current += charsPerSecond * deltaTime;
      
      const integerFlatIndex = Math.floor(flatGhostIndexRef.current);
      
      const newIndices = getIndicesFromFlatIndex(integerFlatIndex, formattedWords);
      
      // Only trigger state update if it actually moved to a new character
      setGhostIndices(prev => {
        if (prev.wordIndex !== newIndices.wordIndex || prev.charIndex !== newIndices.charIndex) {
          return newIndices;
        }
        return prev;
      });

      animationFrameRef.current = requestAnimationFrame(updateGhost);
    };

    animationFrameRef.current = requestAnimationFrame(updateGhost);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, targetWpm, formattedWords]);

  return ghostIndices;
}
