import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'md', color = 'accent' }) {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
      <div className={styles.circle}></div>
    </div>
  );
}
