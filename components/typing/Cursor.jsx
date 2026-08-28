"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';
import styles from './Cursor.module.css';

export default function Cursor({ isActive, charIndex, wordIndex }) {
  const cursorRef = useRef(null);
  const { settings } = useStore();
  const blinkTween = useRef(null);

  // Setup blinking when idle
  useEffect(() => {
    blinkTween.current = gsap.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.53,
      ease: 'power2.inOut',
      paused: isActive,
    });

    return () => {
      if (blinkTween.current) blinkTween.current.kill();
    };
  }, [isActive]);

  // Pause/resume blink
  useEffect(() => {
    if (isActive && blinkTween.current) {
      blinkTween.current.pause();
      gsap.set(cursorRef.current, { opacity: 1 });
    } else if (!isActive && blinkTween.current) {
      blinkTween.current.play();
    }
  }, [isActive]);

  const xTo = useRef(null);
  const yTo = useRef(null);

  // Initialize quickTo for high-performance zero-lag tracking
  useEffect(() => {
    if (cursorRef.current) {
      // Reduced duration to 0.04s for lightning-fast tracking while retaining a micro-glide
      xTo.current = gsap.quickTo(cursorRef.current, 'x', { duration: 0.04, ease: 'power3.out' });
      yTo.current = gsap.quickTo(cursorRef.current, 'y', { duration: 0.08, ease: 'power3.out' });
    }
  }, []);

  // Smooth cursor positioning — the hero animation
  useEffect(() => {
    const currentCharEl = document.querySelector('[data-current-char="true"]');
    
    if (currentCharEl && cursorRef.current && xTo.current && yTo.current) {
      const rect = currentCharEl.getBoundingClientRect();
      const parentRect = cursorRef.current.parentElement.getBoundingClientRect();
      
      const x = rect.left - parentRect.left;
      const y = rect.top - parentRect.top;

      xTo.current(x);
      yTo.current(y);

      // Caret impact effect (squash and stretch) on each keystroke
      if (isActive) {
        // Subtle and extremely fast scale to prevent visual noise at 150+ WPM
        gsap.fromTo(cursorRef.current, 
          { scaleX: 1.15, scaleY: 0.9 },
          { scaleX: 1, scaleY: 1, duration: 0.08, ease: 'power2.out' }
        );
      }
    }
  }, [isActive, charIndex, wordIndex]);

  // Determine cursor class based on setting
  let cursorClass = styles.line;
  if (settings.cursorStyle === 'block') cursorClass = styles.block;
  if (settings.cursorStyle === 'underline') cursorClass = styles.underline;

  return (
    <div 
      ref={cursorRef} 
      className={`${styles.cursor} ${cursorClass}`}
    />
  );
}
