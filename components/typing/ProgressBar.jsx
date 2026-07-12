"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './ProgressBar.module.css';
import { useStore } from '@/store/useStore';

export default function ProgressBar({ progress }) {
  const { settings } = useStore();
  const barRef = useRef(null);

  useEffect(() => {
    gsap.to(barRef.current, {
      width: `${Math.min(100, Math.max(0, progress))}%`,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [progress]);

  if (!settings.progressBar) return null;

  return (
    <div className={styles.container}>
      <div ref={barRef} className={styles.bar}></div>
    </div>
  );
}
