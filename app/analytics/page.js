import Card from '@/components/ui/Card';

export default function Analytics() {
  return (
    <div className="page-header">
      <h1>Analytics</h1>
      <p>Track your progress and identify areas for improvement.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <Card variant="elevated">
          <h3>Coming in Phase 5</h3>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            The analytics page will feature trend charts, keyboard heatmaps, and detailed statistics.
          </p>
        </Card>
      </div>
    </div>
  );
}
