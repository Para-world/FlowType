import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';

// Simple AudioContext based mechanical click generator
const createClickSound = (audioCtx) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  // Mechanical click profile
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.02);
  
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.02);
};

export function useKeyboard({
  isActive,
  onCharacter,
  onBackspace,
  onSpace,
  onEscape,
  onTabEnter,
}) {
  const { settings } = useStore();
  const audioCtxRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (!isActive) {
      // If not active, we still want to catch Tab+Enter or Escape
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }
      return;
    }

    const playSound = () => {
      if (settings.soundEnabled) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        createClickSound(audioCtxRef.current);
      }
    };

    let keyHandled = false;

    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (e.ctrlKey || e.altKey || e.metaKey) {
        onBackspace(true);
      } else {
        onBackspace(false);
      }
      playSound();
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      onSpace();
      playSound();
      return;
    }

    // Ignore single modifier keys
    if (
      e.key === 'Shift' ||
      e.key === 'Control' ||
      e.key === 'Alt' ||
      e.key === 'Meta' ||
      e.key === 'CapsLock' ||
      e.key === 'Tab' ||
      e.key === 'Enter'
    ) {
      return;
    }

    // Prevent default browser shortcuts if Ctrl/Alt/Meta is pressed (unless it's something we want)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      // Allow standard shortcuts like reload, devtools, etc.
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      onCharacter(e.key);
      playSound();
    }
  }, [isActive, onCharacter, onBackspace, onSpace, onEscape, onTabEnter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
