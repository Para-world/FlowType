"use client";

import { useAnalytics } from '@/hooks/useAnalytics';
import ProgressChart from '@/components/analytics/ProgressChart';
import ModeRadarChart from '@/components/analytics/ModeRadarChart';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';
import Card from '@/components/ui/Card';
import styles from './analytics.module.css';

export default function Analytics() {
  const { data, loading, error, range, setRange, refetch } = useAnalytics(30);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Analytics</h1>
          <p>Track your progress and identify areas for improvement.</p>
        </div>
        
        <div className={styles.controls}>
          <select 
            value={range} 
            onChange={(e) => setRange(Number(e.target.value))}
            disabled={loading}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>Last Year</option>
          </select>
        </div>
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {loading && !error && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <span>Loading analytics...</span>
        </div>
      )}

      {!loading && !error && data && data.data && (
        <>
          <div className={styles.summaryGrid}>
            <Card>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tests Taken</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                {data.data.dailyStats.reduce((acc, curr) => acc + curr.tests, 0)}
              </p>
            </Card>
            <Card>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg WPM</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                {Math.round(data.data.dailyStats.reduce((acc, curr) => acc + curr.avgWpm, 0) / (data.data.dailyStats.length || 1))}
              </p>
            </Card>
            <Card>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg Accuracy</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#34d399' }}>
                {Math.round(data.data.dailyStats.reduce((acc, curr) => acc + curr.avgAccuracy, 0) / (data.data.dailyStats.length || 1))}%
              </p>
            </Card>
            <Card>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Practice Time</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                {Math.round(data.data.dailyStats.reduce((acc, curr) => acc + curr.totalTime, 0) / 60)} min
              </p>
            </Card>
          </div>

          <div className={styles.mainChartCard}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Performance Over Time</h3>
            <div style={{ height: '350px' }}>
              <ProgressChart dailyStats={data.data.dailyStats} />
            </div>
          </div>

          <div className={styles.secondaryGrid}>
            <div className={styles.chartCard}>
              <h3>Module Strengths</h3>
              <div className={styles.chartWrapper}>
                <ModeRadarChart moduleBreakdown={data.data.moduleBreakdown} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Activity Heatmap</h3>
              <div className={styles.chartWrapper}>
                <ActivityHeatmap hourlyActivity={data.data.hourlyActivity} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
