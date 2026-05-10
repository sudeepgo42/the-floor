export type PricePoint = { day: number; date: string; price: number };

export type DecisionOption = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  schedule: (totalCapital: number) => Array<[number, number]>;
};

export type Chapter = 'foundations' | 'volatility' | 'manias';

export type Scenario = {
  id: string;
  number: number;
  chapter: Chapter;
  title: string;
  subtitle: string;
  context: string;
  setup: string;
  ticker: string;
  tickerName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  startingCapital: number;
  difficulty: 'rookie' | 'pro' | 'legend';
  xpReward: number;
  badge: string;
  badgeName: string;
  theme: {
    accent: string;
    accentSoft: string;
    glyph: 'wave' | 'storm' | 'sun' | 'rocket' | 'mountain' | 'flame' | 'spiral' | 'tulip' | 'pulse';
    mood: 'calm' | 'tense' | 'chaotic' | 'euphoric';
  };
  prices: PricePoint[];
  decisions: DecisionOption[];
  debrief: { headline: string; body: string; lesson: string };
  relatedLessons?: string[];
};

function buildPath(days: number, startPrice: number, points: Array<[number, number]>): PricePoint[] {
  const result: PricePoint[] = [];
  const startDate = new Date(2020, 1, 19);
  for (let d = 0; d < days; d++) {
    const t = d / (days - 1);
    let lo = points[0], hi = points[points.length - 1];
    for (let i = 0; i < points.length - 1; i++) {
      if (t >= points[i][0] && t <= points[i + 1][0]) { lo = points[i]; hi = points[i + 1]; break; }
    }
    const segT = (t - lo[0]) / (hi[0] - lo[0] || 1);
    const smooth = segT * segT * (3 - 2 * segT);
    const mult = lo[1] + (hi[1] - lo[1]) * smooth;
    const noise = Math.sin(d * 1.7) * 0.008 + Math.cos(d * 0.43) * 0.005;
    const price = startPrice * mult * (1 + noise);
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    result.push({ day: d, date: date.toISOString().slice(0, 10), price: Math.round(price * 100) / 100 });
  }
  return result;
}

const bullScenario: Scenario = {
  id: 'bull-2017', number: 1, chapter: 'foundations',
  title: 'A normal year', subtitle: 'January 2017',
  context: 'Markets are calm. Nothing dramatic is happening. You have $10,000 and a question: invest now, or wait?',
  setup: 'It is January 2017. You have $10,000 saved up and you are thinking about investing for the first time. Markets are at all-time highs. Some friends say it is a great time. Others say it is too late.',
  ticker: 'MKT-A', tickerName: 'Broad Market Index',
  startDate: 'Jan 3, 2017', endDate: 'Dec 29, 2017', totalDays: 120, startingCapital: 10000,
  difficulty: 'rookie', xpReward: 100, badge: '🌱', badgeName: 'First Steps',
  theme: { accent: '#00E676', accentSoft: 'rgba(0, 230, 118, 0.12)', glyph: 'sun', mood: 'calm' },
  prices: buildPath(120, 100, [[0.0, 1.00], [0.2, 1.06], [0.35, 1.04], [0.5, 1.12], [0.7, 1.15], [0.85, 1.13], [1.0, 1.20]]),
  decisions: [
    { id: 'lump-sum', label: 'Invest all $10,000 today', shortLabel: 'Lump sum', description: 'Just get started. Time in the market is the bigger lever than perfect timing.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'Dollar-cost average monthly', shortLabel: 'DCA', description: 'Invest $833 each month for a year. Spreads risk and builds the habit.', schedule: (cap) => { const m = cap / 12; return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((d) => [d, m] as [number, number]); } },
    { id: 'wait', label: 'Wait for a pullback', shortLabel: 'Wait', description: 'Markets are too high. Wait for a 10% drop, then invest.', schedule: () => [] },
  ],
  debrief: {
    headline: 'The pullback never came',
    body: 'The market gained 20% with barely a wobble. Lump sum captured the full year. DCA captured most of it. Waiting for a 10% pullback meant sitting in cash all year while the market climbed.',
    lesson: 'Roughly 70% of years are positive, and most do not have a meaningful pullback. Being invested matters more than being clever about when.',
  },
  relatedLessons: ['compounding', 'dca-vs-lump'],
};

const dividendScenario: Scenario = {
  id: 'dividend-2015', number: 2, chapter: 'foundations',
  title: 'The slow road', subtitle: 'A dividend stock, 2015 to 2019',
  context: 'A boring utility company. Modest growth. But it has paid dividends every quarter for 30 years.',
  setup: 'You are deciding what to do with $10,000. A friend tells you to buy a popular tech stock. Your father tells you to buy this boring utility company that pays a 4% dividend. Five years later, who was right?',
  ticker: 'UTIL-A', tickerName: 'Utility Holdings Co.',
  startDate: 'Jan 2, 2015', endDate: 'Dec 31, 2019', totalDays: 100, startingCapital: 10000,
  difficulty: 'rookie', xpReward: 120, badge: '💰', badgeName: 'Dividend Hunter',
  theme: { accent: '#FFB020', accentSoft: 'rgba(255, 176, 32, 0.12)', glyph: 'mountain', mood: 'calm' },
  prices: buildPath(100, 100, [[0.0, 1.00], [0.25, 1.08], [0.5, 1.15], [0.75, 1.22], [1.0, 1.32]]),
  decisions: [
    { id: 'lump-sum', label: 'Buy and hold, reinvest dividends', shortLabel: 'Reinvest', description: 'Put $10k in. Reinvest every dividend back into more shares. Let compounding work.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'Buy and hold, take dividends as cash', shortLabel: 'Take cash', description: 'Put $10k in. Pocket the dividends. Use them for whatever you want.', schedule: (cap) => [[0, cap]] },
    { id: 'wait', label: 'Skip it, find something more exciting', shortLabel: 'Skip', description: 'Boring utilities are not where wealth is built. Wait for a better idea.', schedule: () => [] },
  ],
  debrief: {
    headline: 'Boring won',
    body: 'The stock returned 32% over five years. Adding the reinvested dividends, total return was closer to 55%. Pocketing the dividends gave you about $2,000 in cash and 32% growth on the principal. Skipping it entirely meant watching from the sidelines.',
    lesson: 'Dividends matter more than people realise. Over long periods, reinvested dividends often account for half of total stock market returns. Boring is not the same as bad.',
  },
  relatedLessons: ['dividends', 'compounding'],
};

const inflationScenario: Scenario = {
  id: 'inflation-2022', number: 3, chapter: 'foundations',
  title: 'Inflation eats cash', subtitle: 'The savings account problem, 2022',
  context: 'You have $10,000 in a savings account earning 0.5% interest. Inflation is running at 7%.',
  setup: 'Your high-interest savings account pays 0.5%. Inflation is at 7% and seems to be climbing. Every month your cash is worth a little less in real terms. You have a year to do something about it.',
  ticker: 'CASH-A', tickerName: 'Cash & Equivalents',
  startDate: 'Jan 1, 2022', endDate: 'Dec 31, 2022', totalDays: 80, startingCapital: 10000,
  difficulty: 'rookie', xpReward: 130, badge: '🛡️', badgeName: 'Inflation Aware',
  theme: { accent: '#B47BFF', accentSoft: 'rgba(180, 123, 255, 0.12)', glyph: 'pulse', mood: 'tense' },
  prices: buildPath(80, 100, [[0.0, 1.00], [0.3, 0.93], [0.6, 0.86], [1.0, 0.78]]),
  decisions: [
    { id: 'lump-sum', label: 'Move everything into stocks', shortLabel: 'Stocks', description: 'Stocks tend to outpace inflation over time. But 2022 will be a hard year for them too.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'Split between stocks, bonds, and cash', shortLabel: 'Diversify', description: '50% stocks, 30% bonds, 20% cash. Diversified. Less upside, less downside.', schedule: (cap) => [[0, cap * 0.5]] },
    { id: 'wait', label: 'Stay in cash, wait it out', shortLabel: 'Stay cash', description: 'Markets are scary. Cash feels safe. Just wait until things settle down.', schedule: () => [] },
  ],
  debrief: {
    headline: 'Cash was the worst hiding place',
    body: 'Stocks fell about 18% in 2022. The diversified portfolio fell about 12%. Cash held its dollar value but lost roughly 7% of its purchasing power. Cash felt safest but lost the most in real terms. The "scary" stocks recovered fully within 18 months.',
    lesson: 'Cash is not a safe asset, it is a depreciating one. Inflation is a slow, invisible tax on people who play it safe. Some level of stock exposure is the cost of preserving purchasing power.',
  },
  relatedLessons: ['inflation', 'asset-classes'],
};

const covidScenario: Scenario = {
  id: 'covid-2020', number: 4, chapter: 'volatility',
  title: 'The fastest crash in history', subtitle: 'February 2020',
  context: 'A virus is spreading. Markets are nervous but still near all-time highs. Something unprecedented is coming.',
  setup: 'It is mid-February 2020. You have $10,000 to invest in a major index fund. Over the next six months, something unprecedented is going to happen. You do not know what is coming.',
  ticker: 'MKT-A', tickerName: 'Broad Market Index',
  startDate: 'Feb 19, 2020', endDate: 'Aug 27, 2020', totalDays: 130, startingCapital: 10000,
  difficulty: 'pro', xpReward: 250, badge: '⚡', badgeName: 'Steady Hands',
  theme: { accent: '#00D4FF', accentSoft: 'rgba(0, 212, 255, 0.12)', glyph: 'storm', mood: 'tense' },
  prices: buildPath(130, 100, [[0.0, 1.00], [0.08, 1.02], [0.22, 0.66], [0.35, 0.78], [0.55, 0.88], [0.75, 0.97], [1.0, 1.06]]),
  decisions: [
    { id: 'lump-sum', label: 'Invest all $10,000 today', shortLabel: 'Lump sum', description: 'Put the full amount in on day one. Maximum exposure, maximum conviction.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'Dollar-cost average over 6 months', shortLabel: 'DCA', description: 'Invest $1,667 every month for 6 months. Reduces timing risk.', schedule: (cap) => { const m = cap / 6; return [0, 22, 44, 66, 88, 110].map((d) => [d, m] as [number, number]); } },
    { id: 'wait', label: 'Stay in cash and wait', shortLabel: 'Wait', description: 'Hold the $10,000 in cash. Invest only when you see a clear signal.', schedule: () => [] },
  ],
  debrief: {
    headline: 'Recovery in five months',
    body: 'The market dropped 34% in five weeks, the fastest crash in modern history. By August it had fully recovered. Lump sum looked terrible for two months, then quietly outperformed. DCA smoothed the ride. Waiting in cash meant missing the entire recovery.',
    lesson: 'Doing nothing has a cost. The market does not wait for clarity, and clarity usually arrives too late to act on.',
  },
  relatedLessons: ['volatility', 'panic-selling'],
};

const correctionScenario: Scenario = {
  id: 'correction-2018', number: 5, chapter: 'volatility',
  title: 'A normal correction', subtitle: 'October 2018',
  context: 'Markets fall 10% in two weeks. The news says it is the start of something bigger. Is it?',
  setup: 'It is October 2018. After a great year, markets have suddenly dropped 10% in two weeks. Headlines are warning of recession. Your portfolio is down $1,000. You have $10,000 in cash on the side. Do you buy more, hold, or get out?',
  ticker: 'MKT-A', tickerName: 'Broad Market Index',
  startDate: 'Oct 1, 2018', endDate: 'Apr 30, 2019', totalDays: 90, startingCapital: 10000,
  difficulty: 'pro', xpReward: 220, badge: '🎯', badgeName: 'Cool Head',
  theme: { accent: '#00D4FF', accentSoft: 'rgba(0, 212, 255, 0.12)', glyph: 'pulse', mood: 'tense' },
  prices: buildPath(90, 100, [[0.0, 1.00], [0.15, 0.92], [0.3, 0.84], [0.5, 0.92], [0.75, 1.04], [1.0, 1.14]]),
  decisions: [
    { id: 'lump-sum', label: 'Buy the dip aggressively', shortLabel: 'Buy dip', description: 'Put all $10k in now while everything is on sale. Be greedy when others are fearful.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'DCA in over 4 months', shortLabel: 'DCA', description: 'Invest $2,500 each month. If it falls more, you average down. If it rises, you still capture gains.', schedule: (cap) => { const m = cap / 4; return [0, 22, 44, 66].map((d) => [d, m] as [number, number]); } },
    { id: 'wait', label: 'Sell what you have, get to safety', shortLabel: 'Sell', description: 'A 10% correction often becomes a 20% bear market. Get out before it gets worse.', schedule: () => [] },
  ],
  debrief: {
    headline: '10% drops are normal. This was nothing.',
    body: 'The correction lasted 6 weeks. Markets recovered fully by April and went on to a strong year. The "buy the dip" strategy gained 14% in 7 months. DCA was close behind. Selling in panic locked in losses and missed the recovery.',
    lesson: 'A 10% correction happens about once a year on average. A 20% bear market happens roughly every 4 years. Most corrections are not bear markets in disguise.',
  },
  relatedLessons: ['volatility', 'panic-selling'],
};

const recessionScenario: Scenario = {
  id: 'rates-2022', number: 6, chapter: 'volatility',
  title: 'The year nothing worked', subtitle: 'Stocks AND bonds, 2022',
  context: 'The Fed is raising rates fast. Stocks are falling. Usually bonds save you. This time they are not.',
  setup: 'It is January 2022. Inflation is high and the Fed has signalled aggressive rate hikes. Normally when stocks fall, bonds rise. But rising rates push bond prices DOWN. You have $10,000. Where does it go?',
  ticker: 'MIX-A', tickerName: '60/40 Stocks/Bonds Mix',
  startDate: 'Jan 3, 2022', endDate: 'Dec 30, 2022', totalDays: 110, startingCapital: 10000,
  difficulty: 'pro', xpReward: 280, badge: '🌊', badgeName: 'Storm Rider',
  theme: { accent: '#FF3B5C', accentSoft: 'rgba(255, 59, 92, 0.12)', glyph: 'storm', mood: 'tense' },
  prices: buildPath(110, 100, [[0.0, 1.00], [0.2, 0.94], [0.4, 0.85], [0.6, 0.88], [0.8, 0.82], [1.0, 0.85]]),
  decisions: [
    { id: 'lump-sum', label: 'Stick with the classic 60/40 portfolio', shortLabel: '60/40', description: 'Stocks and bonds. Diversified. Trust the long-term math even when the short-term hurts.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'Move to cash and short-term bonds', shortLabel: 'Defensive', description: 'Cash earns nothing but loses nothing. Sit out the storm. Re-enter when rates peak.', schedule: () => [] },
    { id: 'wait', label: 'Buy more stocks on the way down', shortLabel: 'Aggressive', description: 'Use the volatility. DCA $2k per quarter into stocks. Buying when others are selling.', schedule: (cap) => { const m = cap / 4; return [0, 27, 55, 82].map((d) => [d, m] as [number, number]); } },
  ],
  debrief: {
    headline: 'The worst year for 60/40 in decades',
    body: 'Stocks fell 18%, bonds fell 13%. The classic 60/40 lost about 16%. Cash held steady. Aggressive stock buying captured the recovery starting in late 2022 and through 2023.',
    lesson: 'Diversification reduces risk most of the time. Sometimes correlations break down and everything falls together. Cash has a role: it is the only asset that lets you act when others cannot.',
  },
  relatedLessons: ['asset-classes', 'volatility'],
};

const gfcScenario: Scenario = {
  id: 'gfc-2008', number: 7, chapter: 'volatility',
  title: 'When everyone is selling', subtitle: 'September 2008',
  context: 'Lehman has collapsed. Banks are failing. The financial system is on the brink.',
  setup: 'It is September 15, 2008. Markets have already fallen 20% from their peak. Every news headline says the system is broken. Your friends are pulling their savings out.',
  ticker: 'MKT-A', tickerName: 'Broad Market Index',
  startDate: 'Sep 15, 2008', endDate: 'Mar 1, 2010', totalDays: 200, startingCapital: 10000,
  difficulty: 'legend', xpReward: 500, badge: '🔥', badgeName: 'Iron Nerve',
  theme: { accent: '#FF3B5C', accentSoft: 'rgba(255, 59, 92, 0.12)', glyph: 'flame', mood: 'chaotic' },
  prices: buildPath(200, 100, [[0.0, 1.00], [0.05, 0.95], [0.15, 0.78], [0.30, 0.65], [0.45, 0.78], [0.65, 0.88], [0.85, 0.95], [1.0, 1.02]]),
  decisions: [
    { id: 'lump-sum', label: 'Invest all $10,000 today', shortLabel: 'Lump sum', description: 'Buy when there is fear in the streets. Conviction or recklessness, depending on how it ends.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'Dollar-cost average over 12 months', shortLabel: 'DCA', description: 'Invest $833 every month for a year. Catches the bottom and the recovery.', schedule: (cap) => { const m = cap / 12; return [0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 198].map((d) => [d, m] as [number, number]); } },
    { id: 'wait', label: 'Sell what you have, sit in cash', shortLabel: 'Cash out', description: 'Protect capital. Get back in when things calm down.', schedule: () => [] },
  ],
  debrief: {
    headline: 'The bottom was March 2009',
    body: 'Markets fell another 20% before bottoming. Then began one of the longest bull runs in history. Lump sum looked horrific for six months. DCA captured the bottom and outperformed everything else.',
    lesson: 'The hardest part of investing is psychology. The biggest mistake during crashes is selling well-priced assets out of fear and never getting back in.',
  },
  relatedLessons: ['panic-selling', 'volatility'],
};

const dotcomScenario: Scenario = {
  id: 'dotcom-1999', number: 8, chapter: 'manias',
  title: 'Everyone is getting rich', subtitle: 'March 1999',
  context: 'Tech stocks have tripled in two years. Your friends are quitting their jobs to day-trade. The Nasdaq cannot stop going up.',
  setup: 'It is March 1999. Internet stocks are exploding. A friend made $100k in three months. Your taxi driver is giving you stock tips. Some say "this time is different." Your $10,000 is feeling left behind.',
  ticker: 'TECH-A', tickerName: 'Internet Index',
  startDate: 'Mar 1, 1999', endDate: 'Mar 1, 2002', totalDays: 150, startingCapital: 10000,
  difficulty: 'legend', xpReward: 450, badge: '🌷', badgeName: 'Bubble Survivor',
  theme: { accent: '#FFB020', accentSoft: 'rgba(255, 176, 32, 0.15)', glyph: 'rocket', mood: 'euphoric' },
  prices: buildPath(150, 100, [[0.0, 1.00], [0.15, 1.45], [0.27, 1.85], [0.32, 1.62], [0.4, 1.4], [0.55, 0.95], [0.7, 0.65], [0.85, 0.50], [1.0, 0.42]]),
  decisions: [
    { id: 'lump-sum', label: 'Buy tech stocks aggressively', shortLabel: 'All-in tech', description: 'This is the future. Internet companies will own the next decade. Get in now or miss out.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'DCA into a diversified index', shortLabel: 'Diversified', description: 'Some tech exposure but spread across the whole market. Boring but balanced.', schedule: (cap) => { const m = cap / 6; return [0, 25, 50, 75, 100, 125].map((d) => [d, m] as [number, number]); } },
    { id: 'wait', label: 'Sit out the mania, hold cash', shortLabel: 'Skip', description: 'Valuations are insane. Wait for sanity to return. You will miss some upside.', schedule: () => [] },
  ],
  debrief: {
    headline: 'The Nasdaq fell 78% from peak',
    body: 'After peaking in March 2000, internet stocks crashed harder than any major asset class in decades. Tech investments lost most of their value. The diversified portfolio fell 30% but recovered. Cash sat there earning a few percent and outperformed tech for the next five years.',
    lesson: 'Bubbles always feel like the new normal at the top. The phrase "this time is different" has destroyed more wealth than any other in finance.',
  },
  relatedLessons: ['bubbles', 'fomo'],
};

const memeScenario: Scenario = {
  id: 'meme-2021', number: 9, chapter: 'manias',
  title: 'When the internet picks a stock', subtitle: 'January 2021',
  context: 'A struggling video game retailer is up 1,500% in three weeks. Reddit is going wild. You have $10,000 burning a hole.',
  setup: 'It is January 25, 2021. GameStop has gone from $20 to $300 in a month. r/WallStreetBets is calling it "the squeeze of the century." Hedge funds are panicking. Your $10,000 wants in.',
  ticker: 'MEME-A', tickerName: 'Meme Stock',
  startDate: 'Jan 25, 2021', endDate: 'Jul 25, 2021', totalDays: 100, startingCapital: 10000,
  difficulty: 'legend', xpReward: 400, badge: '🚀', badgeName: 'Diamond Hands',
  theme: { accent: '#B47BFF', accentSoft: 'rgba(180, 123, 255, 0.15)', glyph: 'rocket', mood: 'euphoric' },
  prices: buildPath(100, 100, [[0.0, 1.00], [0.08, 1.55], [0.12, 1.30], [0.18, 0.50], [0.3, 0.35], [0.5, 0.55], [0.7, 0.70], [1.0, 0.55]]),
  decisions: [
    { id: 'lump-sum', label: 'Buy in at $300, ride the rocket', shortLabel: 'Buy now', description: 'It is going to the moon. Get on board before it leaves without you.', schedule: (cap) => [[0, cap]] },
    { id: 'dca', label: 'Buy a small position ($1,000 only)', shortLabel: 'Small bet', description: 'Treat it as entertainment, not investing. Only risk what you can afford to lose.', schedule: (cap) => [[0, cap * 0.1]] },
    { id: 'wait', label: 'Watch from the sidelines', shortLabel: 'Skip', description: 'Manias rarely end well. Whatever happens, you keep your $10k.', schedule: () => [] },
  ],
  debrief: {
    headline: 'The squeeze ended fast',
    body: 'After peaking around $480, the stock collapsed 80% within weeks. Buying at $300 and holding meant losing roughly half. The $1,000 "fun money" position became $500. Sitting out preserved capital fully.',
    lesson: 'Meme stocks are not investing, they are speculation. Speculation can be fun in tiny doses but is mathematically unforgiving as a strategy.',
  },
  relatedLessons: ['fomo', 'bubbles'],
};

export const scenarios: Scenario[] = [
  bullScenario, dividendScenario, inflationScenario,
  covidScenario, correctionScenario, recessionScenario, gfcScenario,
  dotcomScenario, memeScenario,
];

export const CHAPTERS: Record<Chapter, { name: string; description: string; color: string }> = {
  foundations: { name: 'Foundations', description: 'How investing works in normal times', color: '#00E676' },
  volatility: { name: 'Volatility', description: 'When markets get scary', color: '#00D4FF' },
  manias: { name: 'Manias & Bubbles', description: 'When everyone loses their mind', color: '#FF3B5C' },
};

export function calculatePortfolio(scenario: Scenario, decision: DecisionOption) {
  const schedule = decision.schedule(scenario.startingCapital);
  let cash = scenario.startingCapital;
  let shares = 0;
  return scenario.prices.map((point) => {
    for (const [day, amount] of schedule) {
      if (day === point.day && cash >= amount) {
        shares += amount / point.price;
        cash -= amount;
      }
    }
    const invested = shares * point.price;
    return { day: point.day, value: cash + invested, cash, invested };
  });
}

export const LEVELS = [
  { level: 1, name: 'Rookie', xpRequired: 0, color: '#00E676' },
  { level: 2, name: 'Trader', xpRequired: 200, color: '#00D4FF' },
  { level: 3, name: 'Strategist', xpRequired: 600, color: '#B47BFF' },
  { level: 4, name: 'Veteran', xpRequired: 1200, color: '#FFB020' },
  { level: 5, name: 'Legend', xpRequired: 2200, color: '#FF3B5C' },
];

export function getLevelFromXP(xp: number) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) current = level;
  }
  const next = LEVELS.find((l) => l.xpRequired > xp);
  return { current, next, progress: next ? (xp - current.xpRequired) / (next.xpRequired - current.xpRequired) : 1 };
}
