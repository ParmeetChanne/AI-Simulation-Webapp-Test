'use client';

import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { Icon } from '@iconify/react';
import {
  registerProfessorDashboardCharts,
  DASH_CHART_ANIMATION,
  dashChartFont,
} from '@/components/demo/dashboardChartsRegister';
import {
  getCohortKpis,
  getCompletionsTimeSeries,
  getCompletionsBySimulation,
  getOutcomePathMix,
  getCohortSkillRadar,
} from '@/lib/demo/professorCohortMock';
import { fadeInUp, staggerChildren } from '@/lib/utils/animations';

let chartsRegistered = false;

function ensureChartsRegistered() {
  if (!chartsRegistered && typeof window !== 'undefined') {
    registerProfessorDashboardCharts();
    chartsRegistered = true;
  }
}

const GRID = 'rgba(6, 64, 43, 0.12)';
const TICK = '#06402B';

function AnimatedStat({ value, suffix = '', decimals }: { value: number; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (decimals !== undefined) {
          setDisplay(Number(v.toFixed(decimals)));
        } else {
          setDisplay(Math.round(v));
        }
      },
    });
    return () => controls.stop();
  }, [value, decimals]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function ChartCard({
  title,
  subtitle,
  icon,
  delay,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  icon: string;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border-2 p-5 md:p-6 ${className}`}
      style={{
        backgroundColor: '#FFFFE3',
        borderColor: '#06402B',
        boxShadow: '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B',
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border-2 flex-shrink-0"
          style={{ backgroundColor: '#FFFF94', borderColor: '#06402B' }}
        >
          <Icon icon={icon} className="w-5 h-5" style={{ color: '#06402B' }} />
        </div>
        <div>
          <h3
            className="text-lg font-bold uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-sm mt-0.5"
              style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500, opacity: 0.85 }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default function ProfessorAnalyticsDashboard() {
  ensureChartsRegistered();

  const kpis = getCohortKpis();
  const timeSeries = getCompletionsTimeSeries();
  const bySim = getCompletionsBySimulation();
  const outcomeMix = getOutcomePathMix();
  const radarScores = getCohortSkillRadar();

  const lineData = {
    labels: timeSeries.map((p) => p.label),
    datasets: [
      {
        label: 'Completions',
        data: timeSeries.map((p) => p.completions),
        borderColor: '#06402B',
        backgroundColor: 'rgba(6, 64, 43, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#82EDA6',
        pointBorderColor: '#06402B',
        pointBorderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: bySim.map((r) => (r.title.length > 22 ? `${r.title.slice(0, 20)}…` : r.title)),
    datasets: [
      {
        label: 'Completions',
        data: bySim.map((r) => r.completions),
        backgroundColor: ['#06402B', '#03594D', '#0d5c3d', '#82EDA6'].slice(0, bySim.length),
        borderColor: '#06402B',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: outcomeMix.map((s) => s.label),
    datasets: [
      {
        data: outcomeMix.map((s) => s.value),
        backgroundColor: outcomeMix.map((s) => s.color),
        borderColor: '#06402B',
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const radarData = {
    labels: radarScores.map((r) => r.label),
    datasets: [
      {
        label: 'Class average',
        data: radarScores.map((r) => r.value),
        borderColor: '#06402B',
        backgroundColor: 'rgba(130, 237, 166, 0.35)',
        borderWidth: 2,
        pointBackgroundColor: '#82EDA6',
        pointBorderColor: '#06402B',
        pointHoverBackgroundColor: '#FFFF94',
        pointRadius: 4,
      },
    ],
  };

  const commonScaleOpts = {
    grid: { color: GRID },
    ticks: { color: TICK, font: dashChartFont },
    border: { color: GRID },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: DASH_CHART_ANIMATION,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#FFFF94',
        titleColor: '#06402B',
        bodyColor: '#06402B',
        borderColor: '#06402B',
        borderWidth: 2,
        titleFont: dashChartFont,
        bodyFont: dashChartFont,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ...commonScaleOpts,
      },
      x: {
        grid: { display: false },
        ticks: { color: TICK, font: dashChartFont, maxRotation: 45 },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    animation: DASH_CHART_ANIMATION,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#FFFF94',
        titleColor: '#06402B',
        bodyColor: '#06402B',
        borderColor: '#06402B',
        borderWidth: 2,
        titleFont: dashChartFont,
        bodyFont: dashChartFont,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ...commonScaleOpts,
      },
      y: {
        grid: { display: false },
        ticks: { color: TICK, font: { ...dashChartFont, size: 11 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: DASH_CHART_ANIMATION,
    cutout: '58%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: TICK,
          font: dashChartFont,
          padding: 14,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#FFFF94',
        titleColor: '#06402B',
        bodyColor: '#06402B',
        borderColor: '#06402B',
        borderWidth: 2,
        titleFont: dashChartFont,
        bodyFont: dashChartFont,
        callbacks: {
          label: (ctx: { label?: string; parsed: number }) => {
            const v = ctx.parsed;
            return `${ctx.label ?? ''}: ${v}%`;
          },
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: DASH_CHART_ANIMATION,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#FFFF94',
        titleColor: '#06402B',
        bodyColor: '#06402B',
        borderColor: '#06402B',
        borderWidth: 2,
        titleFont: dashChartFont,
        bodyFont: dashChartFont,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: TICK,
          font: dashChartFont,
          backdropColor: 'transparent',
        },
        grid: { color: GRID },
        pointLabels: {
          color: TICK,
          font: { ...dashChartFont, size: 11 },
        },
        angleLines: { color: GRID },
      },
    },
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'Total completions',
            value: kpis.totalCompletions,
            icon: 'solar:check-circle-bold',
            decimals: undefined as number | undefined,
            suffix: '',
          },
          {
            label: 'Completion rate',
            value: kpis.completionRatePercent,
            icon: 'solar:graph-up-bold',
            decimals: undefined,
            suffix: '%',
          },
          {
            label: 'Avg decisions / run',
            value: kpis.avgDecisionsPerRun,
            icon: 'solar:route-bold',
            decimals: 1,
            suffix: '',
          },
          {
            label: 'Simulations live',
            value: kpis.activeSimulationsCount,
            icon: 'solar:widget-5-bold',
            decimals: undefined,
            suffix: '',
          },
        ].map((k) => (
          <motion.div
            key={k.label}
            variants={fadeInUp}
            className="rounded-xl border-2 p-4 md:p-5"
            style={{
              backgroundColor: '#FFFF94',
              borderColor: '#06402B',
              boxShadow: '3px 3px 0px 0px #03594D',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon icon={k.icon} className="w-5 h-5 flex-shrink-0" style={{ color: '#06402B' }} />
              <span
                className="text-xs md:text-sm font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}
              >
                {k.label}
              </span>
            </div>
            <div
              className="text-2xl md:text-3xl font-bold tabular-nums"
              style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}
            >
              <AnimatedStat value={k.value} decimals={k.decimals} suffix={k.suffix} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Activity trend"
          subtitle="Session completions over the last two weeks (demo)"
          icon="solar:chart-2-bold"
          delay={0.08}
        >
          <div className="h-72">
            <Line data={lineData} options={lineOptions as object} />
          </div>
        </ChartCard>

        <ChartCard
          title="By simulation"
          subtitle="Where students are spending time"
          icon="solar:layers-bold"
          delay={0.14}
        >
          <div className="h-72 min-h-[280px]">
            <Bar data={barData} options={barOptions as object} />
          </div>
        </ChartCard>

        <ChartCard
          title="Outcome styles"
          subtitle="How cohorts cluster on paths (synthetic rubric)"
          icon="solar:pie-chart-2-bold"
          delay={0.2}
        >
          <div className="h-72 flex items-center justify-center">
            <div className="w-full max-w-[340px] h-full">
              <Doughnut data={doughnutData} options={doughnutOptions as object} />
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Skills radar"
          subtitle="Aggregated discussion-readiness (demo scores)"
          icon="solar:radar-2-bold"
          delay={0.26}
        >
          <div className="h-72">
            <Radar data={radarData} options={radarOptions as object} />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
