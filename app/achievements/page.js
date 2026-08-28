import Card from '@/components/ui/Card';

export default function Achievements() {
  return (
    <div className="page-header">
      <h1>Achievements</h1>
      <p>Unlock badges and level up your profile.</p>

      <div className="page-header" style={{ marginTop: '2rem' }}>
        <Card variant="elevated">
          <h3>Coming in Phase 6</h3>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            The achievements page will feature an XP system, badges, and daily challenges.
          </p>
        </Card>
      </div>
    </div>
  );
}
