import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  LineController,
  BarController,
  DoughnutController,
  RadarController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

/**
 * Register Chart.js components used only on the professor demo dashboard.
 * Safe to call multiple times; Chart.register dedupes.
 */
export function registerProfessorDashboardCharts(): void {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    LineController,
    BarController,
    DoughnutController,
    RadarController,
    Title,
    Tooltip,
    Legend,
    Filler
  );
}

export const DASH_CHART_ANIMATION = {
  duration: 1100,
  easing: 'easeOutQuart' as const,
};

export const dashChartFont = {
  family: 'var(--font-inter)',
};
