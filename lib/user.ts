export type Goal = 'first-portfolio' | 'understand-markets' | 'grow-wealth';
export type SkillLevel = 'never' | 'dabbled' | 'regular';

export type UserProfile = {
  name: string;
  goal: Goal;
  skill: SkillLevel;
  onboardedAt: string;
};

export type UserState = {
  profile: UserProfile | null;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  completedScenarios: string[];
  completedLessons: string[];
  earnedBadges: string[];
};

export const initialState: UserState = {
  profile: null,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedScenarios: [],
  completedLessons: [],
  earnedBadges: [],
};

export const GOAL_CONFIG: Record<Goal, { label: string; description: string; emoji: string }> = {
  'first-portfolio': { label: 'Build my first portfolio', description: 'Get started investing with confidence.', emoji: '🌱' },
  'understand-markets': { label: 'Understand how markets work', description: 'Learn the foundations, no rush.', emoji: '🧠' },
  'grow-wealth': { label: 'Grow my wealth long-term', description: 'Compound returns, not quick wins.', emoji: '📈' },
};

export const SKILL_CONFIG: Record<SkillLevel, { label: string; description: string }> = {
  never: { label: 'Never invested', description: 'Starting from zero. That is fine.' },
  dabbled: { label: 'Dabbled', description: 'Have an account, made a few trades.' },
  regular: { label: 'Regular investor', description: 'Active for a year or more.' },
};

export function updateStreak(state: UserState): UserState {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastActiveDate === today) return state;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  return { ...state, streak: newStreak, lastActiveDate: today };
}

export function getDailyQuest(state: UserState) {
  const completedToday = state.lastActiveDate === new Date().toISOString().slice(0, 10);
  // Simple daily quest: complete one lesson or one scenario
  return {
    title: 'Complete one lesson or scenario today',
    completed: completedToday,
    reward: 25,
  };
}
