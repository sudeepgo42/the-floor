'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GOAL_CONFIG, SKILL_CONFIG, type Goal, type SkillLevel, type UserState } from '@/lib/user';
import { lessons } from '@/lib/lessons';
import { scenarios, getLevelFromXP, LEVELS } from '@/lib/scenarios';

export function Profile({
  user, onUpdateProfile, onReset,
}: {
  user: UserState;
  onUpdateProfile: (updates: Partial<{ name: string; goal: Goal; skill: SkillLevel }>) => void;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.profile?.name ?? '');
  const [goal, setGoal] = useState<Goal>(user.profile?.goal ?? 'first-portfolio');
  const [skill, setSkill] = useState<SkillLevel>(user.profile?.skill ?? 'never');

  const levelInfo = getLevelFromXP(user.xp);
  const lessonsTotal = lessons.length;
  const scenariosTotal = scenarios.length;

  const saveEdits = () => {
    onUpdateProfile({ name, goal, skill });
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold"
            style={{ background: `linear-gradient(135deg, ${levelInfo.current.color}, #00D4FF)` }}>
            {(user.profile?.name?.[0] ?? 'F').toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.profile?.name ?? 'Anonymous'}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: levelInfo.current.color, color: '#0A0A0F' }}>
                LV.{levelInfo.current.level} {levelInfo.current.name}
              </span>
              <span className="text-xs text-muted font-mono">
                joined {user.profile ? formatDate(user.profile.onboardedAt) : '—'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => setEditing(!editing)}
          className="text-sm text-muted hover:text-text transition-colors px-4 py-2 rounded-lg border border-border bg-surface">
          {editing ? 'Cancel' : 'Edit profile'}
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-surface border border-border rounded-2xl p-6 mb-8 overflow-hidden">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-elevated border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-violet transition-colors" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">Goal</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(Object.keys(GOAL_CONFIG) as Goal[]).map((g) => (
                  <button key={g} onClick={() => setGoal(g)}
                    className={`p-3 rounded-lg border text-left transition-all ${goal === g ? 'border-violet bg-violet/10' : 'border-border bg-elevated hover:border-text/40'}`}>
                    <div className="text-xl mb-1">{GOAL_CONFIG[g].emoji}</div>
                    <div className="text-sm font-semibold">{GOAL_CONFIG[g].label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted mb-2 block">Skill level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(Object.keys(SKILL_CONFIG) as SkillLevel[]).map((s) => (
                  <button key={s} onClick={() => setSkill(s)}
                    className={`p-3 rounded-lg border text-left transition-all ${skill === s ? 'border-violet bg-violet/10' : 'border-border bg-elevated hover:border-text/40'}`}>
                    <div className="text-sm font-semibold">{SKILL_CONFIG[s].label}</div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={saveEdits}
              className="shine w-full bg-text text-bg py-3 rounded-xl font-semibold transition-all hover:scale-[1.01]">
              Save changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total XP" value={user.xp.toLocaleString()} color="#00D4FF" icon="⚡" />
        <StatCard label="Day streak" value={`${user.streak}`} color="#FFB020" icon="🔥" />
        <StatCard label="Lessons" value={`${user.completedLessons.length}/${lessonsTotal}`} color="#00E676" icon="📚" />
        <StatCard label="Scenarios" value={`${user.completedScenarios.length}/${scenariosTotal}`} color="#B47BFF" icon="🎮" />
      </div>

      {/* Level progress */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Current Level</div>
            <div className="text-2xl font-bold">{levelInfo.current.name}</div>
          </div>
          {levelInfo.next && (
            <div className="text-right">
              <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Next: {levelInfo.next.name}</div>
              <div className="text-sm font-mono num">
                <span className="text-electric font-semibold">{user.xp}</span>
                <span className="text-muted"> / {levelInfo.next.xpRequired} XP</span>
              </div>
            </div>
          )}
        </div>
        <div className="h-2 bg-elevated rounded-full overflow-hidden mb-6">
          <motion.div className="h-full xp-glow"
            style={{ background: `linear-gradient(90deg, ${levelInfo.current.color}, #00D4FF)` }}
            initial={{ width: 0 }} animate={{ width: `${levelInfo.progress * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        </div>

        {/* Level ladder */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {LEVELS.map((l, idx) => {
            const reached = user.xp >= l.xpRequired;
            const isCurrent = l.level === levelInfo.current.level;
            return (
              <div key={l.level} className="flex-1 text-center">
                <div className={`mx-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-1 transition-all ${isCurrent ? 'ring-2 ring-electric ring-offset-2 ring-offset-surface' : ''}`}
                  style={{
                    background: reached ? l.color : '#2A2A38',
                    color: reached ? '#0A0A0F' : '#7B7B8B',
                  }}>
                  {l.level}
                </div>
                <div className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider truncate ${reached ? 'text-text' : 'text-muted'}`}>
                  {l.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Badges earned</h2>
        {user.earnedBadges.length === 0 ? (
          <p className="text-muted text-sm">Complete scenarios to earn badges. They will appear here.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {user.earnedBadges.map((badge, idx) => {
              const scenario = scenarios.find((s) => s.badge === badge);
              return (
                <motion.div key={idx}
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.05, type: 'spring' }}
                  className="bg-elevated border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-2xl">{badge}</span>
                  <div>
                    <div className="text-sm font-semibold">{scenario?.badgeName ?? 'Badge'}</div>
                    <div className="text-xs text-muted">{scenario?.subtitle ?? '—'}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity heatmap */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent activity</h2>
        <ActivityHeatmap user={user} />
      </div>

      {/* Account section */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <div className="space-y-3 text-sm">
          <Row label="Goal" value={user.profile ? GOAL_CONFIG[user.profile.goal].label : '—'} />
          <Row label="Skill level" value={user.profile ? SKILL_CONFIG[user.profile.skill].label : '—'} />
          <Row label="Member since" value={user.profile ? formatDate(user.profile.onboardedAt) : '—'} />
          <Row label="Last active" value={user.lastActiveDate ? formatDate(user.lastActiveDate) : '—'} />
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red/5 border border-red/30 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2 text-red">Reset progress</h2>
        <p className="text-sm text-muted mb-4">
          Clear all your XP, streaks, lessons, scenarios, and onboarding. Cannot be undone.
        </p>
        <button onClick={onReset}
          className="px-4 py-2 rounded-lg border border-red/40 text-red hover:bg-red/10 transition-colors text-sm font-semibold">
          Reset everything
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-mono uppercase tracking-wider text-muted">{label}</span>
      </div>
      <div className="text-2xl font-bold num" style={{ color }}>{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ActivityHeatmap({ user }: { user: UserState }) {
  // Simple heatmap: last 30 days, marking days the user was active.
  // We approximate "active days" using lastActiveDate and a derived set from the streak.
  // For a real product this would track every active day. This is illustrative.
  const today = new Date();
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (34 - i));
    return d;
  });

  // Without per-day tracking, we mark the streak's worth of recent days as active.
  const activeDays = new Set<string>();
  if (user.lastActiveDate) {
    const last = new Date(user.lastActiveDate);
    for (let i = 0; i < user.streak; i++) {
      const d = new Date(last);
      d.setDate(d.getDate() - i);
      activeDays.add(d.toISOString().slice(0, 10));
    }
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const key = d.toISOString().slice(0, 10);
          const isActive = activeDays.has(key);
          const isToday = key === today.toISOString().slice(0, 10);
          return (
            <div key={i}
              className={`aspect-square rounded transition-all ${isToday ? 'ring-1 ring-electric' : ''}`}
              style={{
                background: isActive ? '#00D4FF' : '#1C1C26',
                opacity: isActive ? 1 : 0.4,
              }}
              title={`${d.toDateString()}${isActive ? ' · active' : ''}`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-3 text-xs font-mono text-muted">
        <span>5 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}
