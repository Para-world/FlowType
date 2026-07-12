"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';
import styles from './Cursor.module.css';

export default function Cursor({ isActive, charIndex, wordIndex }) {
  const cursorRef = useRef(null);
  const { settings } = useStore();
  const blinkTween = useRef(null);

  useEffect(() => {
    // Setup blinking animation
    blinkTween.current = gsap.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
      ease: 'steps(1)',
      paused: isActive // Pause blinking when actively typing
    });

    return () => {
      if (blinkTween.current) blinkTween.current.kill();
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && blinkTween.current) {
      blinkTween.current.pause();
      gsap.set(cursorRef.current, { opacity: 1 });
    } else if (!isActive && blinkTween.current) {
      blinkTween.current.play();
    }
  }, [isActive]);

  // Position cursor using GSAP based on active character
  useEffect(() => {
    // Find the active character element
    const activeWordEl = document.querySelector(`.${styles.activeWordClass}`); // Wait, this relies on finding the char.
    // A better approach is to let CSS position the cursor relative to the active char, or use JS to find bounding client rect.
    // Let's use JS to find the exact DOM node of the current char.
    
    // We need a stable way to select the current char. 
    // In WordsDisplay, we can add an ID or class to the current char.
    const currentCharEl = document.querySelector('[data-current-char="true"]');
    
    if (currentCharEl && cursorRef.current) {
      const rect = currentCharEl.getBoundingClientRect();
      const parentRect = cursorRef.current.parentElement.getBoundingClientRect();
      
      const x = rect.left - parentRect.left;
      const y = rect.top - parentRect.top;

      gsap.to(cursorRef.current, {
        x: x,
        y: y,
        duration: 0.1, // Smooth glide
        ease: 'power2.out'
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
