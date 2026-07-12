"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import WpmChart from './WpmChart';
import PerformanceGrade from './PerformanceGrade';
import Suggestions from './Suggestions';
import { RotateCcw, ChevronRight, List } from 'lucide-react';
import styles from './ResultsCard.module.css';
import { rateTypist } from '@/lib/scoring';
import { lessons } from '@/data/lessons';

export default function ResultsCard({ result, onRestart, lesson = null }) {
  const cardRef = useRef(null);
  const router = useRouter();
  const { updateUser, user, addTestResult, isAuthenticated } = useStore();
  const { wpm, accuracy, consistency, time, correctChars, incorrectChars, extraChars, missedChars, rawWpm } = result;

  useEffect(() => {
    // Animation
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
    );

    if (!isAuthenticated && !lesson) {
      const newTotalTests = (user.totalTests || 0) + 1;
      const newBestWpm = Math.max(user.bestWpm || 0, wpm);
      const newAvgWpm = Math.round((((user.avgWpm || 0) * (user.totalTests || 0)) + wpm) / newTotalTests);
      
      updateUser({
        totalTests: newTotalTests,
        bestWpm: newBestWpm,
        avgWpm: newAvgWpm,
      });

      addTestResult(result);
    }
  }, []); // Run once on mount

  const title = rateTypist(wpm);

  let isLessonPassed = false;
  let nextLessonId = null;
  
  if (lesson) {
    isLessonPassed = wpm >= lesson.passingCriteria.minWpm && accuracy >= lesson.passingCriteria.minAccuracy;
    
    // Find next lesson
    const currentIndex = lessons.findIndex(l => l.id === lesson.id);
    if (currentIndex > -1 && currentIndex < lessons.length - 1) {
      nextLessonId = lessons[currentIndex + 1].id;
    }
  }

  return (
    <div ref={cardRef} className={styles.wrapper}>
      <Card variant="elevated" className={styles.card}>
        
        {lesson ? (
          <div className={styles.header} style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
            <h2 className={styles.title} style={{ color: isLessonPassed ? 'var(--success)' : 'var(--danger)', fontSize: '2rem' }}>
              {isLessonPassed ? 'Lesson Passed! 🎉' : 'Lesson Failed 😢'}
            </h2>
            <p className={styles.subtitle}>
              {isLessonPassed 
                ? "Great job! You met the passing criteria." 
                : `You need at least ${lesson.passingCriteria.minWpm} WPM and ${lesson.passingCriteria.minAccuracy}% accuracy to pass.`}
            </p>
          </div>
        ) : (
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.subtitle}>Test completed in {time}s</p>
            </div>
            <PerformanceGrade wpm={wpm} accuracy={accuracy} consistency={consistency} />
          </div>
        )}

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <span className={styles.label}>wpm</span>
            <span className={styles.value}>{wpm}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.label}>acc</span>
            <span className={styles.value}>{accuracy}%</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.label}>raw</span>
            <span className={styles.value}>{rawWpm}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.label}>con</span>
            <span className={styles.value}>{consistency}%</span>
          </div>
        </div>

        <WpmChart wpmHistory={result.wpmHistory || []} />

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span>Characters</span>
            <span>{correctChars}/{incorrectChars}/{extraChars}/{missedChars}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Time</span>
            <span>{time}s</span>
          </div>
        </div>

        {!lesson && <Suggestions wpm={wpm} accuracy={accuracy} consistency={consistency} />}

        <div className={styles.actions}>
          <Button icon={RotateCcw} onClick={onRestart} variant="secondary">
            {lesson ? 'Retry Lesson' : 'Restart Test'}
          </Button>
          
          {lesson ? (
            <>
              <Button icon={List} onClick={() => router.push('/lessons')} variant="secondary">
                All Lessons
              </Button>
              {isLessonPassed && nextLessonId && (
                <Button icon={ChevronRight} onClick={() => router.push(`/lessons/${nextLessonId}`)} variant="primary">
                  Next Lesson
                </Button>
              )}
            </>
          ) : (
            <Button icon={ChevronRight} onClick={onRestart} variant="primary">
              Next Test
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
