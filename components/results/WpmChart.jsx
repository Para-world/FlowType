"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function WpmChart({ wpmHistory = [], rawWpmHistory = [] }) {
  const labels = wpmHistory.map((_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: 'WPM',
        data: wpmHistory,
        borderColor: '#a78bfa', // accent color
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(16, 16, 26, 0.9)',
        titleColor: '#7a7890',
        bodyColor: '#eae8f2',
        borderColor: 'rgba(163, 130, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(122, 120, 144, 0.1)' },
        ticks: { color: '#7a7890' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#7a7890', maxTicksLimit: 10 }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div style={{ width: '100%', height: '200px', marginTop: '1rem' }}>
      <Line data={data} options={options} />
    </div>
  );
}
