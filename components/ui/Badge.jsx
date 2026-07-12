import styles from './Badge.module.css';

export default function Badge({ children, variant = 'default', className = '' }) {
  // variant: default, primary, success, warning, error, outline
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
