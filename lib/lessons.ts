export type LessonCard =
  | { type: 'concept'; title: string; body: string }
  | { type: 'quiz'; question: string; options: string[]; correctIndex: number; explanation: string }
  | { type: 'compare'; question: string; left: { label: string; value: string }; right: { label: string; value: string }; correct: 'left' | 'right'; explanation: string }
  | { type: 'fill-blank'; question: string; sentence: string; blank: string; answer: string; alternates?: string[]; explanation: string }
  | { type: 'order'; question: string; items: string[]; correctOrder: number[]; explanation: string }
  | { type: 'type-term'; question: string; hint?: string; answer: string; alternates?: string[]; explanation: string };

export type Lesson = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  estMinutes: number;
  xpReward: number;
  cards: LessonCard[];
  unlocks?: string;
};

export const lessons: Lesson[] = [
  {
    id: 'compounding', number: 1, title: 'The magic of compounding', subtitle: 'Why time matters more than timing',
    emoji: '📈', estMinutes: 3, xpReward: 50,
    cards: [
      { type: 'concept', title: 'What compounding actually is',
        body: 'When you earn returns on your investment, those returns start earning returns of their own. Over time, this snowballs. The longer you let it run, the bigger the snowball.' },
      { type: 'quiz', question: 'You invest $1,000 and earn 8% per year. After 10 years (compounded), how much do you have?',
        options: ['$1,800', '$2,159', '$3,200', '$5,000'], correctIndex: 1,
        explanation: 'Compounding turns $1,000 into $2,159 after 10 years at 8%.' },
      { type: 'fill-blank', question: 'Fill in the blank',
        sentence: 'Compounding is when you earn returns on your previous _____.',
        blank: 'returns', answer: 'returns', alternates: ['gains', 'profits', 'earnings'],
        explanation: 'Returns earning returns. That is the whole engine.' },
      { type: 'quiz', question: 'How much does $1,000 grow to over 30 years at 8%?',
        options: ['$3,000', '$5,400', '$10,063', '$24,000'], correctIndex: 2,
        explanation: '$10,063. Tripling the time multiplies the result many times over, not three times.' },
      { type: 'concept', title: 'The lesson',
        body: 'Time is the most powerful variable in investing, more than the rate of return. Starting at 25 instead of 35 can double your end balance, even if you invest less per year.' },
    ],
  },
  {
    id: 'dca-vs-lump', number: 2, title: 'DCA vs lump sum', subtitle: 'Two ways to put money to work',
    emoji: '⚖️', estMinutes: 3, xpReward: 50,
    cards: [
      { type: 'concept', title: 'Two strategies',
        body: 'Lump sum means investing everything at once. Dollar-cost averaging (DCA) means spreading the same amount over months or years. Which one wins?' },
      { type: 'compare', question: 'Over the average year, which strategy delivers more?',
        left: { label: 'Lump sum', value: 'Invest all at once' },
        right: { label: 'DCA', value: 'Spread over 12 months' }, correct: 'left',
        explanation: 'Lump sum wins about 67% of the time, because markets rise more often than they fall. But DCA wins emotionally: it spreads the regret.' },
      { type: 'type-term', question: 'What is the three-letter abbreviation for spreading investments evenly over time?',
        hint: 'Stands for Dollar-Cost Averaging', answer: 'DCA', alternates: ['dca'],
        explanation: 'DCA. Standard term across the industry.' },
      { type: 'quiz', question: 'When does DCA actually beat lump sum?',
        options: ['When markets are rising', 'When markets fall and then recover', 'When markets are flat', 'Never'], correctIndex: 1,
        explanation: 'DCA wins when markets fall after you start, then recover. You buy more shares at lower prices.' },
      { type: 'concept', title: 'The honest answer',
        body: 'Lump sum usually wins on returns. DCA usually wins on regret minimisation. The right choice often depends on whether you can sleep at night.' },
    ],
  },
  {
    id: 'inflation', number: 3, title: 'Inflation, the silent tax', subtitle: 'Why cash is not safe',
    emoji: '🔥', estMinutes: 3, xpReward: 50,
    cards: [
      { type: 'concept', title: 'What inflation does',
        body: 'Inflation is the rate at which prices rise. If inflation is 3%, the same basket of groceries that costs $100 today costs $103 next year. Your cash, sitting still, has lost 3% of what it can buy.' },
      { type: 'quiz', question: 'If you keep $10,000 in cash for 20 years at 3% inflation, what is its real purchasing power?',
        options: ['$9,400', '$8,000', '$5,540', '$3,000'], correctIndex: 2,
        explanation: '$5,540. After 20 years, your cash buys roughly half of what it used to.' },
      { type: 'fill-blank', question: 'Complete the sentence',
        sentence: 'Cash is not "doing nothing." It is slowly _____.',
        blank: 'losing', answer: 'losing', alternates: ['shrinking', 'depreciating', 'dying'],
        explanation: 'Inflation eats it in real terms even when the dollar amount stays the same.' },
      { type: 'compare', question: 'Which "loses" more money over 20 years?',
        left: { label: 'Stocks in a bad decade', value: '0% return' },
        right: { label: 'Cash at 3% inflation', value: 'Held in savings' }, correct: 'right',
        explanation: 'Cash always loses to inflation. A 0% return at least keeps the dollar amount intact.' },
      { type: 'concept', title: 'The lesson',
        body: 'The job of investing is partly to outrun inflation, even when growth feels secondary.' },
    ],
  },
  {
    id: 'asset-classes', number: 4, title: 'The main asset classes', subtitle: 'Stocks, bonds, cash, property',
    emoji: '🏛️', estMinutes: 4, xpReward: 60,
    cards: [
      { type: 'concept', title: 'The big four',
        body: 'Stocks own a piece of a company. Bonds lend money for interest. Cash earns very little but is safe day-to-day. Property earns rent and may appreciate. Each behaves differently in different conditions.' },
      { type: 'order', question: 'Order these from highest historical long-term return to lowest',
        items: ['Stocks', 'Bonds', 'Cash'], correctOrder: [0, 1, 2],
        explanation: 'Stocks (~7% real), bonds (~2-3% real), cash (~0% real after inflation). Higher returns come with higher short-term volatility.' },
      { type: 'quiz', question: 'Bonds tend to do best when:',
        options: ['Interest rates are rising', 'Interest rates are falling', 'Inflation is rising', 'Stocks are rising'], correctIndex: 1,
        explanation: 'Falling rates push bond prices up. Rising rates push them down.' },
      { type: 'concept', title: 'The lesson',
        body: 'A diversified portfolio uses several asset classes because no one asset class wins every year.' },
    ],
  },
  {
    id: 'dividends', number: 5, title: 'Dividends explained', subtitle: 'When companies pay you to own them',
    emoji: '💰', estMinutes: 3, xpReward: 50,
    cards: [
      { type: 'concept', title: 'What a dividend is',
        body: 'A dividend is cash a company pays its shareholders, usually quarterly, from its profits. Owning the stock means receiving these payments simply for being a shareholder.' },
      { type: 'quiz', question: 'A stock has a "dividend yield" of 4%. If you invest $10,000, how much do you receive in dividends per year?',
        options: ['$40', '$400', '$1,000', '$4,000'], correctIndex: 1,
        explanation: '$400. Yield is the annual dividend divided by the share price.' },
      { type: 'type-term', question: 'What is the term for the annual dividend divided by the share price?',
        hint: 'Two words. The "%" people quote when discussing dividend stocks.', answer: 'dividend yield', alternates: ['yield', 'div yield'],
        explanation: 'Dividend yield. Always quoted as a percentage of the share price.' },
      { type: 'compare', question: 'Over very long periods (50+ years), how much of stock market total return comes from dividends?',
        left: { label: 'Capital gains', value: 'About 50%' },
        right: { label: 'Dividends', value: 'About 50%' }, correct: 'right',
        explanation: 'Roughly half of long-term returns come from reinvested dividends, not price appreciation.' },
      { type: 'concept', title: 'The lesson',
        body: 'Reinvesting dividends is one of the most powerful things you can do as an investor. It is compounding made literal.' },
    ],
  },
  {
    id: 'reading-charts', number: 6, title: 'Reading a price chart', subtitle: 'What the squiggly line is telling you',
    emoji: '📊', estMinutes: 4, xpReward: 70,
    cards: [
      { type: 'concept', title: 'The basics of a price chart',
        body: 'A stock chart shows price over time. The X-axis is time (days, months, years). The Y-axis is price. Most charts also include trading volume below the price line. That is most of what you need to know.' },
      { type: 'quiz', question: 'A stock goes from $100 to $150 over a year. Then drops to $120. What is the total return?',
        options: ['-30%', '+20%', '+50%', '+150%'], correctIndex: 1,
        explanation: '$120 from a starting point of $100 is a 20% gain. The peak in between does not change the answer. What matters is start to finish.' },
      { type: 'fill-blank', question: 'Complete the sentence',
        sentence: 'The vertical axis on a price chart shows _____.',
        blank: 'price', answer: 'price', alternates: ['the price', 'value', 'cost'],
        explanation: 'Price on the Y-axis, time on the X-axis. The simplest possible chart, and the most common.' },
      { type: 'quiz', question: 'What does "trading volume" tell you?',
        options: ['How much the price changed', 'How many shares were traded', 'Number of investors', 'Stock price multiplied by quantity'],
        correctIndex: 1,
        explanation: 'Volume is the number of shares that changed hands. High volume during a price move usually signals stronger conviction. Low volume on a move is often less significant.' },
      { type: 'concept', title: 'The lesson',
        body: 'Charts help you see context. Where is this price compared to last year? Is the move on big volume or small? But charts cannot tell you why something moved, or where it is going next. They are a starting point, not an answer.' },
    ],
  },
  {
    id: 'pe-ratio', number: 7, title: 'P/E ratios in plain English', subtitle: 'How to tell expensive from cheap',
    emoji: '🔢', estMinutes: 4, xpReward: 70,
    cards: [
      { type: 'concept', title: 'What P/E means',
        body: 'P/E is "price-to-earnings ratio." Take the stock price, divide by annual earnings per share. The result tells you how many years of current earnings you are paying for. A P/E of 20 means you pay $20 for every $1 of annual profit.' },
      { type: 'type-term', question: 'What does the P in P/E stand for?',
        hint: 'It is the share price', answer: 'price', alternates: ['share price', 'stock price'],
        explanation: 'Price. Specifically, the current share price.' },
      { type: 'quiz', question: 'A company has earnings of $5 per share. Its stock trades at $100. What is its P/E?',
        options: ['5', '20', '100', '500'], correctIndex: 1,
        explanation: '$100 / $5 = 20. You are paying 20 times the annual earnings to own this stock.' },
      { type: 'compare', question: 'Which is generally "cheaper" relative to current profits?',
        left: { label: 'Stock A', value: 'P/E of 12' },
        right: { label: 'Stock B', value: 'P/E of 35' }, correct: 'left',
        explanation: 'Stock A is cheaper by this measure. But cheap is not always good. A low P/E might mean the company is in trouble. A high P/E might mean fast growth ahead. Context matters.' },
      { type: 'concept', title: 'The lesson',
        body: 'P/E is one of the simplest valuation measures. It tells you what you are paying. It does not tell you whether the price is right. That requires judgment about the future, not just the present.' },
    ],
  },
  {
    id: 'volatility', number: 8, title: 'Volatility is normal', subtitle: 'How often markets actually fall',
    emoji: '🌊', estMinutes: 3, xpReward: 60,
    cards: [
      { type: 'concept', title: 'Drops are part of the deal',
        body: 'The stock market does not go up in a straight line. Pullbacks of 5-10% happen multiple times a year. 20% bear markets happen on average once every 4-5 years. This is normal, not unusual.' },
      { type: 'quiz', question: 'On average, how many 10% pullbacks does the stock market have per year?',
        options: ['Less than 1', 'Roughly 1', '3 to 4', '7 to 10'], correctIndex: 1,
        explanation: 'Roughly one 10% pullback per year on average. Statistically routine.' },
      { type: 'fill-blank', question: 'Complete the sentence',
        sentence: 'A 20% drop in the market is called a _____ market.',
        blank: 'bear', answer: 'bear', alternates: ['bear'],
        explanation: 'Bear market. The opposite is bull market (rising 20%+).' },
      { type: 'quiz', question: 'After a 20% bear market, how long does the average recovery take?',
        options: ['1-2 months', '1-2 years', '5-7 years', 'Over 10 years'], correctIndex: 1,
        explanation: '1-2 years for the average bear market. COVID was 5 months. The GFC took about 4 years. Recovery is the rule.' },
      { type: 'concept', title: 'The lesson',
        body: 'Knowing volatility is normal does not make it feel less awful. But it changes what you do with the feeling: hold, do not panic, do not try to time the bottom.' },
    ],
  },
  {
    id: 'panic-selling', number: 9, title: 'The panic-selling trap', subtitle: 'Why selling low is the costliest mistake',
    emoji: '😰', estMinutes: 3, xpReward: 60,
    cards: [
      { type: 'concept', title: 'Loss aversion',
        body: 'Humans feel losses about twice as strongly as equivalent gains. Watching $10k drop to $7k feels worse than watching it rise to $13k feels good. This wiring is why so many people sell at the worst possible moment.' },
      { type: 'quiz', question: 'A study of investor returns found the average investor underperforms their own funds. Why?',
        options: ['Bad fund choices', 'High fees', 'Selling low and buying high', 'Currency effects'], correctIndex: 2,
        explanation: 'Behavioural mistakes. Selling after drops and buying after rallies. This pattern alone costs roughly 2-3% per year.' },
      { type: 'order', question: 'Order these typical investor reactions during a market crash, from most common first',
        items: ['Panic and sell', 'Hold and do nothing', 'Buy more aggressively'], correctOrder: [0, 1, 2],
        explanation: 'Most people sell. A smaller group holds. A small minority buys. The third group, on average, ends up best.' },
      { type: 'quiz', question: 'Missing the 10 best days in the market over a 20-year period would reduce your returns by roughly:',
        options: ['10%', '25%', '50%', '90%'], correctIndex: 2,
        explanation: 'Roughly half. The biggest up days often come right after the worst down days.' },
      { type: 'concept', title: 'The lesson',
        body: 'The ability to do nothing during a crash is a real, learnable skill. Most of the gains come from staying invested through the worst moments.' },
    ],
  },
  {
    id: 'bubbles', number: 10, title: 'How bubbles work', subtitle: 'When everyone is right until everyone is wrong',
    emoji: '🫧', estMinutes: 4, xpReward: 70,
    cards: [
      { type: 'concept', title: 'The pattern repeats',
        body: 'Bubbles share a script. New technology or asset attracts attention. Prices rise. More people pile in. Prices rise further on optimism alone. Late buyers borrow to participate. The story breaks. Prices collapse.' },
      { type: 'order', question: 'Put these stages of a typical bubble in order',
        items: ['Mania (everyone is buying)', 'Stealth phase (smart money quietly buys)', 'Awareness (early adopters notice)', 'Crash (reality returns)'],
        correctOrder: [1, 2, 0, 3],
        explanation: 'Stealth → Awareness → Mania → Crash. Most retail investors enter during the Mania phase, just before the crash.' },
      { type: 'quiz', question: 'Which of these is the strongest warning sign of a bubble?',
        options: ['Prices are rising', 'Lots of media coverage', 'People who do not normally invest are getting in', 'Stocks are above their 200-day average'], correctIndex: 2,
        explanation: 'Mass participation by non-investors is a classic late-stage signal. Taxi drivers, hairdressers, and your in-laws giving stock tips means the smart money is usually selling.' },
      { type: 'fill-blank', question: 'Complete the most expensive phrase in finance',
        sentence: '"This time is _____."',
        blank: 'different', answer: 'different', alternates: ['different'],
        explanation: '"This time is different" has destroyed more wealth than any other sentence in finance. It usually is not different.' },
      { type: 'concept', title: 'The lesson',
        body: 'You do not have to predict bubbles. You just have to recognise the pattern in the moment.' },
    ],
  },
  {
    id: 'fomo', number: 11, title: 'FOMO is a strategy killer', subtitle: 'Chasing what is hot',
    emoji: '🚀', estMinutes: 3, xpReward: 60,
    cards: [
      { type: 'concept', title: 'Fear of missing out',
        body: 'FOMO drives people to buy after big rises and sell after big drops. It is performance-chasing dressed up as conviction. It feels rational because the asset really is rising. The problem is, by the time you have noticed, the easy money is gone.' },
      { type: 'quiz', question: 'Studies of mutual fund flows show that money tends to enter funds:',
        options: ['Right before they outperform', 'Right after they outperform', 'During market crashes', 'Steadily over time'], correctIndex: 1,
        explanation: 'After outperformance. Investors chase last year\'s winners. The result is buying high.' },
      { type: 'type-term', question: 'What is the four-letter acronym for the emotion that drives investors to chase rising assets?',
        hint: 'Fear of missing out', answer: 'FOMO', alternates: ['fomo'],
        explanation: 'FOMO. Fear of missing out. The most expensive emotion in investing.' },
      { type: 'quiz', question: 'What is the best antidote to FOMO?',
        options: ['Watching the market constantly', 'Following influencers', 'Having a written plan you stick to', 'Diversifying into more assets'], correctIndex: 2,
        explanation: 'A simple written plan. Process beats prediction every time.' },
      { type: 'concept', title: 'The lesson',
        body: 'You will miss things. Many things. This is the cost of having a strategy. The cost of not having one is much higher.' },
    ],
  },
];

export function getLessonById(id: string) {
  return lessons.find((l) => l.id === id);
}
