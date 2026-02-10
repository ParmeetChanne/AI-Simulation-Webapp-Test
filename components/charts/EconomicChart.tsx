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
import type { SimulationState, MetricDefinition } from '@/types/simulation';
import { formatMetricValue } from '@/lib/simulation/engine';

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
  metric: MetricDefinition;
  initialState: SimulationState;
  finalState: SimulationState;
  decisionHistory: Array<{ stateAfter: SimulationState }>;
  color?: string;
  delay?: number;
}

export default function EconomicChart({
  type,
  metric,
  initialState,
  finalState,
  decisionHistory,
  color,
  delay = 0,
}: EconomicChartProps) {
  const dataKey = metric.key;
  const labels = ['Start', ...decisionHistory.map((_, i) => `Step ${i + 1}`), 'End'];
  const dataPoints = [
    initialState[dataKey] ?? 0,
    ...decisionHistory.map((record) => record.stateAfter[dataKey] ?? 0),
    finalState[dataKey] ?? 0,
  ];

  const lineColor = color ?? '#06402B';
  const fillColor = type === 'bar' ? lineColor : `${lineColor}20`;

  const chartData = {
    labels,
    datasets: [
      {
        label: metric.label,
        data: dataPoints,
        borderColor: lineColor,
        backgroundColor: fillColor,
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
          label: (context: { parsed: { y?: number | null } }) => {
            const value = context.parsed?.y ?? 0;
            return `${metric.label}: ${formatMetricValue(value, metric)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(6, 64, 43, 0.12)',
        },
        ticks: {
          color: '#06402B',
          font: { family: 'var(--font-inter)' },
          callback: (value: string | number) => {
            const n = typeof value === 'string' ? parseFloat(value) : value;
            return formatMetricValue(n, metric);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#06402B',
          font: { family: 'var(--font-inter)' },
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
      className="rounded-xl p-6 border-2"
      style={{
        backgroundColor: '#FFFFE3',
        borderColor: '#06402B',
        boxShadow: '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B',
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}
      >
        {metric.label}
      </h3>
      <div className="h-64">
        <ChartComponent data={chartData} options={options as object} />
      </div>
    </motion.div>
  );
}
