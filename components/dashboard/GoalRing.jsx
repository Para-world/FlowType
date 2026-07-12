"use client";

import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import styles from './GoalRing.module.css';

export default function GoalRing() {
  const { user } = useStore();
  const dailyGoal = 20; // 20 mins
  
  // Convert seconds to minutes for the goal
  const practiceMins = Math.floor((user.totalPracticeTime || 0) / 60);
  const progress = Math.min(100, (practiceMins / dailyGoal) * 100);
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Card variant="elevated" className={styles.card}>
      <h3 className={styles.title}>Daily Goal</h3>
      <div className={styles.ringContainer}>
        <svg className={styles.svg} width="160" height="160">
          {/* Background Ring */}
          <circle 
            className={styles.bgRing} 
            strokeWidth="12" 
            fill="transparent" 
            r={radius} 
            cx="80" 
            cy="80" 
          />
          {/* Progress Ring */}
          <circle 
            className={styles.progressRing} 
            strokeWidth="12" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent" 
            r={radius} 
            cx="80" 
            cy="80" 
          />
        </svg>
        <div className={styles.centerText}>
          <span className={styles.value}>{practiceMins}</span>
          <span className={styles.label}>/ {dailyGoal} min</span>
        </div>
      </div>
      <p className={styles.message}>
        {progress >= 100 ? "Goal met! Great job! 🎉" : "Keep typing to reach your daily goal."}
      </p>
    </Card>
  );
}
