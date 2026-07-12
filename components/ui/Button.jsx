import styles from './Button.module.css';

export default function Button({ 
  children, 
  variant = 'primary', // primary, secondary, ghost, danger
  size = 'md', // sm, md, lg
  className = '', 
  icon: Icon,
  ...props 
}) {
  return (
    <button 
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} className={styles.icon} />}
      {children}
    </button>
  );
}
