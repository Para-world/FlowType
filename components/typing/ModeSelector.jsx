"use client";

import styles from './ModeSelector.module.css';
import { Clock, Hash, AlignLeft, Quote } from 'lucide-react';

const modes = [
  { id: 'time', icon: Clock, label: 'time', values: [15, 30, 60, 120] },
  { id: 'words', icon: Hash, label: 'words', values: [10, 25, 50, 100] },
  { id: 'paragraph', icon: AlignLeft, label: 'paragraph', values: ['easy', 'medium', 'hard'] },
  { id: 'quotes', icon: Quote, label: 'quotes', values: ['all', 'short', 'long'] },
];

export default function ModeSelector({ currentMode, currentModeValue, onModeChange, onValueChange }) {
  const activeModeObj = modes.find(m => m.id === currentMode) || modes[0];

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        {modes.map(mode => (
          <button
            key={mode.id}
            className={`${styles.btn} ${currentMode === mode.id ? styles.active : ''}`}
            onClick={() => {
              if (currentMode !== mode.id) {
                onModeChange(mode.id);
                onValueChange(mode.values[1]); // Default to second option
              }
            }}
          >
            <mode.icon size={14} className={styles.icon} />
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.divider}></div>

      <div className={styles.group}>
        {activeModeObj.values.map(val => (
          <button
            key={val}
            className={`${styles.btn} ${currentModeValue === val ? styles.active : ''}`}
            onClick={() => onValueChange(val)}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}
