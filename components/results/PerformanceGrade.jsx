import styles from './PerformanceGrade.module.css';
import { gradePerformance } from '@/lib/scoring';

export default function PerformanceGrade({ wpm, accuracy, consistency }) {
  const grade = gradePerformance(wpm, accuracy, consistency);
  
  return (
    <div className={styles.container}>
      <div className={styles.label}>Grade</div>
      <div className={`${styles.grade} ${styles[`grade${grade}`]}`}>{grade}</div>
    </div>
  );
}
