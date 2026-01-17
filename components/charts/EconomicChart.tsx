'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';
import type { EconomicState } from '@/types/simulation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EconomicChartProps {
  type: 'line' | 'bar';
  title: string;
  initialState: EconomicState;
  finalState: EconomicState;
  decisionHistory: Array<{ stateAfter: EconomicState }>;
  dataKey: keyof EconomicState;
  color?: string;
  delay?: number;
}

export default function EconomicChart({
  type,
  title,
  initialState,
  finalState,
  decisionHistory,
  dataKey,
  color = '#0ea5e9',
  delay = 0,
}: EconomicChartProps) {
  // Create data points: start, after each decision, end
  const labels = ['Start', ...decisionHistory.map((_, i) => `Step ${i + 1}`), 'End'];
  const dataPoints = [
    initialState[dataKey],
    ...decisionHistory.map((record) => record.stateAfter[dataKey]),
    finalState[dataKey],
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        borderColor: color,
        backgroundColor: type === 'bar' ? color : `${color}20`,
        fill: type === 'line',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
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
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            if (dataKey === 'publicConfidence') {
              return `${title}: ${Math.round(value)}/100`;
            }
            return `${title}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          callback: (value: any) => {
            if (dataKey === 'publicConfidence') {
              return `${value}/100`;
            }
            return `${value}%`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-64">
        <ChartComponent data={chartData} options={options} />
      </div>
    </motion.div>
  );
}
