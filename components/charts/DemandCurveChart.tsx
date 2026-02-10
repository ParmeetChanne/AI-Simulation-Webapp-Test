'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export type XYPoint = { x: number; y: number };

interface DemandCurveChartProps {
  curve: XYPoint[];
  point: XYPoint;
  xMax?: number;
  yMax?: number;
}

export default function DemandCurveChart({ curve, point, xMax, yMax }: DemandCurveChartProps) {
  const data = {
    datasets: [
      {
        label: 'Demand curve',
        data: curve,
        parsing: false as const,
        borderColor: '#06402B',
        backgroundColor: 'rgba(6, 64, 43, 0.10)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.25,
        fill: false,
      },
      {
        label: 'Current price & quantity',
        data: [point],
        parsing: false as const,
        borderColor: '#03594D',
        backgroundColor: '#82EDA6',
        pointRadius: 6,
        pointHoverRadius: 7,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { x: number; y: number } }) =>
            `Q: ${ctx.parsed.x.toFixed(0)}  |  P: $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'Quantity (members)' },
        grid: { color: 'rgba(6, 64, 43, 0.08)' },
        ticks: { color: '#06402B' },
        suggestedMin: 0,
        suggestedMax: xMax,
      },
      y: {
        type: 'linear' as const,
        title: { display: true, text: 'Price ($)' },
        grid: { color: 'rgba(6, 64, 43, 0.08)' },
        ticks: {
          color: '#06402B',
          callback: (v: string | number) => `$${Number(v).toFixed(0)}`,
        },
        suggestedMin: 0,
        suggestedMax: yMax ?? 30,
      },
    },
  };

  return <Line data={data} options={options as unknown as object} />;
}

