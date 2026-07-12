"use client";

import Card from '@/components/ui/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useStore } from '@/store/useStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function WeeklyChart() {
  const { history } = useStore();
  
  // Real app: process history by day. Using mock data for UI demo.
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tests Taken',
        data: [5, 8, 3, 12, 15, 6, 9],
        backgroundColor: 'rgba(167, 139, 250, 0.6)',
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(167, 139, 250, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(16, 16, 26, 0.9)',
        titleColor: '#7a7890',
        bodyColor: '#eae8f2',
      },
    },
    scales: {
      y: { display: false },
      x: {
        grid: { display: false },
        ticks: { color: '#7a7890' }
      }
    }
  };

  return (
    <Card variant="elevated" style={{ height: '100%' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Weekly Activity
      </h3>
      <div style={{ height: '220px' }}>
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}
