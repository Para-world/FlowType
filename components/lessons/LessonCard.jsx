import Link from 'next/link';
import { Star, CheckCircle, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import styles from './LessonCard.module.css';

export default function LessonCard({ lesson, status }) {
  const { isCompleted, stars = 0, bestWpm = 0, accuracy = 0 } = status || {};

  return (
    <Link href={`/lessons/${lesson.id}`} className={styles.link}>
      <Card variant={isCompleted ? "glass" : "elevated"} className={`${styles.card} ${isCompleted ? styles.completed : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{lesson.title}</h3>
          {isCompleted && (
            <div className={styles.stars}>
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= stars ? styles.starFilled : styles.starEmpty}
                  fill={star <= stars ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          )}
        </div>
        
        <p className={styles.description}>{lesson.description}</p>
        
        <div className={styles.footer}>
          <div className={styles.criteria}>
            <Badge variant="outline">
              Target: {lesson.passingCriteria.minWpm} WPM
            </Badge>
          </div>
          
          {isCompleted ? (
            <div className={styles.stats}>
              <span className={styles.stat} title="Best WPM">
                <Clock size={14} /> {bestWpm}
              </span>
              <span className={styles.stat} title="Best Accuracy">
                <CheckCircle size={14} /> {accuracy}%
              </span>
            </div>
          ) : (
            <span className={styles.unplayedText}>Start Lesson</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
