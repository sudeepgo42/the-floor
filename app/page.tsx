'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  scenarios, calculatePortfolio, getLevelFromXP, CHAPTERS,
  type Scenario, type DecisionOption, type Chapter,
} from '@/lib/scenarios';
import { lessons, getLessonById } from '@/lib/lessons';
import { initialState, updateStreak, getDailyQuest, type UserState, type Goal, type SkillLevel } from '@/lib/user';
import { ScenarioGlyph, Confetti, LiveDot, Particles } from '@/components/Visuals';
import { Onboarding } from '@/components/Onboarding';
import { LessonPlayer } from '@/components/LessonPlayer';
import { Profile } from '@/components/Profile';
import { BottomNav, type Tab } from '@/components/BottomNav';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid,
} from 'recharts';

type Modal = null | { kind: 'lesson'; id: string } | { kind: 'scenario'; index: number; stage: 'setup' | 'decide' | 'playing' | 'debrief'; decisionId: string | null };

export default function Home() {
  const [tab, setTab] = useState<Tab>('home');
  const [modal, setModal] = useState<Modal>(null);
  const [playbackDay, setPlaybackDay] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [user, setUser] = useState<UserState>(initialState);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('the-floor-user-v4');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('the-floor-user-v4', JSON.stringify(user));
  }, [user, hydrated]);

  const scenario = modal?.kind === 'scenario' ? scenarios[modal.index] : null;
  const decision = scenario && modal?.kind === 'scenario' && modal.decisionId
    ? scenario.decisions.find((d) => d.id === modal.decisionId) || null
    : null;
  const portfolioData = useMemo(() => decision && scenario ? calculatePortfolio(scenario, decision) : [], [scenario, decision]);
  const allOutcomes = useMemo(() =>
    scenario ? scenario.decisions.map((d) => ({ decision: d, data: calculatePortfolio(scenario, d) })) : [],
    [scenario]);
  const currentLesson = modal?.kind === 'lesson' ? getLessonById(modal.id) : null;

  useEffect(() => {
    if (!playing || !scenario) return;
    if (playbackDay >= scenario.totalDays - 1) {
      setPlaying(false);
      setTimeout(() => {
        if (modal?.kind === 'scenario') setModal({ ...modal, stage: 'debrief' });
      }, 600);
      return;
    }
    const interval = setInterval(() => {
      setPlaybackDay((d) => Math.min(d + 2, scenario.totalDays - 1));
    }, 28);
    return () => clearInterval(interval);
  }, [playing, playbackDay, scenario, modal]);

  const startScenario = (idx: number) => {
    setPlaybackDay(0);
    setPlaying(false);
    setModal({ kind: 'scenario', index: idx, stage: 'setup', decisionId: null });
  };

  const startLesson = (id: string) => {
    setModal({ kind: 'lesson', id });
  };

  const completeLesson = () => {
    if (!currentLesson) return;
    if (!user.completedLessons.includes(currentLesson.id)) {
      setUser((u) => updateStreak({
        ...u,
        xp: u.xp + currentLesson.xpReward,
        completedLessons: [...u.completedLessons, currentLesson.id],
      }));
      setConfettiTrigger((c) => c + 1);
    }
    // If no unlocks, close immediately. If there is an unlocks scenario,
    // LessonPlayer will show the completion card before calling onExit.
    if (!currentLesson.unlocks) setModal(null);
  };

  const launchUnlockedScenario = () => {
    if (!currentLesson?.unlocks) return;
    const idx = scenarios.findIndex((s) => s.id === currentLesson.unlocks);
    if (idx < 0) { setModal(null); return; }
    startScenario(idx);
  };

  const commitDecision = (id: string) => {
    if (modal?.kind !== 'scenario') return;
    setModal({ ...modal, stage: 'playing', decisionId: id });
    setPlaybackDay(0);
    setTimeout(() => setPlaying(true), 500);
  };

  const finishScenario = () => {
    if (!scenario) return;
    if (!user.completedScenarios.includes(scenario.id)) {
      setUser((u) => updateStreak({
        ...u,
        xp: u.xp + scenario.xpReward,
        completedScenarios: [...u.completedScenarios, scenario.id],
        earnedBadges: [...u.earnedBadges, scenario.badge],
      }));
      setConfettiTrigger((c) => c + 1);
    }
    setModal(null);
  };

  const updateProfile = (updates: Partial<{ name: string; goal: Goal; skill: SkillLevel }>) => {
    setUser((u) => u.profile ? { ...u, profile: { ...u.profile, ...updates } } : u);
  };

  const resetProgress = () => {
    if (!confirm('Are you sure? This wipes all progress, badges, and onboarding.')) return;
    localStorage.removeItem('the-floor-user-v4');
    window.location.reload();
  };

  // Onboarding gate
  if (hydrated && !user.profile) {
    return (
      <main className="min-h-screen bg-bg text-text relative aurora-bg">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative z-10">
          <Onboarding onComplete={(profile) => setUser((u) => updateStreak({ ...u, profile }))} />
        </div>
      </main>
    );
  }

  if (!hydrated) return <main className="min-h-screen bg-bg" />;

  return (
    <main className="min-h-screen bg-bg text-text relative aurora-bg">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <Confetti trigger={confettiTrigger} />

      {/* Main content area, indented on desktop for side nav */}
      <div className="md:ml-20 pb-24 md:pb-0">
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
              <HomeTab user={user} onStartScenario={startScenario} onStartLesson={startLesson} onSwitchTab={setTab} />
            </motion.div>
          )}
          {tab === 'lessons' && (
            <motion.div key="lessons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
              <LessonsTab user={user} onStartLesson={startLesson} />
            </motion.div>
          )}
          {tab === 'simulator' && (
            <motion.div key="simulator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
              <SimulatorTab user={user} onStartScenario={startScenario} />
            </motion.div>
          )}
          {tab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
              <Profile user={user} onUpdateProfile={updateProfile} onReset={resetProgress} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {/* Modal layer for lessons and scenarios */}
      <AnimatePresence>
        {modal?.kind === 'lesson' && currentLesson && (
          <motion.div key="lesson-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg overflow-auto">
            <LessonPlayer
              lesson={currentLesson}
              onComplete={completeLesson}
              onExit={() => setModal(null)}
              onTrySimulator={currentLesson.unlocks ? launchUnlockedScenario : undefined}
            />
          </motion.div>
        )}

        {modal?.kind === 'scenario' && scenario && (
          <motion.div key="scenario-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg overflow-auto">
            {modal.stage === 'setup' && (
              <SetupView scenario={scenario}
                onContinue={() => setModal({ ...modal, stage: 'decide' })}
                onBack={() => setModal(null)} />
            )}
            {modal.stage === 'decide' && (
              <DecideView scenario={scenario}
                onCommit={commitDecision}
                onBack={() => setModal({ ...modal, stage: 'setup' })} />
            )}
            {modal.stage === 'playing' && decision && (
              <PlayingView scenario={scenario} decision={decision} portfolioData={portfolioData} playbackDay={playbackDay} />
            )}
            {modal.stage === 'debrief' && decision && (
              <DebriefView scenario={scenario} decision={decision} allOutcomes={allOutcomes}
                alreadyCompleted={user.completedScenarios.includes(scenario.id)}
                onReplay={() => { setPlaybackDay(0); setPlaying(false); setModal({ ...modal, stage: 'decide', decisionId: null }); }}
                onFinish={finishScenario}
                onJumpToLesson={(id) => { setModal({ kind: 'lesson', id }); }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ============ HOME TAB ============ */

function HomeTab({
  user, onStartScenario, onStartLesson, onSwitchTab,
}: {
  user: UserState; onStartScenario: (idx: number) => void; onStartLesson: (id: string) => void; onSwitchTab: (t: Tab) => void;
}) {
  const levelInfo = getLevelFromXP(user.xp);
  const dailyQuest = getDailyQuest(user);

  // Recommend the next item: first incomplete lesson or scenario.
  const nextLesson = lessons.find((l) => !user.completedLessons.includes(l.id));
  const nextScenarioIdx = scenarios.findIndex((s) => !user.completedScenarios.includes(s.id));
  const nextScenario = nextScenarioIdx >= 0 ? scenarios[nextScenarioIdx] : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 sm:py-10">
      {/* Top status bar */}
      <header className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted">{greeting()}</div>
          <h1 className="text-3xl font-bold tracking-tight">{user.profile?.name}</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatChip icon="🔥" value={`${user.streak}d`} color="#FFB020" />
          <StatChip icon="⚡" value={user.xp.toLocaleString()} color="#00D4FF" />
        </div>
      </header>

      {/* Daily quest banner */}
      {!dailyQuest.completed && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber/15 to-amber/5 border border-amber/40 rounded-xl p-4 mb-8 flex items-center gap-4">
          <div className="text-2xl">🎯</div>
          <div className="flex-1">
            <div className="text-xs font-mono uppercase tracking-wider text-amber mb-0.5">Daily Quest</div>
            <div className="font-semibold">{dailyQuest.title}</div>
          </div>
          <div className="text-sm font-mono num text-amber">+{dailyQuest.reward} XP</div>
        </motion.div>
      )}

      {/* Level progress */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-8">
        <div className="flex items-baseline justify-between mb-3 text-sm">
          <span className="font-semibold">Level {levelInfo.current.level}: {levelInfo.current.name}</span>
          {levelInfo.next && (
            <span className="num font-mono text-xs text-muted">{user.xp} / {levelInfo.next.xpRequired}</span>
          )}
        </div>
        <div className="h-2 bg-elevated rounded-full overflow-hidden">
          <motion.div className="h-full xp-glow"
            style={{ background: `linear-gradient(90deg, ${levelInfo.current.color}, #00D4FF)` }}
            initial={{ width: 0 }} animate={{ width: `${levelInfo.progress * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
      </div>

      {/* Continue learning - recommended */}
      <div className="mb-10">
        <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-4">Pick up where you left off</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {nextLesson && (
            <motion.button onClick={() => onStartLesson(nextLesson.id)}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card-glow text-left bg-surface border border-border rounded-2xl p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{nextLesson.emoji}</div>
                <span className="text-xs font-mono text-electric">+{nextLesson.xpReward} XP</span>
              </div>
              <div className="text-xs font-mono text-muted mb-1">Next lesson · {nextLesson.estMinutes} min</div>
              <h3 className="font-semibold text-lg leading-tight mb-1">{nextLesson.title}</h3>
              <p className="text-sm text-muted mb-3">{nextLesson.subtitle}</p>
              <div className="flex items-center gap-2 text-sm text-green pt-2 border-t border-border">
                Start lesson <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.button>
          )}
          {nextScenario && (
            <motion.button onClick={() => onStartScenario(nextScenarioIdx)}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card-glow text-left bg-surface border border-border rounded-2xl p-6 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 0%, ${nextScenario.theme.accentSoft}, transparent 70%)` }} />
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 flex items-center justify-center">
                    <ScenarioGlyph glyph={nextScenario.theme.glyph} accent={nextScenario.theme.accent} size={48} />
                  </div>
                  <span className="text-xs font-mono text-electric">+{nextScenario.xpReward} XP</span>
                </div>
                <div className="text-xs font-mono mb-1" style={{ color: nextScenario.theme.accent }}>
                  Next scenario · {nextScenario.subtitle}
                </div>
                <h3 className="font-semibold text-lg leading-tight mb-1">{nextScenario.title}</h3>
                <p className="text-sm text-muted mb-3 line-clamp-2">{nextScenario.context}</p>
                <div className="flex items-center gap-2 text-sm pt-2 border-t border-border" style={{ color: nextScenario.theme.accent }}>
                  Start scenario <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-12">
        <button onClick={() => onSwitchTab('lessons')}
          className="bg-surface border border-border rounded-xl p-5 text-left hover:border-text/40 transition-colors group">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📚</span>
            <span className="font-semibold">All lessons</span>
          </div>
          <div className="text-xs font-mono text-muted">
            {user.completedLessons.length} / {lessons.length} complete
          </div>
        </button>
        <button onClick={() => onSwitchTab('simulator')}
          className="bg-surface border border-border rounded-xl p-5 text-left hover:border-text/40 transition-colors group">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">🎮</span>
            <span className="font-semibold">All scenarios</span>
          </div>
          <div className="text-xs font-mono text-muted">
            {user.completedScenarios.length} / {scenarios.length} complete
          </div>
        </button>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function StatChip({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-surface">
      <span className="text-base">{icon}</span>
      <span className="text-sm font-semibold num" style={{ color }}>{value}</span>
    </div>
  );
}

/* ============ LESSONS TAB ============ */

function LessonsTab({ user, onStartLesson }: { user: UserState; onStartLesson: (id: string) => void }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 sm:py-10">
      <header className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Lessons</div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Learn the foundations</h1>
        <p className="text-muted">{user.completedLessons.length} of {lessons.length} complete</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, idx) => {
          const completed = user.completedLessons.includes(lesson.id);
          return (
            <motion.button key={lesson.id} onClick={() => onStartLesson(lesson.id)}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="card-glow text-left bg-surface border border-border rounded-xl p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{lesson.emoji}</div>
                {completed && <span className="text-xs font-mono text-green">✓</span>}
              </div>
              <div className="text-xs font-mono text-muted mb-1 num">Lesson {lesson.number}</div>
              <h3 className="font-semibold text-lg mb-1 leading-tight">{lesson.title}</h3>
              <p className="text-sm text-muted mb-4">{lesson.subtitle}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border text-xs font-mono">
                <span className="text-muted">{lesson.estMinutes} min</span>
                <span className="text-electric">+{lesson.xpReward} XP</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ SIMULATOR TAB ============ */

function SimulatorTab({ user, onStartScenario }: { user: UserState; onStartScenario: (idx: number) => void }) {
  const chapters: Chapter[] = ['foundations', 'volatility', 'manias'];
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 sm:py-10">
      <header className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Simulator</div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Practice in real moments</h1>
        <p className="text-muted">{user.completedScenarios.length} of {scenarios.length} complete</p>
      </header>

      {chapters.map((chapter) => {
        const chapterScenarios = scenarios.filter((s) => s.chapter === chapter);
        const config = CHAPTERS[chapter];
        return (
          <div key={chapter} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <h3 className="text-lg font-semibold" style={{ color: config.color }}>{config.name}</h3>
              <span className="text-sm text-muted">{config.description}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {chapterScenarios.map((s, idxInChapter) => {
                const globalIdx = scenarios.indexOf(s);
                const completed = user.completedScenarios.includes(s.id);
                const previousScenario = globalIdx > 0 ? scenarios[globalIdx - 1] : null;
                const previousCompleted = !previousScenario || user.completedScenarios.includes(previousScenario.id);
                const locked = !previousCompleted && !completed;
                return (
                  <ScenarioCard key={s.id} scenario={s} completed={completed} locked={locked}
                    onClick={() => !locked && onStartScenario(globalIdx)} delay={idxInChapter * 0.05} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScenarioCard({
  scenario, completed, locked, onClick, delay,
}: {
  scenario: Scenario; completed: boolean; locked: boolean; onClick: () => void; delay: number;
}) {
  const difficultyConfig = {
    rookie: { label: 'Rookie', color: '#00E676', dots: 1 },
    pro: { label: 'Pro', color: '#00D4FF', dots: 2 },
    legend: { label: 'Legend', color: '#FF3B5C', dots: 3 },
  }[scenario.difficulty];

  return (
    <motion.button onClick={onClick} disabled={locked}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className={`card-glow relative bg-surface border border-border rounded-xl p-5 text-left overflow-hidden group ${locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${scenario.theme.accentSoft}, transparent 70%)` }} />

      <div className="relative flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted num">0{scenario.number}</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((d) => (
              <div key={d} className="w-1.5 h-1.5 rounded-full"
                style={{ background: d <= difficultyConfig.dots ? difficultyConfig.color : '#2A2A38' }} />
            ))}
          </div>
        </div>
        {completed && <span className="text-xs font-mono text-green">✓</span>}
        {locked && <span className="text-base">🔒</span>}
      </div>

      <div className="relative h-24 flex items-center justify-center mb-3">
        <ScenarioGlyph glyph={scenario.theme.glyph} accent={scenario.theme.accent} size={80} />
      </div>

      <div className="relative">
        <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: scenario.theme.accent }}>
          {scenario.subtitle}
        </div>
        <h3 className="text-base font-semibold mb-1 tracking-tight leading-tight">{scenario.title}</h3>
        <p className="text-xs text-muted line-clamp-2 mb-3">{scenario.context}</p>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs font-mono text-electric num">+{scenario.xpReward} XP</span>
          <span className="text-base group-hover:translate-x-1 transition-transform" style={{ color: scenario.theme.accent }}>→</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ============ SCENARIO STAGE VIEWS ============ */

function SetupView({ scenario, onContinue, onBack }: { scenario: Scenario; onContinue: () => void; onBack: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button onClick={onBack} className="text-sm text-muted hover:text-text mb-8 flex items-center gap-2 transition-colors">✕ Close</button>

      <div className="relative h-48 mb-10 rounded-2xl overflow-hidden border border-border" style={{ background: scenario.theme.accentSoft }}>
        <Particles accent={scenario.theme.accent} />
        <div className="absolute inset-0 flex items-center justify-center">
          <ScenarioGlyph glyph={scenario.theme.glyph} accent={scenario.theme.accent} size={140} />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border"
          style={{ borderColor: scenario.theme.accent, color: scenario.theme.accent }}>
          Scenario 0{scenario.number}
        </span>
        <span className="text-xs font-mono text-muted">{scenario.subtitle}</span>
        <span className="text-xs font-mono text-electric">+{scenario.xpReward} XP</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">{scenario.title}</h1>
      <p className="text-lg text-muted mb-8 leading-relaxed">{scenario.setup}</p>

      <div className="grid grid-cols-3 gap-3 mb-10">
        <Stat label="Capital" value={`$${(scenario.startingCapital / 1000).toFixed(0)}k`} />
        <Stat label="Horizon" value={monthsBetween(scenario.startDate, scenario.endDate)} />
        <Stat label="Asset" value={scenario.tickerName} small />
      </div>

      <button onClick={onContinue}
        className="shine w-full bg-text text-bg py-4 rounded-xl font-semibold transition-all hover:scale-[1.01]">
        Make your decision →
      </button>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">{label}</div>
      <div className={`font-semibold num ${small ? 'text-sm leading-tight' : 'text-2xl'}`}>{value}</div>
    </div>
  );
}

function monthsBetween(a: string, b: string) {
  const [da, db] = [new Date(a), new Date(b)];
  const months = Math.round((db.getFullYear() - da.getFullYear()) * 12 + (db.getMonth() - da.getMonth()));
  if (months <= 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${years}y ${rem}m` : `${years}y`;
}

function DecideView({ scenario, onCommit, onBack }: { scenario: Scenario; onCommit: (id: string) => void; onBack: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button onClick={onBack} className="text-sm text-muted hover:text-text mb-8 flex items-center gap-2 transition-colors">← Back</button>

      <div className="mb-10">
        <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: scenario.theme.accent }}>
          Decision time
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          What do you do
          <br />
          <span style={{ color: scenario.theme.accent }}>with $10,000?</span>
        </h1>
      </div>

      <div className="space-y-3">
        {scenario.decisions.map((d, idx) => (
          <motion.button key={d.id} onClick={() => onCommit(d.id)}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
            className="card-glow w-full text-left bg-surface border border-border rounded-2xl p-6 group">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center font-mono text-sm font-semibold shrink-0 group-hover:border-violet group-hover:text-violet transition-colors">
                {String.fromCharCode(65 + idx)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold mb-2 leading-tight">{d.label}</h3>
                <p className="text-sm text-muted leading-relaxed">{d.description}</p>
              </div>
              <span className="text-2xl text-muted group-hover:text-text group-hover:translate-x-1 transition-all">→</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PlayingView({
  scenario, decision, portfolioData, playbackDay,
}: {
  scenario: Scenario; decision: DecisionOption; portfolioData: ReturnType<typeof calculatePortfolio>; playbackDay: number;
}) {
  const visiblePortfolio = portfolioData.slice(0, playbackDay + 1);
  const currentValue = visiblePortfolio[visiblePortfolio.length - 1]?.value ?? scenario.startingCapital;
  const startValue = scenario.startingCapital;
  const pctChange = ((currentValue - startValue) / startValue) * 100;
  const progress = (playbackDay / (scenario.totalDays - 1)) * 100;
  const currentDate = scenario.prices[playbackDay]?.date ?? scenario.startDate;
  const isUp = pctChange >= 0;
  const valueColor = isUp ? '#00E676' : '#FF3B5C';

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <LiveDot color={scenario.theme.accent} />
          <span className="text-xs font-mono uppercase tracking-wider text-muted">Playing · {decision.shortLabel}</span>
        </div>
        <span className="text-xs font-mono text-muted num">{currentDate}</span>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-4 flex-wrap">
          <motion.div key={Math.floor(currentValue / 100)}
            initial={{ opacity: 0.7, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-bold num tracking-tighter" style={{ color: valueColor }}>
            ${Math.round(currentValue).toLocaleString()}
          </motion.div>
          <div className="font-mono text-xl num font-semibold" style={{ color: valueColor }}>
            {isUp ? '↑' : '↓'} {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}%
          </div>
        </div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted mt-2">PORTFOLIO VALUE · LIVE</div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 mb-6 relative overflow-hidden">
        <Particles accent={scenario.theme.accent} />
        <div className="h-72 sm:h-96 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visiblePortfolio}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={valueColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={valueColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="#2A2A38" vertical={false} />
              <XAxis dataKey="day" domain={[0, scenario.totalDays - 1]} type="number" tick={false} axisLine={{ stroke: '#2A2A38' }} />
              <YAxis domain={['dataMin - 500', 'dataMax + 500']}
                tick={{ fontSize: 11, fontFamily: 'Geist Mono', fill: '#7B7B8B' }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={50} />
              <Area type="monotone" dataKey="value" stroke={valueColor} strokeWidth={2.5}
                fill="url(#portfolioGradient)" isAnimationActive={false} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex justify-between text-xs font-mono text-muted mb-2 num">
          <span>{scenario.startDate}</span>
          <span className="text-text">Time-lapse · {Math.floor(progress)}%</span>
          <span>{scenario.endDate}</span>
        </div>
        <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
          <div className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${scenario.theme.accent}, ${valueColor})` }} />
        </div>
      </div>
    </div>
  );
}

function DebriefView({
  scenario, decision, allOutcomes, alreadyCompleted, onReplay, onFinish, onJumpToLesson,
}: {
  scenario: Scenario; decision: DecisionOption;
  allOutcomes: Array<{ decision: DecisionOption; data: ReturnType<typeof calculatePortfolio> }>;
  alreadyCompleted: boolean;
  onReplay: () => void; onFinish: () => void; onJumpToLesson: (id: string) => void;
}) {
  const yourFinalValue = allOutcomes.find((o) => o.decision.id === decision.id)?.data.slice(-1)[0]?.value ?? scenario.startingCapital;
  const yourReturn = ((yourFinalValue - scenario.startingCapital) / scenario.startingCapital) * 100;
  const isUp = yourReturn >= 0;

  const bestDecision = [...allOutcomes].sort((a, b) =>
    (b.data.slice(-1)[0]?.value ?? 0) - (a.data.slice(-1)[0]?.value ?? 0))[0];
  const youWon = bestDecision.decision.id === decision.id;

  const merged = useMemo(() => {
    return Array.from({ length: scenario.prices.length }, (_, day) => {
      const row: Record<string, number> = { day };
      allOutcomes.forEach((o) => { row[o.decision.id] = o.data[day]?.value ?? scenario.startingCapital; });
      return row;
    });
  }, [scenario, allOutcomes]);

  const colors: Record<string, string> = { 'lump-sum': '#00D4FF', dca: '#00E676', wait: '#FFB020' };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 sm:py-10">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="bg-surface border-2 rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{ borderColor: youWon ? '#00E676' : scenario.theme.accent }}>
        <Particles accent={youWon ? '#00E676' : scenario.theme.accent} />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">
              {youWon ? '🏆 Best choice' : 'Your result'}
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-5xl font-bold num tracking-tighter" style={{ color: isUp ? '#00E676' : '#FF3B5C' }}>
                ${Math.round(yourFinalValue).toLocaleString()}
              </div>
              <div className="font-mono text-lg num font-semibold" style={{ color: isUp ? '#00E676' : '#FF3B5C' }}>
                {isUp ? '+' : ''}{yourReturn.toFixed(1)}%
              </div>
            </div>
            <div className="text-xs font-mono text-muted mt-1 uppercase tracking-wider">You chose: {decision.shortLabel}</div>
          </div>
          {!alreadyCompleted && (
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="flex items-center gap-2 bg-electric/15 border border-electric rounded-full px-4 py-2">
              <span className="text-2xl">{scenario.badge}</span>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-electric">Earned</div>
                <div className="text-sm font-semibold">{scenario.badgeName} · +{scenario.xpReward} XP</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-8">{scenario.debrief.headline}</h1>

      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-4">All three choices, side by side</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged}>
              <CartesianGrid strokeDasharray="3 6" stroke="#2A2A38" vertical={false} />
              <XAxis dataKey="day" tick={false} axisLine={{ stroke: '#2A2A38' }} />
              <YAxis domain={['dataMin - 500', 'dataMax + 500']}
                tick={{ fontSize: 11, fontFamily: 'Geist Mono', fill: '#7B7B8B' }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={55} />
              <Tooltip contentStyle={{ background: '#13131A', border: '1px solid #2A2A38', borderRadius: 8, fontFamily: 'Geist Mono', fontSize: 11 }}
                formatter={(v: number) => `$${Math.round(v).toLocaleString()}`} labelFormatter={() => ''} />
              {allOutcomes.map((o) => (
                <Line key={o.decision.id} type="monotone" dataKey={o.decision.id}
                  stroke={colors[o.decision.id] || '#B47BFF'}
                  strokeWidth={o.decision.id === decision.id ? 3 : 1.5}
                  strokeOpacity={o.decision.id === decision.id ? 1 : 0.4} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          {allOutcomes.map((o) => {
            const finalVal = o.data.slice(-1)[0]?.value ?? scenario.startingCapital;
            const ret = ((finalVal - scenario.startingCapital) / scenario.startingCapital) * 100;
            const isYours = o.decision.id === decision.id;
            return (
              <div key={o.decision.id} className={`rounded-lg p-3 ${isYours ? 'bg-elevated border border-border' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[o.decision.id] || '#B47BFF' }} />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted">{o.decision.shortLabel}</span>
                  {isYours && <span className="text-xs text-electric">YOU</span>}
                </div>
                <div className="text-xl font-semibold num">${Math.round(finalVal).toLocaleString()}</div>
                <div className="text-xs font-mono num" style={{ color: ret >= 0 ? '#00E676' : '#FF3B5C' }}>
                  {ret >= 0 ? '+' : ''}{ret.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <p className="text-lg leading-relaxed text-muted">{scenario.debrief.body}</p>
        <div className="bg-gradient-to-br from-violet/15 to-electric/15 border border-violet/40 rounded-2xl p-6 sm:p-7">
          <div className="text-xs font-mono uppercase tracking-wider text-violet mb-3">⚡ The lesson</div>
          <p className="text-xl font-semibold leading-snug">{scenario.debrief.lesson}</p>
        </div>
      </div>

      {scenario.relatedLessons && scenario.relatedLessons.length > 0 && (
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Want to go deeper?</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {scenario.relatedLessons.map((id) => {
              const l = getLessonById(id);
              if (!l) return null;
              return (
                <button key={id} onClick={() => onJumpToLesson(id)}
                  className="card-glow text-left bg-surface border border-border rounded-xl p-4 group">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{l.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{l.title}</div>
                      <div className="text-xs text-muted">{l.estMinutes} min · +{l.xpReward} XP</div>
                    </div>
                    <span className="text-base text-muted group-hover:text-text group-hover:translate-x-1 transition-all">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={onReplay}
          className="bg-surface border border-border hover:border-text py-4 rounded-xl font-semibold transition-all hover:scale-[1.01]">
          ↻ Replay with different choice
        </button>
        <button onClick={onFinish}
          className="shine bg-text text-bg py-4 rounded-xl font-semibold transition-all hover:scale-[1.01]">
          {alreadyCompleted ? 'Back to home' : 'Claim XP →'}
        </button>
      </div>
    </div>
  );
}
