// src/App.jsx
import React, { useEffect, useState } from 'react';
import UltimateRealTimerTemplate1 from './UltimateTimerTemplate1';
import UltimateRealTimerTemplate2 from './UltimateTimerTemplate2';
import UltimateRealTimerTemplate3 from './UltimateRealTimerTemplate3';

const THEME_STORAGE_KEY = 'ultimate_timer_theme';

const App = () => {
  // "classic" | "developer" | "modern" | null
  const [theme, setTheme] = useState(null);

  // ---- Load saved theme on first mount ----
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'classic' || saved === 'developer' || saved === 'modern') {
        setTheme(saved);
      }
    } catch (err) {
      console.error('Error reading theme from localStorage', err);
    }
  }, []);

  // ---- Persist theme whenever it changes ----
  useEffect(() => {
    if (!theme) return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      console.error('Error writing theme to localStorage', err);
    }
  }, [theme]);

  const handleSelectTheme = (nextTheme) => {
    setTheme(nextTheme);
  };

  const renderCurrentTheme = () => {
    if (theme === 'classic') return <UltimateRealTimerTemplate1 />;
    if (theme === 'developer') return <UltimateRealTimerTemplate2 />;
    if (theme === 'modern') return <UltimateRealTimerTemplate3 />;
    // No theme chosen yet
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-slate-400 mb-4 font-mono">
          Select a theme to start using the timer.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Top bar with theme selector */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-700/70 tracking-[0.25em] uppercase text-slate-400">
              Timer · Themes
            </span>
            {theme && (
              <span className="text-xs text-slate-400 font-mono">
                current: <span className="text-slate-100">{theme}</span>
              </span>
            )}
          </div>

          {/* Theme buttons */}
          <div className="flex bg-slate-900/80 rounded-full p-1 border border-slate-700/70 gap-1">
            <button
              type="button"
              onClick={() => handleSelectTheme('classic')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-mono transition-all ${
                theme === 'classic'
                  ? 'bg-slate-100 text-slate-900 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => handleSelectTheme('developer')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-mono transition-all ${
                theme === 'developer'
                  ? 'bg-slate-100 text-slate-900 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Developer
            </button>
            <button
              type="button"
              onClick={() => handleSelectTheme('modern')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-mono transition-all ${
                theme === 'modern'
                  ? 'bg-slate-100 text-slate-900 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Modern
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-stretch justify-center">
        <div className="w-full">
          {renderCurrentTheme()}
        </div>
      </main>

      {/* Tiny footer hint */}
      <footer className="border-t border-slate-800 py-2 text-center text-[10px] text-slate-500 font-mono">
        theme is stored in <span className="text-slate-300">localStorage["{THEME_STORAGE_KEY}"]</span>
      </footer>
    </div>
  );
};

export default App;
