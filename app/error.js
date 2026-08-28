"use client";

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="page-header" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--error-dim)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2xl)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--error-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
            fontSize: '1.5rem',
          }}
        >
          ⚠️
        </div>

        <h2 style={{ marginBottom: 'var(--space-sm)', color: 'var(--error)' }}>
          Something went wrong
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: 'var(--space-xl)',
            lineHeight: '1.6',
          }}
        >
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <button
          onClick={() => reset()}
          style={{
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-sm) var(--space-xl)',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity var(--transition-fast)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
