"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProgressChart({ dailyStats = [] }) {
  if (!dailyStats || dailyStats.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No typing data available for this period.
      </div>
    );
  }

  const labels = dailyStats.map((stat) => {
    // Format date from YYYY-MM-DD to MM/DD
    const date = new Date(stat._id);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const wpmData = dailyStats.map((stat) => stat.avgWpm);
  const accuracyData = dailyStats.map((stat) => stat.avgAccuracy);

  const data = {
    labels,
    datasets: [
      {
        label: 'Average WPM',
        data: wpmData,
        borderColor: '#a78bfa', // accent color
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        borderWidth: 3,
        tension: 0.4, // smooth curves
        fill: true,
        yAxisID: 'y',
        pointBackgroundColor: '#a78bfa',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#a78bfa',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Accuracy (%)',
        data: accuracyData,
        borderColor: '#34d399', // green color for accuracy
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#34d399',
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#999', // text-secondary
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: { family: "'Inter', sans-serif" },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Words Per Minute',
          color: '#666',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#666',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Accuracy %',
          color: '#666',
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis
        },
        min: 0,
        max: 100,
        ticks: {
          color: '#666',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
