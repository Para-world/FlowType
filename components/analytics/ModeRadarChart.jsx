"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function ModeRadarChart({ moduleBreakdown = [] }) {
  if (!moduleBreakdown || moduleBreakdown.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No module data available.
      </div>
    );
  }

  // Ensure all standard modules are represented even if 0
  const standardModules = ['words', 'numbers', 'symbols', 'mixed', 'code', 'punctuation'];
  
  const dataMap = {};
  moduleBreakdown.forEach(item => {
    dataMap[item._id] = item.avgWpm;
  });

  const labels = standardModules.map(m => m.charAt(0).toUpperCase() + m.slice(1));
  const dataset = standardModules.map(m => dataMap[m] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Average WPM by Module',
        data: dataset,
        backgroundColor: 'rgba(167, 139, 250, 0.2)', // accent color translucent
        borderColor: '#a78bfa',
        pointBackgroundColor: '#a78bfa',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#a78bfa',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we only have one dataset and title covers it
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#999',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
        ticks: {
          display: false, // hide the inner numbers for cleaner look
          min: 0,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}
