'use client';

import { motion } from 'framer-motion';

export type Tab = 'home' | 'lessons' | 'simulator' | 'profile';

const TABS: Array<{ id: Tab; label: string; icon: string; activeColor: string }> = [
  { id: 'home', label: 'Home', icon: '🏠', activeColor: '#B47BFF' },
  { id: 'lessons', label: 'Lessons', icon: '📚', activeColor: '#00E676' },
  { id: 'simulator', label: 'Simulator', icon: '🎮', activeColor: '#00D4FF' },
  { id: 'profile', label: 'Profile', icon: '👤', activeColor: '#FFB020' },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <>
      {/* Mobile: bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg/85 backdrop-blur-xl border-t border-border md:hidden">
        <div className="grid grid-cols-4 px-2 py-2 max-w-md mx-auto">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button key={tab.id} onClick={() => onChange(tab.id)}
                className="flex flex-col items-center justify-center gap-1 py-2 relative">
                {isActive && (
                  <motion.div layoutId="bottomNavActiveDot"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ background: tab.activeColor }} />
                )}
                <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>{tab.icon}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${isActive ? 'font-semibold' : 'text-muted'}`}
                  style={{ color: isActive ? tab.activeColor : undefined }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop: side rail */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-20 bg-bg/85 backdrop-blur-xl border-r border-border flex-col items-center py-6 gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-electric flex items-center justify-center font-bold text-bg text-lg mb-4">
          F
        </div>
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button key={tab.id} onClick={() => onChange(tab.id)}
              className="relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all hover:bg-surface group">
              {isActive && (
                <motion.div layoutId="sideNavActive"
                  className="absolute inset-0 rounded-xl border" style={{ borderColor: tab.activeColor, background: `${tab.activeColor}15` }} />
              )}
              <span className={`text-xl relative z-10 transition-transform ${isActive ? 'scale-110' : ''}`}>{tab.icon}</span>
              <span className={`text-[9px] font-mono uppercase tracking-wider relative z-10 transition-colors ${isActive ? 'font-semibold' : 'text-muted'}`}
                style={{ color: isActive ? tab.activeColor : undefined }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
