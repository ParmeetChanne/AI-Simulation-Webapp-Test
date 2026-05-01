'use client';

import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import IPhoneMockup from '@/components/demo/IPhoneMockup';
import DemoSwipeCard from '@/components/demo/DemoSwipeCard';
import { fadeInUp, staggerChildren } from '@/lib/utils/animations';

type Phase = 'idle' | 'generating' | 'ready';

const STAGES = [
  { id: 'parse', label: 'Parsing slides', icon: 'solar:document-text-bold' },
  { id: 'concepts', label: 'Extracting concepts', icon: 'solar:lightbulb-bolt-bold' },
  { id: 'scenarios', label: 'Generating scenarios', icon: 'solar:magic-stick-3-bold' },
] as const;

const STAGE_DURATION_MS = 1200;
const ACCEPTED_TYPES = '.pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAllowedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.pdf') || name.endsWith('.ppt') || name.endsWith('.pptx');
}

export default function ProfDemoPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stage, setStage] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const next = Array.from(incoming).filter(isAllowedFile);
    if (next.length === 0) return;
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => `${f.name}:${f.size}`));
      const merged = [...prev];
      for (const f of next) {
        const key = `${f.name}:${f.size}`;
        if (!seen.has(key)) {
          merged.push(f);
          seen.add(key);
        }
      }
      return merged;
    });
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startGenerating = () => {
    if (files.length === 0 || phase === 'generating') return;
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    setPhase('generating');
    setStage(0);

    for (let i = 1; i <= STAGES.length; i++) {
      const t = setTimeout(() => setStage(i), STAGE_DURATION_MS * i);
      timersRef.current.push(t);
    }

    const done = setTimeout(() => {
      setPhase('ready');
    }, STAGE_DURATION_MS * STAGES.length + 300);
    timersRef.current.push(done);
  };

  const reset = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setFiles([]);
    setStage(0);
    setPhase('idle');
  };

  const isGenerating = phase === 'generating';
  const isReady = phase === 'ready';
  const canGenerate = files.length > 0 && !isGenerating;

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: '#FFFFE3' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center transition-colors mb-4"
            style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Icon icon="solar:arrow-left-bold" className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </button>

          <h1
            className="text-3xl md:text-5xl font-bold uppercase mb-2"
            style={{
              fontFamily: 'var(--font-luckiest-guy)',
              color: '#06402B',
              letterSpacing: '0.03em',
            }}
          >
            Professor Studio
          </h1>
          <p
            className="text-base md:text-lg"
            style={{
              fontFamily: 'var(--font-inter)',
              color: '#06402B',
              fontWeight: 500,
              letterSpacing: '-0.04em',
            }}
          >
            Upload your lecture slides and we&apos;ll spin them into a playable simulation your students can run on their phones.
          </p>
        </motion.div>

        {/* 80 / 20 split */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Upload (80%) */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="lg:basis-4/5 lg:flex-grow"
          >
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl border-2 p-6 md:p-8"
              style={{
                backgroundColor: '#FFFF94',
                borderColor: '#06402B',
                boxShadow: '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B',
              }}
            >
              <div className="mb-6">
                <h2
                  className="text-2xl md:text-3xl font-bold uppercase mb-1"
                  style={{
                    fontFamily: 'var(--font-luckiest-guy)',
                    color: '#06402B',
                    letterSpacing: '0.03em',
                  }}
                >
                  Upload Lecture Slides
                </h2>
                <p
                  className="text-sm md:text-base"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    color: '#06402B',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                  }}
                >
                  PDF, PPT, or PPTX. We&apos;ll generate a swipe-style demo simulation from the contents.
                </p>
              </div>

              <label
                htmlFor="prof-upload-input"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                className="block rounded-xl border-2 border-dashed p-8 md:p-12 text-center cursor-pointer transition-all"
                style={{
                  borderColor: '#06402B',
                  backgroundColor: isDragging ? '#82EDA6' : '#FFFFE3',
                  transform: isDragging ? 'translateY(-2px)' : 'none',
                }}
              >
                <input
                  id="prof-upload-input"
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED_TYPES}
                  multiple
                  onChange={handleFileInput}
                  className="sr-only"
                />
                <motion.div
                  animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                    style={{ backgroundColor: '#FFFF94', borderColor: '#06402B' }}
                  >
                    <Icon icon="solar:cloud-upload-bold" className="w-9 h-9" style={{ color: '#06402B' }} />
                  </div>
                  <div>
                    <p
                      className="text-lg md:text-xl font-bold uppercase"
                      style={{
                        fontFamily: 'var(--font-luckiest-guy)',
                        color: '#06402B',
                        letterSpacing: '0.03em',
                      }}
                    >
                      Drag &amp; drop or click to browse
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        color: '#06402B',
                        fontWeight: 500,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      Accepted: .pdf, .ppt, .pptx
                    </p>
                  </div>
                </motion.div>
              </label>

              {/* File list */}
              <AnimatePresence initial={false}>
                {files.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-2"
                  >
                    {files.map((file, i) => (
                      <motion.li
                        key={`${file.name}-${file.size}-${i}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="flex items-center justify-between rounded-lg border-2 px-4 py-3"
                        style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            icon={
                              file.name.toLowerCase().endsWith('.pdf')
                                ? 'solar:document-text-bold'
                                : 'solar:slider-vertical-bold'
                            }
                            className="w-6 h-6 flex-shrink-0"
                            style={{ color: '#06402B' }}
                          />
                          <div className="min-w-0">
                            <p
                              className="font-semibold truncate"
                              style={{
                                fontFamily: 'var(--font-inter)',
                                color: '#06402B',
                                letterSpacing: '-0.03em',
                              }}
                            >
                              {file.name}
                            </p>
                            <p
                              className="text-xs"
                              style={{
                                fontFamily: 'var(--font-inter)',
                                color: '#06402B',
                                opacity: 0.7,
                              }}
                            >
                              {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          disabled={isGenerating}
                          aria-label={`Remove ${file.name}`}
                          className="ml-3 flex-shrink-0 rounded-full p-1 transition-opacity"
                          style={{
                            color: '#06402B',
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            opacity: isGenerating ? 0.4 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isGenerating) e.currentTarget.style.opacity = '0.6';
                          }}
                          onMouseLeave={(e) => {
                            if (!isGenerating) e.currentTarget.style.opacity = '1';
                          }}
                        >
                          <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              {/* Action row */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p
                  className="text-sm"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    color: '#06402B',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    opacity: 0.85,
                  }}
                >
                  {files.length === 0
                    ? 'Add at least one file to enable generation.'
                    : `${files.length} file${files.length === 1 ? '' : 's'} ready.`}
                </p>
                <div className="flex items-center gap-3">
                  {(isReady || files.length > 0) && (
                    <button
                      onClick={reset}
                      disabled={isGenerating}
                      className="px-5 py-3 text-sm font-bold uppercase rounded-full border-2 transition-opacity"
                      style={{
                        backgroundColor: '#FFFFE3',
                        borderColor: '#06402B',
                        color: '#06402B',
                        fontFamily: 'var(--font-inter)',
                        letterSpacing: '0.03em',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        opacity: isGenerating ? 0.5 : 1,
                      }}
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={startGenerating}
                    disabled={!canGenerate}
                    className="px-7 py-3 text-base cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 700,
                      backgroundColor: canGenerate ? '#82EDA6' : '#cfead6',
                      color: '#06402B',
                      letterSpacing: '-0.04em',
                      boxShadow: canGenerate
                        ? '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B'
                        : '0px 0px 0px 2px #06402B',
                      border: 'none',
                      borderRadius: '9999px',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                      cursor: canGenerate ? 'pointer' : 'not-allowed',
                    }}
                    onMouseEnter={(e) => {
                      if (!canGenerate) return;
                      e.currentTarget.style.boxShadow =
                        '3px 3px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                      e.currentTarget.style.transform = 'translate(1px, 1px)';
                    }}
                    onMouseLeave={(e) => {
                      if (!canGenerate) return;
                      e.currentTarget.style.boxShadow =
                        '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                      e.currentTarget.style.transform = 'translate(0px, 0px)';
                    }}
                  >
                    <Icon icon="solar:magic-stick-3-bold" className="w-5 h-5 inline mr-2" />
                    {isGenerating ? 'Generating...' : isReady ? 'Regenerate' : 'Generate Simulation'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Right: iPhone mockup (20%) */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:basis-1/5 lg:flex-shrink-0 flex justify-center lg:justify-center"
          >
            <div className="w-full max-w-[280px] flex flex-col items-center gap-3">
              <IPhoneMockup>
                <AnimatePresence mode="wait">
                  {phase === 'idle' && <IdleScreen key="idle" />}
                  {phase === 'generating' && (
                    <GeneratingScreen key="generating" stage={stage} />
                  )}
                  {phase === 'ready' && <DemoSwipeCard key="ready" />}
                </AnimatePresence>
              </IPhoneMockup>
              <p
                className="text-xs text-center"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: '#06402B',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  opacity: 0.7,
                }}
              >
                Live student preview
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

function IdleScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full flex flex-col items-center justify-center text-center px-4 gap-3"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center border-2"
        style={{ backgroundColor: '#FFFF94', borderColor: '#06402B' }}
      >
        <Icon icon="solar:cloud-upload-bold" className="w-7 h-7" style={{ color: '#06402B' }} />
      </div>
      <p
        className="text-[11px] font-bold uppercase"
        style={{
          fontFamily: 'var(--font-luckiest-guy)',
          color: '#06402B',
          letterSpacing: '0.04em',
        }}
      >
        Awaiting Slides
      </p>
      <p
        className="text-[9px] leading-snug"
        style={{
          fontFamily: 'var(--font-inter)',
          color: '#06402B',
          fontWeight: 500,
        }}
      >
        Drop a deck on the left to spin up a demo.
      </p>
    </motion.div>
  );
}

interface GeneratingScreenProps {
  stage: number;
}

function GeneratingScreen({ stage }: GeneratingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full flex flex-col items-center justify-center text-center px-3 gap-3"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1.4 }}
        className="w-12 h-12 rounded-full flex items-center justify-center border-2"
        style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}
      >
        <Icon icon="solar:refresh-bold" className="w-6 h-6" style={{ color: '#06402B' }} />
      </motion.div>
      <p
        className="text-[11px] font-bold uppercase"
        style={{
          fontFamily: 'var(--font-luckiest-guy)',
          color: '#06402B',
          letterSpacing: '0.04em',
        }}
      >
        Generating Simulation
      </p>

      <ul className="w-full space-y-1.5 mt-1">
        {STAGES.map((s, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <li key={s.id} className="flex items-center gap-2 text-left">
              <span
                className="w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor: done ? '#82EDA6' : 'transparent',
                  borderColor: '#06402B',
                  opacity: done || active ? 1 : 0.5,
                }}
              >
                {done ? (
                  <Icon icon="solar:check-bold" className="w-3 h-3" style={{ color: '#06402B' }} />
                ) : active ? (
                  <motion.span
                    animate={{ scale: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                    className="block rounded-full"
                    style={{ width: '6px', height: '6px', backgroundColor: '#06402B' }}
                  />
                ) : null}
              </span>
              <span
                className="text-[9px] font-semibold"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: '#06402B',
                  opacity: done || active ? 1 : 0.5,
                  letterSpacing: '-0.02em',
                }}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
