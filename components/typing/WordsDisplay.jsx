"use client";

import { useEffect, useRef, useState, memo } from 'react';
import gsap from 'gsap';
import styles from './WordsDisplay.module.css';

const Word = memo(({ wordObj, isActiveWord, isCompleted, charIndex, wordRef, isGhostWord, ghostCharIndex }) => {
  let wordStatusClass = '';
  if (wordObj.status === 'correct') wordStatusClass = styles.correctWord;
  else if (wordObj.status === 'incorrect') wordStatusClass = styles.incorrectWord;

  return (
    <div 
      className={`${styles.word} ${isActiveWord ? styles.active : ''} ${isCompleted ? styles.completed : ''} ${wordStatusClass}`}
      ref={wordRef}
    >
      {wordObj.original.split('').map((char, j) => {
        let charClass = '';
        if (isActiveWord) {
          if (j < charIndex) {
            charClass = wordObj.typed[j] === char ? styles.correctChar : styles.incorrectChar;
          } else if (j === charIndex) {
            charClass = styles.currentChar;
          }
        } else if (isCompleted) {
          charClass = wordObj.typed[j] === char ? styles.correctChar : styles.incorrectChar;
        }

        const isGhostChar = isGhostWord && j === ghostCharIndex;

        return (
          <span 
            key={j} 
            className={`${styles.char} ${charClass} ${isGhostChar ? styles.ghostChar : ''}`}
            data-current-char={isActiveWord && j === charIndex}
            data-ghost-char={isGhostChar}
          >
            {char}
          </span>
        );
      })}
      
      {/* Extra typed characters */}
      {wordObj.typed.length > wordObj.original.length && (
        <span className={styles.extraChars}>
          {wordObj.typed.slice(wordObj.original.length).split('').map((char, j) => (
            <span key={`extra-${j}`} className={`${styles.char} ${styles.incorrectChar}`}>
              {char}
            </span>
          ))}
        </span>
      )}
    </div>
  );
});
Word.displayName = 'Word';

const WordsDisplay = memo(({ words, wordIndex, charIndex, ghostWordIndex = null, ghostCharIndex = null }) => {
  const containerRef = useRef(null);
  const activeWordRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  // Measure line height on mount
  useEffect(() => {
    if (activeWordRef.current) {
      const height = activeWordRef.current.getBoundingClientRect().height;
      // Including margin/gap
      setLineHeight(height + 12); 
    }
  }, []);

  // Handle auto-scrolling
  useEffect(() => {
    if (activeWordRef.current && containerRef.current && lineHeight > 0) {
      // offsetTop is the position of the word within the relative container
      const offsetTop = activeWordRef.current.offsetTop;
      
      // If the word is on the 3rd line or below (we want to keep active on 2nd line ideally)
      // Actually, standard is: keep it on the 2nd line if possible.
      // So if offsetTop > lineHeight, we scroll up by (offsetTop - lineHeight)
      
      let targetY = 0;
      if (offsetTop > lineHeight * 0.5) {
        targetY = -(offsetTop - lineHeight);
      }
      
      gsap.to(containerRef.current, {
        y: targetY,
        duration: 0.2,
        ease: 'back.out(1.0)',
      });
    }
  }, [wordIndex, lineHeight]);

  // Reset scroll on new test
  useEffect(() => {
    if (wordIndex === 0 && charIndex === 0 && containerRef.current) {
      gsap.set(containerRef.current, { y: 0 });
    }
  }, [wordIndex, charIndex]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        {words.map((wordObj, i) => {
          const isActiveWord = i === wordIndex;
          const isCompleted = i < wordIndex;
          const isGhostWord = i === ghostWordIndex;

          return (
            <Word
              key={i}
              wordObj={wordObj}
              isActiveWord={isActiveWord}
              isCompleted={isCompleted}
              charIndex={isActiveWord ? charIndex : null} // Only pass changing charIndex to active word
              wordRef={isActiveWord ? activeWordRef : null}
              isGhostWord={isGhostWord}
              ghostCharIndex={isGhostWord ? ghostCharIndex : null}
            />
          );
        })}
      </div>
    </div>
  );
});

WordsDisplay.displayName = 'WordsDisplay';
export default WordsDisplay;
