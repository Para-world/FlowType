"use client";

import TypingEngine from '@/components/typing/TypingEngine';
import styles from './practice.module.css';

export default function Practice() {
  return (
    <div className={styles.practiceContainer}>
      <TypingEngine />
    </div>
  );
}
