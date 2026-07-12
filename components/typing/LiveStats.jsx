"use client";

import { memo } from 'react';
import styles from './LiveStats.module.css';
import { useStore } from '@/store/useStore';

export default function LiveStats({ wpm, accuracy, time, progress, mistakes }) {
  const { settings } = useStore();

  return (
    <div className={styles.statsBar}>
      {settings.wpmDisplay && (
        <div className={styles.stat}>
          <span className={styles.value}>{wpm}</span>
          <span className={styles.label}>wpm</span>
        </div>
      )}

      {settings.accuracyDisplay && (
        <div className={styles.stat}>
          <span className={styles.value}>{accuracy}%</span>
          <span className={styles.label}>acc</span>
        </div>
      )}

      {settings.timerDisplay && (
        <div className={styles.stat}>
          <span className={styles.value}>{time}s</span>
          <span className={styles.label}>time</span>
        </div>
      )}

      {settings.progressBar && (
        <div className={styles.stat}>
          <span className={styles.value}>{progress}</span>
          <span className={styles.label}>prog</span>
        </div>
      )}
      
      <div className={styles.stat}>
        <span className={`${styles.value} ${mistakes > 0 ? styles.error : ''}`}>{mistakes}</span>
        <span className={styles.label}>err</span>
      </div>
    </div>
  );
}
