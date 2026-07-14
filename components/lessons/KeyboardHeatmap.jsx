"use client";

import { useConfidenceEngine } from '@/hooks/useConfidenceEngine';
import styles from './KeyboardHeatmap.module.css';

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
  ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
  ['space']
];

export default function KeyboardHeatmap({ unlockedKeys = [] }) {
  const { confidenceMap } = useConfidenceEngine();
  
  // Create a fast lookup set for unlocked keys
  const unlockedSet = new Set(unlockedKeys.map(k => k.toLowerCase()));

  const getKeyColor = (key) => {
    // Special keys
    if (['backspace', 'tab', 'caps', 'enter', 'shift', 'space'].includes(key)) {
      return 'var(--bg-secondary)'; // Neutral color
    }
    
    // If we have unlocked keys defined, and this key isn't in it, grey it out
    if (unlockedSet.size > 0 && !unlockedSet.has(key)) {
      return 'var(--bg-secondary)'; 
    }

    const confidence = confidenceMap[key];
    
    if (confidence === undefined) {
      // Unlocked but not yet typed enough to have a score
      return 'rgba(255, 255, 255, 0.1)'; 
    }

    // Color gradient from Red (weak) to Green (strong)
    // Red: H=0, Green: H=120
    const hue = Math.floor(confidence * 120);
    return `hsl(${hue}, 60%, 40%)`;
  };

  const getKeyClass = (key) => {
    if (key === 'backspace') return styles.backspace;
    if (key === 'tab') return styles.tab;
    if (key === 'caps') return styles.caps;
    if (key === 'enter') return styles.enter;
    if (key === 'shift') return styles.shift;
    if (key === 'space') return styles.space;
    return styles.standard;
  };

  return (
    <div className={styles.keyboardContainer}>
      <div className={styles.heatmapLegend}>
        <span>Weak</span>
        <div className={styles.gradientBar}></div>
        <span>Mastered</span>
      </div>
      
      <div className={styles.keyboard}>
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((key, keyIndex) => (
              <div 
                key={keyIndex} 
                className={`${styles.key} ${getKeyClass(key)}`}
                style={{ backgroundColor: getKeyColor(key) }}
              >
                {key === 'space' ? '' : key}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
