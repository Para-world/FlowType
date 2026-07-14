"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useTimer } from '@/hooks/useTimer';
import { useKeyboard } from '@/hooks/useKeyboard';
import { generateWordsList } from '@/data/wordBanks';
import { getRandomQuote } from '@/data/quotes';
import { getRandomParagraph } from '@/data/paragraphs';
import { generateAdaptiveWords, saveCharErrors } from '@/data/adaptiveGenerator';
import { generateLessonWords } from '@/data/lessonGenerator';
import { useConfidenceEngine } from '@/hooks/useConfidenceEngine';

import ModeSelector from './ModeSelector';
import ModuleSelector from './ModuleSelector';
import SoundToggle from './SoundToggle';
import WordsDisplay from './WordsDisplay';
import Cursor from './Cursor';
import LiveStats from './LiveStats';
import ProgressBar from './ProgressBar';
import ResultsCard from '../results/ResultsCard';
import { api } from '@/lib/api';
import { useStore } from '@/store/useStore'; // We will build this next

export default function TypingEngine({ lesson = null }) {
  const { isAuthenticated, updateUser, addTestResult } = useStore();
  const [mode, setMode] = useState(lesson ? 'words' : 'time');
  const [modeValue, setModeValue] = useState(lesson ? 30 : 30); // lessons default to 30 words per test
  const [module, setModule] = useState('words');
  
  const { confidenceMap, updateConfidence, checkLessonPassed } = useConfidenceEngine();

  // Initialization logic based on mode/module
  const generateInitialWords = useCallback(() => {
    let rawText = '';
    
    if (lesson) {
      // Use dynamic generator based on lesson unlocked keys
      return generateLessonWords(lesson.unlockedKeys, modeValue, confidenceMap);
    } else if (module === 'adaptive') {
      // Adaptive mode uses the weakness-based generator
      const count = mode === 'words' ? modeValue : 100;
      return generateAdaptiveWords(count);
    } else if (mode === 'time') {
      // Generate enough words to not run out easily (100)
      rawText = generateWordsList(module, 100).join(' ');
    } else if (mode === 'words') {
      rawText = generateWordsList(module, modeValue).join(' ');
    } else if (mode === 'paragraph') {
      rawText = getRandomParagraph(modeValue);
    } else if (mode === 'quotes') {
      rawText = getRandomQuote(modeValue).text;
    }
    
    return rawText.split(' ');
  }, [mode, modeValue, module]);

  const [initialWords, setInitialWords] = useState(generateInitialWords());

  const {
    formattedWords,
    wordIndex,
    charIndex,
    isActive,
    isFinished,
    finalResult,
    stats,
    handleCharacter,
    handleSpace,
    handleBackspace,
    resetTest,
    finishTest,
    recordSnapshot
  } = useTypingEngine(initialWords, mode, modeValue, !!lesson);

  const { timeLeft, startTimer, pauseTimer, resetTimer } = useTimer(
    mode === 'time' ? modeValue : 0, 
    mode === 'time' ? 'countdown' : 'countup'
  );

  // Hook up keyboard
  useKeyboard({
    isActive: true, // Always listen, but internal logic ignores if finished
    onCharacter: handleCharacter,
    onSpace: handleSpace,
    onBackspace: handleBackspace,
    onEscape: () => handleReset(),
  });

  // Start timer on first active
  useEffect(() => {
    if (isActive) {
      startTimer();
    }
  }, [isActive, startTimer]);

  // Handle timer end (time mode)
  useEffect(() => {
    if (mode === 'time' && isActive && timeLeft === 0) {
      finishTest();
    }
  }, [timeLeft, mode, isActive, finishTest]);

  // Snapshot recording
  useEffect(() => {
    if (isActive) {
      const elapsed = mode === 'time' ? modeValue - timeLeft : timeLeft;
      recordSnapshot(elapsed);
    }
  }, [timeLeft, isActive, mode, modeValue, recordSnapshot]);

  const handleReset = useCallback(() => {
    const newWords = generateInitialWords();
    setInitialWords(newWords);
    resetTest(newWords);
    resetTimer(mode === 'time' ? modeValue : 0);
  }, [generateInitialWords, resetTest, resetTimer, mode, modeValue]);

  // Re-init when settings change
  useEffect(() => {
    handleReset();
  }, [mode, modeValue, module, handleReset]);

  // Handle saving result
  useEffect(() => {
    if (isFinished && finalResult) {
      // Always save char error data for the adaptive algorithm (even for guests)
      if (finalResult.charErrorMap) {
        saveCharErrors(finalResult.charErrorMap);
        updateConfidence(finalResult.charErrorMap); // Update lesson confidence map
      }

      if (isAuthenticated) {
        if (lesson) {
          // Check if passed using the confidence engine and base criteria
          const threshold = lesson.passingCriteria.confidenceThreshold || 0.8;
          const isConfident = checkLessonPassed(lesson.unlockedKeys, threshold);
          const passedWpm = finalResult.wpm >= lesson.passingCriteria.minWpm;
          const passedAcc = finalResult.accuracy >= lesson.passingCriteria.minAccuracy;
          
          let stars = 0;
          if (passedWpm && passedAcc && isConfident) {
            stars = 3; 
          }
          
          api.post('/users/lessons', {
            lessonId: lesson.id,
            stars,
            wpm: finalResult.wpm,
            accuracy: finalResult.accuracy
          })
          .then(res => {
            updateUser({ lessons: res.data });
          })
          .catch(err => console.error("Failed to save lesson:", err));
        } else {
          // Normal test
          api.post('/stats', {
            ...finalResult,
            mode,
            module
          })
          .then(() => api.get('/users/me'))
          .then(userData => {
            updateUser({
              bestWpm: userData.stats.bestWpm,
              avgWpm: userData.stats.avgWpm,
              totalTests: userData.stats.totalTests,
              totalPracticeTime: userData.stats.totalPracticeTime,
            });
          })
          .catch(err => console.error("Failed to save stats:", err));
        }
      } else {
        // Fallback for guest mode (local state already handled in ResultsCard, but we can clean that up)
      }
    }
  }, [isFinished, finalResult, lesson, isAuthenticated, mode, module, updateUser]);

  // Progress calc
  let progress = 0;
  if (mode === 'time') {
    progress = ((modeValue - timeLeft) / modeValue) * 100;
  } else if (mode === 'words') {
    progress = (wordIndex / modeValue) * 100;
  } else {
    progress = (wordIndex / initialWords.length) * 100;
  }

  // Calculate live stats
  const elapsed = mode === 'time' ? modeValue - timeLeft : timeLeft;
  const currentWpm = elapsed > 0 ? Math.round((stats.correctChars / 5) / (elapsed / 60)) : 0;
  const currentAcc = stats.totalTypedChars > 0 ? Math.round((stats.correctChars / stats.totalTypedChars) * 100) : 100;

  if (isFinished && finalResult) {
    return <ResultsCard result={finalResult} onRestart={handleReset} lesson={lesson} />;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!isActive && !lesson && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.5s ease' }}>
          <ModeSelector 
            currentMode={mode} 
            currentModeValue={modeValue}
            onModeChange={setMode}
            onValueChange={setModeValue}
          />
          {(mode === 'time' || mode === 'words') && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <SoundToggle />
              <ModuleSelector 
                currentModule={module}
                onModuleChange={setModule}
              />
            </div>
          )}
        </div>
      )}
      
      {!isActive && lesson && (
        <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{lesson.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Target: {lesson.passingCriteria.minWpm} WPM | {lesson.passingCriteria.minAccuracy}% Accuracy</p>
        </div>
      )}

      {isActive && (
        <LiveStats 
          wpm={currentWpm} 
          accuracy={currentAcc} 
          time={timeLeft} 
          progress={`${Math.round(progress)}%`}
          mistakes={stats.incorrectChars}
        />
      )}

      <div style={{ position: 'relative' }}>
        <ProgressBar progress={progress} />
        <Cursor isActive={isActive} charIndex={charIndex} wordIndex={wordIndex} />
        <WordsDisplay words={formattedWords} wordIndex={wordIndex} charIndex={charIndex} />
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <kbd>Esc</kbd> to reset
      </div>
    </div>
  );
}
