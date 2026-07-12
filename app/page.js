"use client";

import StatsGrid from '@/components/dashboard/StatsGrid';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import GoalRing from '@/components/dashboard/GoalRing';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, isAuthenticated, updateUser, setHistory } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Sync user profile
      api.get('/users/me')
        .then(userData => {
          updateUser({
            stats: {
              bestWpm: userData.stats.bestWpm,
              avgWpm: userData.stats.avgWpm,
              totalTests: userData.stats.totalTests,
              totalPracticeTime: userData.stats.totalPracticeTime,
            }
          });
        })
        .catch(console.error);
        
      // Sync history
      api.get('/stats')
        .then(historyData => {
          // Map backend fields to frontend expected fields
          const mappedHistory = historyData.map(h => ({
            ...h,
            date: h.createdAt,
            id: h._id
          }));
          setHistory(mappedHistory);
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <div className="page-header">
      <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
      <p>Here's how you're doing today.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <StatsGrid />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-lg)'
        }}>
          <WeeklyChart />
          <GoalRing />
        </div>

        <ActivityFeed />
      </div>
    </div>
  );
}
