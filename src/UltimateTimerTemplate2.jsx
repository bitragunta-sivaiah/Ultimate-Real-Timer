'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Watch,
  Coffee,
  Clock,
  ThermometerSun,
  ThermometerSnowflake,
  Palette,
  Plus,
  Minus,
  Timer
} from 'lucide-react';

// ==========================================
// 1. CUP GEOMETRY + STEAM ORIGINS
// ==========================================

const CUPS = {
  mug: {
    id: 'mug',
    name: 'Ceramic Mug',
    width: 340,
    mask: 'M25,20 L28,85 Q28,95 38,95 L62,95 Q72,95 72,85 L75,20 Z',
    outline:
      'M23.5,20 L26.5,85 Q26.5,96.5 38,96.5 L62,96.5 Q73.5,96.5 73.5,85 L76.5,20 M75,30 Q92,30 92,45 Q92,60 76,60',
    highlight: 'M28,25 L30,85 Q30,90 35,90 L38,25 Z',
    rim: 'M23.5,20 Q50,14 76.5,20 Q50,26 23.5,20',
    steamOrigin: { x: 50, y: 18 }
  },
  glass: {
    id: 'glass',
    name: 'Double Wall',
    width: 300,
    mask: 'M30,15 L35,85 Q36,95 50,95 Q64,95 65,85 L70,15 Z',
    outline:
      'M28.5,15 L33.5,85 Q34.5,96.5 50,96.5 Q65.5,96.5 66.5,85 L71.5,15',
    highlight: 'M32,20 L36,85 L40,85 L36,20 Z',
    rim: 'M28.5,15 Q50,10 71.5,15 Q50,20 28.5,15',
    steamOrigin: { x: 50, y: 13 }
  },
  teacup: {
    id: 'teacup',
    name: 'Vintage Tea',
    width: 360,
    mask: 'M20,40 Q20,80 50,80 Q80,80 80,40 Z',
    outline:
      'M18.5,40 Q18.5,81.5 50,81.5 Q81.5,81.5 81.5,40 M81.5,45 Q92,45 92,52 Q92,62 80,60 M10,83 L90,83',
    highlight: 'M25,45 Q25,70 35,70 Q40,70 40,45 Z',
    rim: 'M18.5,40 Q50,34 81.5,40 Q50,46 18.5,40',
    steamOrigin: { x: 50, y: 36 }
  },
  beaker: {
    id: 'beaker',
    name: 'Lab Beaker',
    width: 320,
    mask: 'M25,20 L25,85 Q25,95 35,95 L65,95 Q75,95 75,85 L75,20 Z',
    outline:
      'M23.5,20 L23.5,85 Q23.5,96.5 35,96.5 L65,96.5 Q76.5,96.5 76.5,85 L76.5,20 M85,15 L76,20',
    highlight: 'M28,25 L28,85 Q28,90 32,90 L32,25 Z',
    rim: 'M23.5,20 Q50,16 76.5,20 Q50,24 23.5,20',
    steamOrigin: { x: 50, y: 18 }
  },
  wine: {
    id: 'wine',
    name: 'Stem Glass',
    width: 280,
    mask: 'M20,20 Q20,70 50,70 Q80,70 80,20 Z',
    outline:
      'M18.5,20 Q18.5,71.5 50,71.5 Q81.5,71.5 81.5,20 M50,71.5 L50,95 M35,95 L65,95',
    highlight: 'M25,25 Q25,60 35,60 Q40,60 40,25 Z',
    rim: 'M18.5,20 Q50,12 81.5,20 Q50,28 18.5,20',
    steamOrigin: { x: 50, y: 18 }
  }
};

// ==========================================
// 2. VAPOR SYSTEM – SOFT, VOLUMETRIC STEAM
// ==========================================

const SteamBlob = ({
  delay = 0,
  xOffset = 0,
  baseY = 0,
  scale = 1,
  duration = 3.8
}) => (
  <motion.ellipse
    cx={xOffset}
    cy={baseY}
    rx={7 * scale}
    ry={16 * scale}
    fill="white"
    fillOpacity={0.22}
    initial={{ opacity: 0, y: 8, scale: 0.8 * scale }}
    animate={{
      opacity: [0, 0.55, 0.35, 0],
      y: [-4, -26, -42],
      x: [xOffset, xOffset + 3, xOffset - 3, xOffset + 1],
      scale: [0.85 * scale, 1.1 * scale, 1.0 * scale]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: 'easeOut'
    }}
  />
);

const VaporSystem = ({ origin }) => {
  const { x, y } = origin;
  return (
    <g
      transform={`translate(${x}, ${y})`}
      filter="url(#steamBlurStrong)"
      style={{ mixBlendMode: 'screen' }}
    >
      <SteamBlob delay={0.1} xOffset={-4} baseY={4} scale={1.0} duration={3.6} />
      <SteamBlob delay={0.4} xOffset={3} baseY={5} scale={1.1} duration={3.9} />
      <SteamBlob delay={0.7} xOffset={0} baseY={6} scale={1.2} duration={4.1} />
      <SteamBlob delay={1.0} xOffset={-3} baseY={-6} scale={1.0} duration={4.0} />
      <SteamBlob delay={1.3} xOffset={3} baseY={-8} scale={1.0} duration={4.2} />
      <SteamBlob delay={1.6} xOffset={-2} baseY={-18} scale={0.9} duration={4.3} />
      <SteamBlob delay={1.9} xOffset={2} baseY={-20} scale={0.9} duration={4.5} />
    </g>
  );
};

// ==========================================
// 3. LIQUID & RESIDUE RENDERER
// ==========================================

const CoffeeResidue = ({ color }) => (
  <g opacity="0.8">
    <circle cx="40" cy="92" r="4" fill={color} filter="blur(1px)" />
    <circle cx="60" cy="90" r="3" fill={color} filter="blur(1px)" />
    <path
      d="M30,90 Q50,95 70,90"
      stroke={color}
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
  </g>
);

const LiquidFill = ({ percentage, colorHex, maskId }) => {
  const isEmpty = percentage <= 0;
  const yPos = 100 - percentage;

  return (
    <g clipPath={`url(#${maskId})`}>
      {!isEmpty ? (
        <motion.g
          initial={{ y: 100 }}
          animate={{ y: yPos }}
          transition={{ type: 'spring', stiffness: 20, damping: 15 }}
        >
          <rect x="-50" y="0" width="200" height="150" fill={colorHex} />
          <motion.path
            d="M-50,0 Q0,5 50,0 T150,0 V10 H-50 Z"
            fill={colorHex}
            filter="brightness(1.1)"
            animate={{ x: [-50, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          />
          <motion.path
            d="M20,50 Q50,20 80,50"
            stroke="white"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
            filter="blur(2px)"
            animate={{
              d: [
                'M20,50 Q50,20 80,50',
                'M20,50 Q50,80 80,50',
                'M20,50 Q50,20 80,50'
              ]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          />
        </motion.g>
      ) : (
        <CoffeeResidue color={colorHex} />
      )}
    </g>
  );
};

// ==========================================
// 4. MAIN CUP SVG COMPONENT (with safe fallbacks)
// ==========================================

const RealisticCup = ({ shapeId, percentage, colorHex, isActive, temp }) => {
  const rawShape = CUPS[shapeId] || CUPS.mug;

  // SAFE SHAPE: guarantees valid 'd' strings so SVG never sees "undefined"
  const shape = {
    id: 'fallback',
    name: 'Fallback',
    width: 320,
    mask: 'M10,10 L10,90 L90,90 L90,10 Z', // simple rect
    outline: 'M10,10 L10,90 L90,90 L90,10 Z',
    highlight: 'M15,20 L20,85 L30,85 L25,20 Z',
    rim: 'M10,10 L90,10',
    steamOrigin: { x: 50, y: 18 },
    ...rawShape
  };

  const uniqueMaskId = `mask-${shape.id}`;
  const showSteam = temp === 'hot' && isActive && percentage > 0;

  return (
    <div className="relative flex justify-center items-center h-[280px] sm:h-[360px] md:h-[420px]">
      <motion.svg
        key={shape.id}
        width={shape.width}
        height="460"
        viewBox="0 0 100 110"
        className="drop-shadow-[0_0_40px_rgba(0,0,0,0.7)]"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <defs>
          <clipPath id={uniqueMaskId}>
            <path d={shape.mask || 'M0,0'} />
          </clipPath>

          <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.12" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.12" />
          </linearGradient>

          <filter id="steamBlurStrong" x="-50%" y="-80%" width="200%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>

          <radialGradient id="heatGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="60%" stopColor="white" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        {/* back */}
        <path
          d={shape.outline || 'M0,0'}
          fill="black"
          fillOpacity="0.25"
          stroke="none"
        />

        {/* liquid */}
        <LiquidFill
          percentage={percentage}
          colorHex={colorHex}
          maskId={uniqueMaskId}
        />

        {/* front outline */}
        <path
          d={shape.outline || 'M0,0'}
          fill="url(#glassSheen)"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-95"
        />

        {/* highlight */}
        <path
          d={shape.highlight || 'M0,0'}
          fill="white"
          fillOpacity="0.16"
          filter="blur(1px)"
        />

        {/* rim */}
        <path
          d={shape.rim || 'M0,0'}
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity="0.95"
        />
        <path
          d={shape.rim || 'M0,0'}
          fill="white"
          fillOpacity="0.05"
          stroke="none"
        />

        {/* heat glow */}
        {temp === 'hot' && percentage > 0 && (
          <motion.ellipse
            cx="50"
            cy={(shape.steamOrigin?.y || 18) + 2}
            rx="20"
            ry="5"
            fill="url(#heatGlow)"
            initial={{ opacity: 0.18 }}
            animate={{ opacity: [0.1, 0.35, 0.1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* steam */}
        {showSteam && <VaporSystem origin={shape.steamOrigin || { x: 50, y: 18 }} />}
      </motion.svg>
    </div>
  );
};

// ==========================================
// 5. MAIN APP (Timer, Stopwatch, Clock, Pomodoro)
// ==========================================

const COLORS = [
  { name: 'Coffee', hex: '#3f2e22' },
  { name: 'Water', hex: '#60a5fa' },
  { name: 'Matcha', hex: '#65a30d' },
  { name: 'Cocoa', hex: '#5c3a2e' },
  { name: 'Wine', hex: '#881337' }
];

const UltimateRealTimer = () => {
  const [mode, setMode] = useState('timer'); // 'timer' | 'stopwatch' | 'clock' | 'pomodoro'
  const [isActive, setIsActive] = useState(false);
  const [selectedCup, setSelectedCup] = useState('mug');
  const [now, setNow] = useState(new Date());

  // Customization
  const [beverageColor, setBeverageColor] = useState(COLORS[0].hex);
  const [temp, setTemp] = useState('hot'); // 'hot' | 'cold'
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Simple Timer
  const [timeLeft, setTimeLeft] = useState(300);
  const [totalTime, setTotalTime] = useState(300);
  const [elapsed, setElapsed] = useState(0);
  const [brewTime, setBrewTime] = useState(5);

  // Pomodoro State
  const [pomodoroPhase, setPomodoroPhase] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [pomodoroTotal, setPomodoroTotal] = useState(25 * 60);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [cyclesUntilLongBreak, setCyclesUntilLongBreak] = useState(4);
  const [completedFocusCycles, setCompletedFocusCycles] = useState(0);

  // ============================
  // TICK LOGIC
  // ============================
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());

      if (!isActive) return;

      if (mode === 'stopwatch') {
        setElapsed(e => e + 1);
      } else if (mode === 'timer') {
        setTimeLeft(t => {
          if (t <= 0) return 0;
          const next = t - 1;
          if (next === 0) setIsActive(false);
          return next;
        });
      } else if (mode === 'pomodoro') {
        setPomodoroTimeLeft(prev => {
          if (prev <= 0) return 0;
          const next = prev - 1;
          if (next === 0) advancePomodoroPhase();
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    isActive,
    mode,
    pomodoroPhase,
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    cyclesUntilLongBreak
  ]);

  const advancePomodoroPhase = () => {
    setCompletedFocusCycles(currentCycles => {
      let cycles = currentCycles;
      if (pomodoroPhase === 'focus') cycles += 1;

      let nextPhase = 'focus';
      if (pomodoroPhase === 'focus') {
        if (cycles > 0 && cycles % cyclesUntilLongBreak === 0) {
          nextPhase = 'longBreak';
        } else {
          nextPhase = 'shortBreak';
        }
      } else {
        nextPhase = 'focus';
      }

      setPomodoroPhase(nextPhase);

      let nextDurationMinutes = focusMinutes;
      if (nextPhase === 'shortBreak') nextDurationMinutes = shortBreakMinutes;
      if (nextPhase === 'longBreak') nextDurationMinutes = longBreakMinutes;
      const nextSeconds = nextDurationMinutes * 60;
      setPomodoroTotal(nextSeconds);
      setPomodoroTimeLeft(nextSeconds);

      setIsActive(true);
      return cycles;
    });
  };

  // ============================
  // HELPERS
  // ============================
  const getPercentage = () => {
    if (mode === 'clock') return (now.getSeconds() / 60) * 100;
    if (mode === 'stopwatch') return ((elapsed % 60) / 60) * 100;
    if (mode === 'pomodoro') {
      if (pomodoroTotal === 0) return 0;
      return Math.max(0, (pomodoroTimeLeft / pomodoroTotal) * 100);
    }
    if (totalTime === 0) return 0;
    return Math.max(0, (timeLeft / totalTime) * 100);
  };

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleMode = m => {
    setMode(m);
    if (m === 'clock') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }

    if (m === 'timer') {
      const sec = brewTime * 60;
      setTotalTime(sec);
      setTimeLeft(sec);
    }

    if (m === 'stopwatch') {
      setElapsed(0);
    }

    if (m === 'pomodoro') {
      setPomodoroPhase('focus');
      const sec = focusMinutes * 60;
      setPomodoroTotal(sec);
      setPomodoroTimeLeft(sec);
      setCompletedFocusCycles(0);
    }
  };

  const computeAccentColor = () => {
    const hour = now.getHours();
    const isNight = hour < 6 || hour >= 20;

    const warmBase = '#f97316';
    const warmFocus = '#ef4444';
    const coolBase = '#22d3ee';
    const coolFocus = '#3b82f6';
    const breakColor = '#22c55e';

    let accent;

    if (mode === 'pomodoro') {
      accent =
        pomodoroPhase === 'focus'
          ? temp === 'hot'
            ? warmFocus
            : coolFocus
          : breakColor;
    } else if (mode === 'timer') {
      accent = temp === 'hot' ? warmBase : coolBase;
    } else if (mode === 'stopwatch') {
      accent = temp === 'hot' ? '#facc15' : '#38bdf8';
    } else {
      accent = temp === 'hot' ? '#fb923c' : '#67e8f9';
    }

    if (isNight) {
      const darken = (hex, factor = 0.85) => {
        const num = parseInt(hex.replace('#', ''), 16);
        let r = Math.floor(((num >> 16) & 255) * factor);
        let g = Math.floor(((num >> 8) & 255) * factor);
        let b = Math.floor((num & 255) * factor);
        r = Math.max(0, r);
        g = Math.max(0, g);
        b = Math.max(0, b);
        return `#${r.toString(16).padStart(2, '0')}${g
          .toString(16)
          .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };
      accent = darken(accent);
    }

    return accent;
  };

  const accentColor = computeAccentColor();
  const percentage = getPercentage();

  const currentTimeDisplay =
    mode === 'clock'
      ? now.toLocaleTimeString([], {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        })
      : mode === 'stopwatch'
      ? formatTime(elapsed)
      : mode === 'pomodoro'
      ? formatTime(pomodoroTimeLeft)
      : formatTime(timeLeft);

  const currentPomodoroLabel =
    mode === 'pomodoro'
      ? pomodoroPhase === 'focus'
        ? 'Focus'
        : pomodoroPhase === 'shortBreak'
        ? 'Short Break'
        : 'Long Break'
      : '';

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] [background-size:20px_20px]" />
      </div>

      {/* temp overlay */}
      <div
        className={`absolute inset-0 pointer-events-none mix-blend-screen opacity-50 bg-gradient-to-br from-transparent ${
          temp === 'hot'
            ? 'via-orange-500/20 to-red-700/30'
            : 'via-sky-400/20 to-cyan-700/30'
        }`}
      />

      <div className="relative w-full max-w-5xl">
        {/* header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <span className="px-2 py-0.5 rounded bg-slate-900/70 border border-slate-700/70 text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
              DEV · FOCUS
            </span>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Time is just another state; manage it like one.
            </p>
          </div>

          {/* mode switch */}
          <div className="flex bg-slate-900/80 rounded-full p-1 border border-slate-700/60 backdrop-blur">
            {[
              { id: 'timer', icon: Coffee, label: 'Timer' },
              { id: 'pomodoro', icon: Timer, label: 'Pomodoro' },
              { id: 'stopwatch', icon: Watch, label: 'Stopwatch' },
              { id: 'clock', icon: Clock, label: 'Clock' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleMode(m.id)}
                className="px-3 sm:px-4 py-2 rounded-full flex items-center gap-1.5 text-xs sm:text-sm transition-all"
                style={
                  mode === m.id
                    ? {
                        backgroundColor: accentColor,
                        color: '#020617',
                        boxShadow: `0 0 16px ${accentColor}66`
                      }
                    : { color: '#cbd5f5' }
                }
              >
                <m.icon size={16} />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* main layout */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-stretch">
          {/* LEFT: cup + time */}
          <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4 sm:p-6 backdrop-blur flex flex-col gap-4">
            {/* cup + controls */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex flex-col items-center justify-center">
                <RealisticCup
                  shapeId={selectedCup}
                  percentage={percentage}
                  colorHex={beverageColor}
                  isActive={isActive || mode === 'clock' || mode === 'pomodoro'}
                  temp={temp}
                />

                {/* cup selector */}
                <div className="flex justify-center gap-3 -mt-4">
                  {Object.values(CUPS).map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        if (CUPS[c.id]) setSelectedCup(c.id);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border text-[0] transition-all ${
                        selectedCup === c.id
                          ? 'bg-slate-800 border-slate-100'
                          : 'border-slate-700/40 opacity-40 hover:opacity-100'
                      }`}
                    >
                      <svg viewBox="0 0 100 100" className="w-5 h-5 fill-white">
                        <path d={c.mask || 'M0,0'} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* temp + color */}
              <div className="flex flex-col justify-between gap-4 lg:w-32">
                <div className="flex lg:flex-col gap-3 lg:items-stretch items-center justify-center">
                  <button
                    onClick={() =>
                      setTemp(temp === 'hot' ? 'cold' : 'hot')
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-700/70 bg-slate-950/60 flex items-center justify-center gap-2 text-xs sm:text-sm"
                    style={{
                      color: accentColor,
                      boxShadow: `0 0 16px ${accentColor}55`
                    }}
                  >
                    {temp === 'hot' ? (
                      <>
                        <ThermometerSun size={16} />
                        <span>Hot</span>
                      </>
                    ) : (
                      <>
                        <ThermometerSnowflake size={16} />
                        <span>Cold</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-700/70 bg-slate-950/60 flex items-center justify-center gap-2 text-xs sm:text-sm"
                    style={{ color: beverageColor }}
                  >
                    <Palette size={16} />
                    <span className="hidden sm:inline">Liquid</span>
                  </button>
                </div>
              </div>
            </div>

            {/* time display */}
            <div className="text-center">
              <div
                className="text-5xl sm:text-6xl md:text-7xl font-mono font-semibold tracking-tight"
                style={{
                  color: accentColor,
                  textShadow: `0 0 20px ${accentColor}66`
                }}
              >
                {currentTimeDisplay}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-slate-400 flex items-center justify-center gap-2 font-mono">
                <span>
                  {now.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: '2-digit'
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                <span>
                  {now.toLocaleTimeString(undefined, {
                    hour12: true,
                    hour: 'numeric'
                  })}
                </span>
                {mode === 'pomodoro' && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span>{currentPomodoroLabel}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span>{completedFocusCycles} cycles</span>
                  </>
                )}
              </div>
            </div>

            {/* progress */}
            <div className="mt-2">
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.max(0, percentage))}%`,
                    background: `linear-gradient(90deg, ${accentColor}, #22c55e)`
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                <span>
                  progress{' '}
                  <span className="text-slate-300">
                    {Math.round(percentage)
                      .toString()
                      .padStart(2, '0')}
                    %
                  </span>
                </span>
                <span>
                  temp{' '}
                  <span className="text-slate-300">
                    {temp === 'hot' ? '🔥 hot' : '❄️ cold'}
                  </span>
                </span>
              </div>
            </div>

            {/* controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
              <div className="flex-1 flex items-center justify-center sm:justify-start gap-3">
                {mode === 'timer' && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <button
                      onClick={() => {
                        const next = Math.max(1, brewTime - 1);
                        setBrewTime(next);
                        const sec = next * 60;
                        setTotalTime(sec);
                        setTimeLeft(sec);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono text-slate-300">
                      brew: {brewTime}m
                    </span>
                    <button
                      onClick={() => {
                        const next = brewTime + 1;
                        setBrewTime(next);
                        const sec = next * 60;
                        setTotalTime(sec);
                        setTimeLeft(sec);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}

                {mode === 'pomodoro' && (
                  <div className="text-[10px] sm:text-xs text-slate-400 font-mono text-left">
                    <div>
                      focus:{' '}
                      <span className="text-slate-200">{focusMinutes}m</span> ·
                      short:{' '}
                      <span className="text-slate-200">
                        {shortBreakMinutes}m
                      </span>{' '}
                      · long:{' '}
                      <span className="text-slate-200">
                        {longBreakMinutes}m
                      </span>
                    </div>
                    <div>
                      long break every{' '}
                      <span className="text-slate-200">
                        {cyclesUntilLongBreak}
                      </span>{' '}
                      cycles
                    </div>
                  </div>
                )}
              </div>

              {mode !== 'clock' && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-lg"
                    style={{
                      backgroundColor: accentColor,
                      color: '#020617',
                      boxShadow: `0 0 26px ${accentColor}88`
                    }}
                  >
                    {isActive ? (
                      <Pause size={28} />
                    ) : (
                      <Play size={28} className="translate-x-[1px]" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsActive(false);
                      if (mode === 'timer') {
                        const sec = brewTime * 60;
                        setTotalTime(sec);
                        setTimeLeft(sec);
                      } else if (mode === 'stopwatch') {
                        setElapsed(0);
                      } else if (mode === 'pomodoro') {
                        setPomodoroPhase('focus');
                        const sec = focusMinutes * 60;
                        setPomodoroTotal(sec);
                        setPomodoroTimeLeft(sec);
                        setCompletedFocusCycles(0);
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* COLOR PICKER DRAWER */}
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950/70 mt-3"
                >
                  <div className="p-3 flex flex-wrap gap-3 justify-center">
                    {COLORS.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setBeverageColor(c.hex)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs"
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                    <div className="flex items-center gap-2 pl-2 border-l border-slate-700 text-xs text-slate-400">
                      <span>Custom</span>
                      <input
                        type="color"
                        value={beverageColor}
                        onChange={e => setBeverageColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: dev console */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-[0.18em]">
                dev console
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                style={{
                  backgroundColor: `${accentColor}22`,
                  border: `1px solid ${accentColor}77`,
                  color: accentColor
                }}
              >
                mode: {mode}
              </span>
            </div>

            {mode === 'pomodoro' && (
              <div className="space-y-3">
                {[
                  {
                    label: 'focus minutes',
                    value: focusMinutes,
                    setter: setFocusMinutes,
                    min: 5
                  },
                  {
                    label: 'short break',
                    value: shortBreakMinutes,
                    setter: setShortBreakMinutes,
                    min: 1
                  },
                  {
                    label: 'long break',
                    value: longBreakMinutes,
                    setter: setLongBreakMinutes,
                    min: 5
                  }
                ].map(row => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-400">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const next = Math.max(row.min, row.value - 1);
                          row.setter(next);
                        }}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-slate-200 w-6 text-center">
                        {row.value}
                      </span>
                      <button
                        onClick={() => {
                          const next = row.value + 1;
                          row.setter(next);
                        }}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">cycles / long break</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const next = Math.max(2, cyclesUntilLongBreak - 1);
                        setCyclesUntilLongBreak(next);
                      }}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-slate-200 w-6 text-center">
                      {cyclesUntilLongBreak}
                    </span>
                    <button
                      onClick={() => {
                        const next = cyclesUntilLongBreak + 1;
                        setCyclesUntilLongBreak(next);
                      }}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'timer' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">timer minutes</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const next = Math.max(1, brewTime - 1);
                        setBrewTime(next);
                        const sec = next * 60;
                        setTotalTime(sec);
                        setTimeLeft(sec);
                      }}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-slate-200">
                      {brewTime}
                    </span>
                    <button
                      onClick={() => {
                        const next = brewTime + 1;
                        setBrewTime(next);
                        const sec = next * 60;
                        setTotalTime(sec);
                        setTimeLeft(sec);
                      }}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* state dump */}
            <div className="mt-3 text-[10px] sm:text-xs font-mono bg-slate-950 rounded-xl border border-slate-800/80 p-3 overflow-auto max-h-48">
              <div className="text-slate-500 mb-1">state_dump()</div>
              <pre className="text-slate-300 whitespace-pre-wrap">
{`{
  mode: "${mode}",
  active: ${isActive},
  temp: "${temp}",
  pomodoro: {
    phase: "${pomodoroPhase}",
    timeLeft: ${pomodoroTimeLeft}s,
    total: ${pomodoroTotal}s,
    focusMinutes: ${focusMinutes},
    shortBreakMinutes: ${shortBreakMinutes},
    longBreakMinutes: ${longBreakMinutes},
    completedFocusCycles: ${completedFocusCycles},
    cyclesUntilLongBreak: ${cyclesUntilLongBreak}
  },
  timer: {
    timeLeft: ${timeLeft}s,
    totalTime: ${totalTime}s
  },
  stopwatch: {
    elapsed: ${elapsed}s
  }
}`}
              </pre>
            </div>

            <div className="mt-1 text-[10px] text-slate-500 font-mono">
              <span className="text-slate-400">hint:</span> treat your time like
              you treat state – predictable, explicit, and under control.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateRealTimer;
