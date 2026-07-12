"use client";

import { useRef } from 'react';
import { useGsap } from '@/hooks/useGsap';
import gsap from 'gsap';
import { X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast({ title, description, variant = 'info', onClose }) {
  const toastRef = useRef(null);

  useGsap(() => {
    // Entrance animation
    gsap.fromTo(
      toastRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
    );

    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      closeToast();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const closeToast = () => {
    gsap.to(toastRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  return (
    <div ref={toastRef} className={`${styles.toast} ${styles[variant]}`}>
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button onClick={closeToast} className={styles.closeBtn} aria-label="Close">
        <X size={16} />
      </button>
    </div>
  );
}
