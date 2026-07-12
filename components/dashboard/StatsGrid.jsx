"use client";

import { useStore } from '@/store/useStore';
import StatCard from './StatCard';
import { Target, Zap, Clock, Keyboard } from 'lucide-react';
import styles from './StatsGrid.module.css';

export default function StatsGrid() {
  const { user } = useStore();

  // Convert seconds to readable format (e.g., 2h 15m)
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return '0m';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className={styles.grid}>
      <StatCard 
        title="Best WPM" 
        value={user.stats?.bestWpm || 0} 
        subtitle="All-time personal record"
        icon={Zap}
        trend={+5}
      />
      <StatCard 
        title="Avg WPM" 
        value={user.stats?.avgWpm || 0} 
        subtitle="Across all past tests"
        icon={Target}
      />
      <StatCard 
        title="Tests Taken" 
        value={user.stats?.totalTests || 0} 
        subtitle="Total completed tests"
        icon={Keyboard}
      />
      <StatCard 
        title="Time Typed" 
        value={formatTime(user.stats?.totalPracticeTime || 0)} 
        subtitle="Total practice time"
        icon={Clock}
      />
    </div>
  );
}
