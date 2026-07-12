import Card from '@/components/ui/Card';

export default function Games() {
  return (
    <div className="page-header">
      <h1>Games</h1>
      <p>Have fun while improving your typing speed.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <Card variant="elevated">
          <h3>Coming in Phase 7</h3>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            The games page will feature Falling Words, Speed Challenge, and Survival Mode.
          </p>
        </Card>
      </div>
    </div>
  );
}
