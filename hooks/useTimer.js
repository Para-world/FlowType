import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(initialValue, mode = 'countdown') {
  // mode: 'countdown' or 'countup'
  const [timeLeft, setTimeLeft] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  
  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback((newInitialValue = initialValue) => {
    setIsActive(false);
    setTimeLeft(newInitialValue);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [initialValue]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsActive(false);
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, mode]);

  return { timeLeft, isActive, startTimer, pauseTimer, resetTimer };
}
