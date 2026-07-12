"use client";

import { useStore } from '@/store/useStore';
import { usePathname } from 'next/navigation';
import { Flame, Star } from 'lucide-react';
import styles from './Topbar.module.css';

const routeTitles = {
  '/': 'Dashboard',
  '/practice': 'Practice',
  '/lessons': 'Lessons',
  '/analytics': 'Analytics',
  '/games': 'Games',
  '/achievements': 'Achievements',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function Topbar() {
  const pathname = usePathname();
  const title = routeTitles[pathname] || 'FlowType';
  const { user } = useStore();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.statBadge}>
          <Flame size={16} className={styles.streakIcon} />
          <span>{typeof user.streak === 'object' ? user.streak.current : user.streak}</span>
        </div>
        
        <div className={styles.statBadge}>
          <Star size={16} className={styles.xpIcon} />
          <span>Lvl {user.level}</span>
        </div>

        <div className={styles.avatar}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
}
