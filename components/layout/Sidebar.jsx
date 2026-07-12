"use client";

import { useStore } from '@/store/useStore';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Keyboard, 
  BookOpen, 
  BarChart2, 
  Gamepad2, 
  Trophy, 
  User, 
  Settings,
  LogOut,
  LogIn
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Practice', path: '/practice', icon: Keyboard },
  { name: 'Lessons', path: '/lessons', icon: BookOpen },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Games', path: '/games', icon: Gamepad2 },
  { name: 'Achievements', path: '/achievements', icon: Trophy },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M8 10h12M8 14h8M8 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className={styles.brandName}>FlowType</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <item.icon className={styles.icon} size={20} />
              <span className={styles.label}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.authSection}>
        {isAuthenticated ? (
          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <User size={16} />
              <span>{user.username}</span>
            </div>
            <button onClick={handleLogout} className={styles.authBtn} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className={styles.loginBtn}>
            <LogIn size={18} />
            <span>Login / Sign Up</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
