import styles from './Card.module.css';

export default function Card({ children, className = '', variant = 'default', ...props }) {
  // variant: default, primary, elevated
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
