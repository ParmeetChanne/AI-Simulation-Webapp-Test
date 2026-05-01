'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { Icon } from '@iconify/react';
import { DemoSwipeCelebration, DemoSwipeHero, type DemoSwipeVisualVariant } from '@/components/demo/DemoSwipeAnimations';

type Pick = 'accept' | 'reject';

interface Scenario {
  title: string;
  event: string;
  acceptLabel: string;
  rejectLabel: string;
  acceptFeedback: string;
  rejectFeedback: string;
  acceptHeadline: string;
  rejectHeadline: string;
}

const SCENARIOS: Scenario[] = [
  {
    title: 'Lecture Demo - Round 1',
    event:
      'A new competitor cuts coffee prices by 15% near campus. Match their price?',
    acceptLabel: 'Match the price cut',
    rejectLabel: 'Hold prices, lean on quality',
    acceptFeedback:
      'Nice - you defended market share, but margins dipped this week.',
    rejectFeedback:
      'Bold call - margins held, but foot traffic dropped 12% near campus.',
    acceptHeadline: 'You matched',
    rejectHeadline: 'You held',
  },
  {
    title: 'Lecture Demo - Round 2',
    event:
      'Morning rush lines are out the door. Hire a second barista for peak hours?',
    acceptLabel: 'Hire for peak shifts',
    rejectLabel: 'Keep the current crew',
    acceptFeedback:
      'Lines move faster and reviews improve—labor cost is up about 8%.',
    rejectFeedback:
      'Margins look solid, but wait-time complaints are trending on social.',
    acceptHeadline: 'You staffed up',
    rejectHeadline: 'You stayed lean',
  },
  {
    title: 'Lecture Demo - Round 3',
    event:
      'A food-delivery app wants 28% commission on every order. Join the platform?',
    acceptLabel: 'Sign up and go live',
    rejectLabel: 'Stay walk-in only',
    acceptFeedback:
      'Order volume jumped—kitchen is slammed and the cut hurts net revenue.',
    rejectFeedback:
      'You kept more per cup, but nearby shops on the app are stealing dinner traffic.',
    acceptHeadline: 'You went online',
    rejectHeadline: 'You stayed off-app',
  },
  {
    title: 'Lecture Demo - Round 4',
    event:
      'Beans and cups cost more this quarter. Raise drink prices by $0.50 across the menu?',
    acceptLabel: 'Raise prices now',
    rejectLabel: 'Absorb costs for now',
    acceptFeedback:
      'Per-unit margin recovered—some regulars grumble but sales held steady.',
    rejectFeedback:
      'Customers love the old prices, but your margin squeezed for another month.',
    acceptHeadline: 'You raised prices',
    rejectHeadline: 'You held prices',
  },
];

const SWIPE_THRESHOLD = 60;

export default function DemoSwipeCard() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [pick, setPick] = useState<Pick | null>(null);

  const scenario = SCENARIOS[scenarioIndex]!;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-120, 120], [-12, 12]);
  const acceptOpacity = useTransform(x, [20, 80], [0, 1]);
  const rejectOpacity = useTransform(x, [-80, -20], [1, 0]);

  useEffect(() => {
    setPick(null);
    x.set(0);
  }, [scenarioIndex]);

  const handlePick = (choice: Pick) => {
    if (pick) return;
    setPick(choice);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (pick) return;
    const offset = info.offset.x;
    if (offset > SWIPE_THRESHOLD) {
      handlePick('accept');
    } else if (offset < -SWIPE_THRESHOLD) {
      handlePick('reject');
    } else {
      x.set(0);
    }
  };

  const handleReset = () => {
    setPick(null);
    x.set(0);
  };

  const handleNextScenario = () => {
    setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
  };

  const feedback =
    pick === 'accept'
      ? scenario.acceptFeedback
      : pick === 'reject'
        ? scenario.rejectFeedback
        : null;

  const resultHeadline =
    pick === 'accept'
      ? scenario.acceptHeadline
      : pick === 'reject'
        ? scenario.rejectHeadline
        : '';

  const visualVariant = scenarioIndex as DemoSwipeVisualVariant;

  return (
    <div className="flex h-full w-full flex-col gap-3 px-3 pb-3 pt-3 md:gap-2 md:px-2.5 md:pb-2 md:pt-2">
      {/* Header pill */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="rounded-full border px-2.5 py-1 text-xs font-bold uppercase md:px-2 md:py-0.5 md:text-[8px]"
          style={{
            borderColor: '#06402B',
            color: '#06402B',
            backgroundColor: '#FFFF94',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.05em',
          }}
        >
          {scenario.title}
          <span className="font-semibold normal-case opacity-80">
            {' '}
            ({scenarioIndex + 1}/{SCENARIOS.length})
          </span>
        </span>
        <span
          className="shrink-0 text-xs font-semibold uppercase md:text-[8px]"
          style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}
        >
          Swipe
          <Icon icon="solar:arrow-left-bold" className="mx-0.5 inline h-3.5 w-3.5 md:h-2.5 md:w-2.5" />
          /
          <Icon icon="solar:arrow-right-bold" className="mx-0.5 inline h-3.5 w-3.5 md:h-2.5 md:w-2.5" />
        </span>
      </div>

      {/* Card area */}
      <div className="relative flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {!pick ? (
            <motion.div
              key={`card-${scenarioIndex}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={handleDragEnd}
              style={{
                x,
                rotate,
                backgroundColor: '#FFFFE3',
                borderColor: '#06402B',
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-0 rounded-xl border-2 shadow-md cursor-grab active:cursor-grabbing overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-[6px_6px_0_0_#03594D,0px_0px_0px_2px_#06402B]"
              whileTap={{ cursor: 'grabbing' }}
            >
              {/* Illustration (~80% of image+prompt column) + swipe overlay labels */}
              <div
                className="relative w-full flex-[4] basis-0 min-h-0 overflow-hidden pointer-events-none select-none"
                style={{ backgroundColor: '#FFFFE3' }}
              >
                <DemoSwipeHero variant={visualVariant} className="absolute inset-0 h-full w-full" />
                <motion.div
                  className="pointer-events-none absolute left-2 top-2 z-10 rounded-full border px-2 py-1 text-xs font-bold uppercase md:left-1.5 md:top-1.5 md:px-1.5 md:py-0.5 md:text-[8px]"
                  style={{
                    opacity: acceptOpacity,
                    backgroundColor: '#82EDA6',
                    borderColor: '#06402B',
                    color: '#06402B',
                  }}
                  aria-hidden
                >
                  Accept
                </motion.div>
                <motion.div
                  className="pointer-events-none absolute right-2 top-2 z-10 rounded-full border px-2 py-1 text-xs font-bold uppercase md:right-1.5 md:top-1.5 md:px-1.5 md:py-0.5 md:text-[8px]"
                  style={{
                    opacity: rejectOpacity,
                    backgroundColor: '#FFFFE3',
                    borderColor: '#06402B',
                    color: '#06402B',
                  }}
                  aria-hidden
                >
                  Reject
                </motion.div>
              </div>

              <div className="flex min-h-0 flex-[1] basis-0 flex-col justify-center overflow-y-auto p-3 md:p-2">
                <p
                  className="text-lg font-semibold leading-snug md:text-[10px]"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    color: '#06402B',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {scenario.event}
                </p>
                <p
                  className="mt-2 shrink-0 text-sm md:mt-1 md:text-[7px]"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    color: '#06402B',
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                >
                  Swipe the card or tap a choice below.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`result-${scenarioIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 rounded-xl border-2 overflow-hidden flex flex-col"
              style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}
            >
              <div
                className="relative w-full flex-[4] basis-0 min-h-0 overflow-hidden pointer-events-none select-none"
                style={{ backgroundColor: '#FFFFE3' }}
              >
                <DemoSwipeCelebration
                  variant={visualVariant}
                  pick={pick}
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="flex min-h-0 flex-[1] basis-0 flex-col gap-2 overflow-y-auto p-3 md:gap-1.5 md:p-2">
                <div className="flex items-center gap-2 md:gap-1.5">
                  <Icon
                    icon={
                      pick === 'accept'
                        ? 'solar:check-circle-bold'
                        : 'solar:close-circle-bold'
                    }
                    className="h-5 w-5 md:h-4 md:w-4"
                    style={{ color: '#06402B' }}
                  />
                  <span
                    className="text-sm font-bold uppercase md:text-[10px]"
                    style={{
                      fontFamily: 'var(--font-luckiest-guy)',
                      color: '#06402B',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {resultHeadline}
                  </span>
                </div>
                <p
                  className="flex-1 text-sm font-semibold leading-snug md:text-[10px]"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    color: '#06402B',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {feedback}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-bold uppercase underline md:text-[9px]"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      color: '#06402B',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="text-xs font-bold uppercase underline md:text-[9px]"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      color: '#06402B',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {scenarioIndex < SCENARIOS.length - 1 ? 'Next scenario' : 'Start over'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 md:gap-1.5">
        <button
          type="button"
          onClick={() => handlePick('reject')}
          disabled={!!pick}
          className="rounded-md border-2 py-2.5 text-xs font-bold uppercase transition-opacity md:py-1 md:text-[9px]"
          style={{
            backgroundColor: '#FFFFE3',
            borderColor: '#06402B',
            color: '#06402B',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.03em',
            opacity: pick && pick !== 'reject' ? 0.4 : 1,
            cursor: pick ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon icon="solar:close-circle-bold" className="mr-1 inline h-4 w-4 md:mr-0.5 md:h-3 md:w-3" />
          Reject
        </button>
        <button
          type="button"
          onClick={() => handlePick('accept')}
          disabled={!!pick}
          className="rounded-md border-2 py-2.5 text-xs font-bold uppercase transition-opacity md:py-1 md:text-[9px]"
          style={{
            backgroundColor: '#82EDA6',
            borderColor: '#06402B',
            color: '#06402B',
            fontFamily: 'var(--font-inter)',
            letterSpacing: '0.03em',
            opacity: pick && pick !== 'accept' ? 0.4 : 1,
            cursor: pick ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon icon="solar:check-circle-bold" className="mr-1 inline h-4 w-4 md:mr-0.5 md:h-3 md:w-3" />
          Accept
        </button>
      </div>

      {/* Option hints */}
      <div
        className="grid grid-cols-2 gap-2 text-xs leading-snug md:gap-1.5 md:text-[7.5px] md:leading-tight"
        style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500 }}
      >
        <span className="text-left">{scenario.rejectLabel}</span>
        <span className="text-right">{scenario.acceptLabel}</span>
      </div>
    </div>
  );
}
