import Card from '@/components/ui/Card';
import styles from './StatCard.module.css';

export default function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {Icon && <div className={styles.iconWrapper}><Icon size={18} /></div>}
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        {trend && (
          <span className={`${styles.trend} ${trend > 0 ? styles.up : styles.down}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </Card>
  );
}
