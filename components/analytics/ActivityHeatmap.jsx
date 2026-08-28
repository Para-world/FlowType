"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ActivityHeatmap({ hourlyActivity = [] }) {
  if (!hourlyActivity || hourlyActivity.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No hourly activity data available.
      </div>
    );
  }

  // Create an array for all 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const dataMap = {};
  hourlyActivity.forEach(item => {
    dataMap[item._id] = item.count;
  });

  const dataset = hours.map(h => dataMap[h] || 0);
  const labels = hours.map(h => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}${ampm}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Tests Completed',
        data: dataset,
        backgroundColor: dataset.map(val => 
          val > 0 ? 'rgba(52, 211, 153, 0.8)' : 'rgba(255, 255, 255, 0.05)'
        ),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            return `${context.raw} tests completed`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: { family: "'Inter', sans-serif", size: 10 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        display: false, // hide Y axis for a cleaner heatmap look
        min: 0,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
