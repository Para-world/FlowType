import { useState, useCallback, useRef } from 'react';
import { calculateWpm, calculateRawWpm, calculateAccuracy, calculateConsistency } from '@/lib/scoring';

export function useTypingEngine(initialWords, mode, modeValue) {
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  
  const startTimeRef = useRef(null);
  const wpmHistoryRef = useRef([]);
  const charErrorMapRef = useRef({}); // { char: { correct: N, incorrect: N } }

  const formatWords = useCallback((wordsArray) => {
    return wordsArray.map(word => ({
      original: word,
      typed: '',
      status: 'pending' 
    }));
  }, []);

  const [state, setState] = useState({
    formattedWords: formatWords(initialWords),
    wordIndex: 0,
    charIndex: 0,
    stats: {
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      missedChars: 0,
      totalTypedChars: 0,
      backspaces: 0,
    }
  });

  const startTest = useCallback(() => {
    setIsActive(true);
    setIsFinished(false);
    startTimeRef.current = Date.now();
    wpmHistoryRef.current = [];
  }, []);

  const finishTest = useCallback(() => {
    if (isFinished) return;

    setIsActive(false);
    setIsFinished(true);
    
    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    const finalWpm = calculateWpm(state.stats.correctChars, elapsedSeconds);
    const finalRawWpm = calculateRawWpm(state.stats.totalTypedChars, elapsedSeconds);
    const finalAccuracy = calculateAccuracy(state.stats.correctChars, state.stats.totalTypedChars);
    const finalConsistency = calculateConsistency(wpmHistoryRef.current);

    setFinalResult({
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      consistency: finalConsistency,
      time: Math.round(elapsedSeconds),
      wpmHistory: [...wpmHistoryRef.current],
      charErrorMap: { ...charErrorMapRef.current },
      ...state.stats
    });
  }, [state.stats, isFinished]);

  const resetTest = useCallback((newWords) => {
    setIsActive(false);
    setIsFinished(false);
    setFinalResult(null);
    setState({
      formattedWords: formatWords(newWords),
      wordIndex: 0,
      charIndex: 0,
      stats: {
        correctChars: 0,
        incorrectChars: 0,
        extraChars: 0,
        missedChars: 0,
        totalTypedChars: 0,
        backspaces: 0,
      }
    });
    startTimeRef.current = null;
    wpmHistoryRef.current = [];
    charErrorMapRef.current = {};
  }, [formatWords]);

  const recordSnapshot = useCallback((elapsedSeconds) => {
    if (elapsedSeconds > 0 && isActive) {
      const currentWpm = calculateWpm(state.stats.correctChars, elapsedSeconds);
      wpmHistoryRef.current.push(currentWpm);
    }
  }, [state.stats.correctChars, isActive]);

  const handleCharacter = useCallback((char) => {
    if (!isActive && !isFinished) {
      startTest();
    }
    if (isFinished) return;

    setState(prev => {
      const { wordIndex, formattedWords, stats } = prev;
      const activeWord = formattedWords[wordIndex];
      
      if (activeWord.typed.length >= activeWord.original.length + 5) {
        return prev; // Ignore too many extra chars
      }

      // Deep copy to avoid mutation
      const newWords = [...formattedWords];
      newWords[wordIndex] = { ...activeWord, typed: activeWord.typed + char };
      
      const expectedChar = activeWord.original[activeWord.typed.length];
      const isCorrect = char === expectedChar;

      // Track per-character errors for adaptive algorithm
      if (expectedChar) {
        const lc = expectedChar.toLowerCase();
        if (!charErrorMapRef.current[lc]) {
          charErrorMapRef.current[lc] = { correct: 0, incorrect: 0 };
        }
        if (isCorrect) {
          charErrorMapRef.current[lc].correct++;
        } else {
          charErrorMapRef.current[lc].incorrect++;
        }
      }
      
      return {
        ...prev,
        formattedWords: newWords,
        charIndex: newWords[wordIndex].typed.length,
        stats: {
          ...stats,
          totalTypedChars: stats.totalTypedChars + 1,
          correctChars: stats.correctChars + (isCorrect ? 1 : 0),
          incorrectChars: stats.incorrectChars + (!isCorrect ? 1 : 0),
          extraChars: stats.extraChars + (newWords[wordIndex].typed.length > activeWord.original.length ? 1 : 0)
        }
      };
    });
  }, [isActive, isFinished, startTest]);

  const handleSpace = useCallback(() => {
    if (!isActive || isFinished) return;
    
    setState(prev => {
      const { wordIndex, formattedWords, stats } = prev;
      
      // If we are at the end, just return
      if (wordIndex >= formattedWords.length) return prev;

      const activeWord = formattedWords[wordIndex];
      const missed = Math.max(0, activeWord.original.length - activeWord.typed.length);
      
      const newWords = [...formattedWords];
      newWords[wordIndex] = {
        ...activeWord,
        status: activeWord.original === activeWord.typed ? 'correct' : 'incorrect'
      };

      const newState = {
        ...prev,
        formattedWords: newWords,
        wordIndex: wordIndex + 1,
        charIndex: 0,
        stats: {
          ...stats,
          missedChars: stats.missedChars + missed,
          totalTypedChars: stats.totalTypedChars + 1 // space counts
        }
      };

      // Check if test ends (for words mode)
      if (mode === 'words' && newState.wordIndex >= modeValue) {
        setTimeout(() => finishTest(), 0);
      }

      return newState;
    });
  }, [isActive, isFinished, mode, modeValue, finishTest]);

  const handleBackspace = useCallback((wordLevel = false) => {
    if (!isActive || isFinished) return;

    setState(prev => {
      const { wordIndex, formattedWords, stats } = prev;
      const newWords = [...formattedWords];
      let activeWord = newWords[wordIndex];

      let newWordIndex = wordIndex;
      let newCharIndex = prev.charIndex;

      if (wordLevel) {
        if (activeWord.typed.length > 0) {
          newWords[wordIndex] = { ...activeWord, typed: '' };
          newCharIndex = 0;
        } else if (wordIndex > 0 && newWords[wordIndex - 1].status !== 'correct') {
          newWordIndex = wordIndex - 1;
          newWords[newWordIndex] = { ...newWords[newWordIndex], status: 'pending' };
          newCharIndex = newWords[newWordIndex].typed.length;
        }
      } else {
        if (activeWord.typed.length > 0) {
          newWords[wordIndex] = { ...activeWord, typed: activeWord.typed.slice(0, -1) };
          newCharIndex = newWords[wordIndex].typed.length;
        } else if (wordIndex > 0 && newWords[wordIndex - 1].status !== 'correct') {
          newWordIndex = wordIndex - 1;
          newWords[newWordIndex] = { ...newWords[newWordIndex], status: 'pending' };
          newCharIndex = newWords[newWordIndex].typed.length;
        }
      }

      return {
        ...prev,
        formattedWords: newWords,
        wordIndex: newWordIndex,
        charIndex: newCharIndex,
        stats: { ...stats, backspaces: stats.backspaces + 1 }
      };
    });
  }, [isActive, isFinished]);

  return {
    formattedWords: state.formattedWords,
    wordIndex: state.wordIndex,
    charIndex: state.charIndex,
    stats: state.stats,
    isActive,
    isFinished,
    finalResult,
    handleCharacter,
    handleSpace,
    handleBackspace,
    startTest,
    finishTest,
    resetTest,
    recordSnapshot
  };
}
