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
}) => {
  return (
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
};

const VaporSystem = ({ origin }) => {
  const { x, y } = origin;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      filter="url(#steamBlurStrong)"
      style={{ mixBlendMode: 'screen' }}
    >
      {/* Base dense area close to the cup */}
      <SteamBlob delay={0.1} xOffset={-4} baseY={4} scale={1.0} duration={3.6} />
      <SteamBlob delay={0.4} xOffset={3} baseY={5} scale={1.1} duration={3.9} />
      <SteamBlob delay={0.7} xOffset={0} baseY={6} scale={1.2} duration={4.1} />
      {/* Middle column */}
      <SteamBlob delay={1.0} xOffset={-3} baseY={-6} scale={1.0} duration={4.0} />
      <SteamBlob delay={1.3} xOffset={3} baseY={-8} scale={1.0} duration={4.2} />
      {/* Upper wisps */}
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
// 4. MAIN CUP SVG COMPONENT
// ==========================================

const RealisticCup = ({ shapeId, percentage, colorHex, isActive, temp }) => {
  const shape = CUPS[shapeId] || CUPS.mug;
  const uniqueMaskId = `mask-${shape.id}`;
  const showSteam = temp === 'hot' && isActive && percentage > 0;

  return (
    <div className="relative flex justify-center items-center h-[460px]">
      <motion.svg
        key={shapeId}
        width={shape.width}
        height="460"
        viewBox="0 0 100 110"
        className="drop-shadow-2xl z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <defs>
          <clipPath id={uniqueMaskId}>
            <path d={shape.mask} />
          </clipPath>

          <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>

          <filter id="steamBlurStrong" x="-50%" y="-80%" width="200%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>

          <radialGradient id="heatGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="60%" stopColor="white" stopOpacity="0.0" />
          </radialGradient>
        </defs>

        <path d={shape.outline} fill="black" fillOpacity="0.2" stroke="none" />

        <LiquidFill percentage={percentage} colorHex={colorHex} maskId={uniqueMaskId} />

        <path
          d={shape.outline}
          fill="url(#glassSheen)"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90"
        />

        <path d={shape.highlight} fill="white" fillOpacity="0.15" filter="blur(1px)" />

        <path d={shape.rim} fill="none" stroke="white" strokeWidth="1" opacity="0.9" />
        <path d={shape.rim} fill="white" fillOpacity="0.05" stroke="none" />

        {temp === 'hot' && percentage > 0 && (
          <motion.ellipse
            cx="50"
            cy={shape.steamOrigin.y + 2}
            rx="20"
            ry="5"
            fill="url(#heatGlow)"
            initial={{ opacity: 0.18 }}
            animate={{ opacity: [0.1, 0.35, 0.1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {showSteam && <VaporSystem origin={shape.steamOrigin} />}
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

const UltimateRealTimerTemplate3 = () => {
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
          if (t <= 0) {
            return 0;
          }
          const next = t - 1;
          if (next === 0) {
            setIsActive(false);
          }
          return next;
        });
      } else if (mode === 'pomodoro') {
        setPomodoroTimeLeft(prev => {
          if (prev <= 0) return 0;
          const next = prev - 1;
          if (next === 0) {
            advancePomodoroPhase();
          }
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

  // Strong state machine for pomodoro
  const advancePomodoroPhase = () => {
    setCompletedFocusCycles(currentCycles => {
      let cycles = currentCycles;
      if (pomodoroPhase === 'focus') {
        cycles += 1;
      }

      // Decide next phase
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

      // set time for next phase
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

  // Accent color based on temp + mode + pomodoro phase + day/night
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
      if (pomodoroPhase === 'focus') {
        accent = temp === 'hot' ? warmFocus : coolFocus;
      } else {
        accent = breakColor;
      }
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white font-sans p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0 pointer-events-none" />
      <div
        className={`absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent ${
          temp === 'hot' ? 'to-orange-900/50' : 'to-cyan-900/50'
        } z-0 transition-colors duration-1000`}
      />

      <div className="w-full max-w-xl z-10">
        {/* TOP BAR: Mode + Customization */}
        <div className="flex justify-between items-center mb-6">
          {/* Mode Switcher */}
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            {[
              { id: 'timer', icon: Coffee, label: 'Timer' },
              { id: 'pomodoro', icon: Timer, label: 'Pomodoro' },
              { id: 'stopwatch', icon: Watch, label: 'Stopwatch' },
              { id: 'clock', icon: Clock, label: 'Clock' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleMode(m.id)}
                className="p-3 rounded-full transition-all flex items-center justify-center"
                style={
                  mode === m.id
                    ? {
                        backgroundColor: accentColor,
                        color: '#020617',
                        boxShadow: `0 0 20px ${accentColor}40`
                      }
                    : {}
                }
              >
                <m.icon size={18} />
              </button>
            ))}
          </div>

          {/* Beverage / Temp Customizer */}
          <div className="flex gap-2">
            <button
              onClick={() => setTemp(temp === 'hot' ? 'cold' : 'hot')}
              className="p-3 rounded-full border border-white/10 transition-colors"
              style={{
                backgroundColor: temp === 'hot' ? '#f9731640' : '#22d3ee40',
                color: accentColor,
                boxShadow: `0 0 18px ${accentColor}40`
              }}
            >
              {temp === 'hot' ? (
                <ThermometerSun size={18} />
              ) : (
                <ThermometerSnowflake size={18} />
              )}
            </button>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
              style={{ color: beverageColor }}
            >
              <Palette size={18} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* COLOR PICKER DRAWER */}
        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4 bg-black/40 rounded-xl border border-white/5"
            >
              <div className="p-4 flex flex-wrap gap-3 justify-center">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setBeverageColor(c.hex)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs">{c.name}</span>
                  </button>
                ))}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
                  <span className="text-xs text-white/50">Custom:</span>
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

        {/* CUP SELECTOR */}
        <div className="flex justify-center gap-4 mb-2">
          {Object.values(CUPS).map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCup(c.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                selectedCup === c.id
                  ? 'bg-white/10 border-white'
                  : 'border-transparent opacity-30 hover:opacity-100'
              }`}
            >
              <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
                <path d={c.mask} />
              </svg>
            </button>
          ))}
        </div>

        {/* MAIN VISUAL */}
        <RealisticCup
          shapeId={selectedCup}
          percentage={getPercentage()}
          colorHex={beverageColor}
          isActive={isActive || mode === 'clock' || mode === 'pomodoro'}
          temp={temp}
        />

        {/* DIGITAL DISPLAY + CONTROLS */}
        <div className="text-center -mt-16 relative z-20">
          {/* Time display */}
          <div
            className="text-7xl font-mono font-bold tracking-tighter drop-shadow-lg"
            style={{
              color: accentColor,
              textShadow: `0 0 18px ${accentColor}55`
            }}
          >
            {currentTimeDisplay}
          </div>

          {/* Secondary info: date + pomodoro label */}
          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40 flex items-center justify-center gap-3">
            <span>
              {now.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: '2-digit'
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>
              {now.toLocaleTimeString(undefined, {
                hour12: true,
                hour: 'numeric'
              })}
            </span>
            {mode === 'pomodoro' && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{currentPomodoroLabel}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{completedFocusCycles} cycles</span>
              </>
            )}
          </div>

          {/* Timer controls (simple timer) */}
          {mode === 'timer' && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  const next = Math.max(1, brewTime - 1);
                  setBrewTime(next);
                  const sec = next * 60;
                  setTimeLeft(sec);
                  setTotalTime(sec);
                }}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <Minus size={20} />
              </button>
              <span className="text-xl font-bold text-white/50">
                {brewTime} min
              </span>
              <button
                onClick={() => {
                  const next = brewTime + 1;
                  setBrewTime(next);
                  const sec = next * 60;
                  setTimeLeft(sec);
                  setTotalTime(sec);
                }}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
          )}

          {/* Pomodoro settings */}
          {mode === 'pomodoro' && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/60">Focus</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = Math.max(5, focusMinutes - 1);
                      setFocusMinutes(next);
                      if (!isActive && pomodoroPhase === 'focus') {
                        const sec = next * 60;
                        setPomodoroTotal(sec);
                        setPomodoroTimeLeft(sec);
                      }
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span>{focusMinutes}m</span>
                  <button
                    onClick={() => {
                      const next = focusMinutes + 1;
                      setFocusMinutes(next);
                      if (!isActive && pomodoroPhase === 'focus') {
                        const sec = next * 60;
                        setPomodoroTotal(sec);
                        setPomodoroTimeLeft(sec);
                      }
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/60">Short break</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = Math.max(1, shortBreakMinutes - 1);
                      setShortBreakMinutes(next);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span>{shortBreakMinutes}m</span>
                  <button
                    onClick={() => {
                      const next = shortBreakMinutes + 1;
                      setShortBreakMinutes(next);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/60">Long break</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = Math.max(5, longBreakMinutes - 1);
                      setLongBreakMinutes(next);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span>{longBreakMinutes}m</span>
                  <button
                    onClick={() => {
                      const next = longBreakMinutes + 1;
                      setLongBreakMinutes(next);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/60">Cycles / long</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = Math.max(2, cyclesUntilLongBreak - 1);
                      setCyclesUntilLongBreak(next);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span>{cyclesUntilLongBreak}</span>
                  <button
                    onClick={() => {
                      const next = cyclesUntilLongBreak + 1;
                      setCyclesUntilLongBreak(next);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Play / Reset for all non-clock modes */}
          {mode !== 'clock' && (
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={() => setIsActive(!isActive)}
                className="w-20 h-20 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                style={{
                  backgroundColor: accentColor,
                  color: '#020617',
                  boxShadow: `0 0 28px ${accentColor}70`
                }}
              >
                {isActive ? (
                  <Pause fill="currentColor" size={32} />
                ) : (
                  <Play fill="currentColor" size={32} className="ml-1" />
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
                className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UltimateRealTimerTemplate3;
