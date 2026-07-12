import styles from './Suggestions.module.css';
import { generateSuggestions } from '@/lib/scoring';
import { Lightbulb } from 'lucide-react';

export default function Suggestions({ wpm, accuracy, consistency }) {
  const suggestion = generateSuggestions(wpm, accuracy, consistency);
  
  return (
    <div className={styles.container}>
      <Lightbulb className={styles.icon} size={20} />
      <div className={styles.content}>
        <h4>AI Suggestion</h4>
        <p>{suggestion}</p>
      </div>
    </div>
  );
}
