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

  // Smooth cursor positioning — the hero animation
  useEffect(() => {
    const currentCharEl = document.querySelector('[data-current-char="true"]');
    
    if (currentCharEl && cursorRef.current) {
      const rect = currentCharEl.getBoundingClientRect();
      const parentRect = cursorRef.current.parentElement.getBoundingClientRect();
      
      const x = rect.left - parentRect.left;
      const y = rect.top - parentRect.top;

      gsap.to(cursorRef.current, {
        x,
        y,
        duration: 0.08,
        ease: 'power2.out',
      });
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
