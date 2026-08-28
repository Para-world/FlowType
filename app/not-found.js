import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-header" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2xl)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            fontSize: '4rem',
            fontWeight: '800',
            letterSpacing: '-0.05em',
            color: 'var(--accent)',
            lineHeight: '1',
            marginBottom: 'var(--space-md)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          404
        </div>

        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Page not found</h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: 'var(--space-xl)',
            lineHeight: '1.6',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-sm) var(--space-xl)',
            fontSize: '0.9rem',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'opacity var(--transition-fast)',
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
