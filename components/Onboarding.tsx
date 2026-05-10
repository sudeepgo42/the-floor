'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GOAL_CONFIG, SKILL_CONFIG, type Goal, type SkillLevel, type UserProfile } from '@/lib/user';

export function Onboarding({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [skill, setSkill] = useState<SkillLevel | null>(null);

  const finish = () => {
    if (!name || !goal || !skill) return;
    onComplete({ name, goal, skill, onboardedAt: new Date().toISOString() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Progress dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: i === step ? 32 : 8, background: i <= step ? '#B47BFF' : '#2A2A38' }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="0" className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet to-electric flex items-center justify-center text-3xl mb-6">
                👋
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight mb-3">
              Welcome to The Floor
            </h1>
            <p className="text-muted text-lg mb-10">
              Let us set you up. First: what do we call you?
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) setStep(1); }}
              placeholder="Your name"
              autoFocus
              className="w-full bg-surface border border-border rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-violet transition-colors"
            />
            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="shine w-full mt-5 bg-text text-bg py-4 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
            >
              Continue →
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="1" className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h1 className="text-4xl font-bold tracking-tight leading-tight mb-3">
              Hey {name}. What brought you here?
            </h1>
            <p className="text-muted mb-8">We will personalise the path.</p>

            <div className="space-y-3 mb-6">
              {(Object.keys(GOAL_CONFIG) as Goal[]).map((g) => {
                const config = GOAL_CONFIG[g];
                const selected = goal === g;
                return (
                  <button key={g} onClick={() => setGoal(g)}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${selected ? 'border-violet bg-violet/10' : 'border-border bg-surface hover:border-text/40'}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{config.emoji}</div>
                      <div>
                        <div className="font-semibold mb-1">{config.label}</div>
                        <div className="text-sm text-muted">{config.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(0)} className="px-5 py-4 rounded-xl border border-border text-muted hover:text-text transition-colors">
                ← Back
              </button>
              <button onClick={() => goal && setStep(2)} disabled={!goal}
                className="shine flex-1 bg-text text-bg py-4 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.01]">
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h1 className="text-4xl font-bold tracking-tight leading-tight mb-3">
              How much have you invested before?
            </h1>
            <p className="text-muted mb-8">Honest answer. We will tune the difficulty.</p>

            <div className="space-y-3 mb-6">
              {(Object.keys(SKILL_CONFIG) as SkillLevel[]).map((s) => {
                const config = SKILL_CONFIG[s];
                const selected = skill === s;
                return (
                  <button key={s} onClick={() => setSkill(s)}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${selected ? 'border-violet bg-violet/10' : 'border-border bg-surface hover:border-text/40'}`}>
                    <div className="font-semibold mb-1">{config.label}</div>
                    <div className="text-sm text-muted">{config.description}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="px-5 py-4 rounded-xl border border-border text-muted hover:text-text transition-colors">
                ← Back
              </button>
              <button onClick={finish} disabled={!skill}
                className="shine flex-1 bg-gradient-to-r from-violet to-electric text-bg py-4 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.01]">
                Start learning →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
