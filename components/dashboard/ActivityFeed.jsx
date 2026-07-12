import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { Keyboard, Trophy, Zap } from 'lucide-react';
import styles from './ActivityFeed.module.css';

export default function ActivityFeed() {
  const { history } = useStore();
  
  const activities = history.slice(0, 5); // Show last 5

  return (
    <Card variant="elevated" className={styles.card}>
      <div className={styles.header}>
        <h3>Recent Activity</h3>
      </div>
      
      <div className={styles.feed}>
        {activities.length === 0 ? (
          <p className={styles.empty}>No recent activity. Go practice!</p>
        ) : (
          activities.map((item, i) => (
            <div key={item.id || i} className={styles.item}>
              <div className={styles.iconWrapper}>
                {item.wpm > 80 ? <Zap size={16} className={styles.zap} /> : 
                 item.accuracy === 100 ? <Trophy size={16} className={styles.trophy} /> : 
                 <Keyboard size={16} className={styles.keyboard} />}
              </div>
              <div className={styles.content}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>
                    Typed {item.wpm} WPM with {item.accuracy}% accuracy
                  </span>
                  <span className={styles.time}>
                    {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : 'Just now'}
                  </span>
                </div>
                <div className={styles.subtitle}>
                  {item.mode} mode • {item.module}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
