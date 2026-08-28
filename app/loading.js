"use client";

import styles from './page.module.css';

export default function Loading() {
  return (
    <div className="page-header">
      {/* Title skeleton */}
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonSubtitle} />

      <div style={{ marginTop: '2rem' }}>
        {/* Stats grid skeleton */}
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>

        {/* Chart area skeleton */}
        <div className={styles.skeletonChartRow}>
          <div className={styles.skeletonChartLarge} />
          <div className={styles.skeletonChartSmall} />
        </div>

        {/* Activity feed skeleton */}
        <div className={styles.skeletonCard} style={{ height: '200px' }} />
      </div>
    </div>
  );
}
