"use client";

import { useState, useEffect } from 'react';
import StatsGrid from '@/components/dashboard/StatsGrid';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import GoalRing from '@/components/dashboard/GoalRing';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import styles from './page.module.css';

export default function Dashboard() {
  const { user, isAuthenticated, updateUser, setHistory } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    Promise.all([
      api.get('/users/me'),
      api.get('/stats'),
    ])
      .then(([userData, historyData]) => {
        updateUser({
          stats: {
            bestWpm: userData.stats.bestWpm,
            avgWpm: userData.stats.avgWpm,
            totalTests: userData.stats.totalTests,
            totalPracticeTime: userData.stats.totalPracticeTime,
          },
        });

        // Map backend fields to frontend expected fields
        const mappedHistory = historyData.map((h) => ({
          ...h,
          date: h.createdAt,
          id: h._id,
        }));
        setHistory(mappedHistory);
      })
      .catch((err) => {
        console.error('Failed to sync dashboard data:', err);
        setError('Failed to load your data. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  return (
    <div className="page-header">
      <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
      <p>Here&apos;s how you&apos;re doing today.</p>

      <div className={styles.dashboardContent}>
        {error && (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <span>Syncing your data…</span>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <StatsGrid />

            <div className={styles.chartRow}>
              <WeeklyChart />
              <GoalRing />
            </div>

            <ActivityFeed />
          </>
        )}
      </div>
    </div>
  );
}
