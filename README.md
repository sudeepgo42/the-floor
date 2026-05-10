# The Floor — v0.4

Built around the user feedback. What landed and what intentionally did not.

## What is new

**Tab navigation**
Bottom bar on mobile, side rail on desktop. Four tabs: Home, Lessons, Simulator, Profile. State persists per tab. No more "back to home" buttons cluttering up the flow.

**Home redesign**
Tab home is now a real dashboard. Greeting, stats, level progress, daily quest, and "pick up where you left off" cards that surface the next uncompleted lesson and scenario. Less scroll, more direct.

**Profile page**
Editable name, goal, and skill level. Stats grid. Level ladder showing all five tiers with the current one highlighted. Badge collection. A simple activity heatmap showing the last 35 days. Reset progress lives here too, not in the home footer.

**3 new lesson mechanics**
- Fill the blank: complete a sentence by typing the missing word
- Type the term: free-text answer with hints
- Drag to order: reorder cards into the correct sequence

Existing concept, quiz, and compare cards still work. Lessons now mix mechanics across cards so completing one feels less repetitive than v0.3.

**3 new "interpretation" lessons**
- Reading a price chart
- P/E ratios in plain English
- (and the existing dividends lesson now uses the new mechanics)

These are the bridge content between Foundations and Mastery, addressing the "more beginner stuff like earnings, reports" feedback without sliding into Mastery-level material that would overwhelm beginners.

**11 lessons total** (up from 9), 9 scenarios (unchanged).

## Deliberately not built

**Social features (leagues, follow, groups).** Strong opinion: this is the wrong direction for a finance education product. Leagues incentivise rushing through lessons, which is the opposite of what we want for thoughtful investors. Public profiles and follow systems turn a learning app into a performance-of-investing app, the same dynamic that gave Robinhood its cultural reputation. We can revisit a private "share with one friend" version if retention data shows it is needed, but adding public social would unwind the brand position we built into the teardown.

If the product is ever proven to need a social layer for retention, the right shape is private accountability (one buddy, see each other's completions) rather than public competition. Saving that for later.

## Stack

Same as v3. Next.js 14, Tailwind, Framer Motion, Recharts, TypeScript, localStorage. Now also using Framer Motion's Reorder for drag-to-order lesson cards.

## Deploy

Files are at the root of the zip. Same drill as before:

1. Unzip
2. Push to your GitHub repo (drag contents, not folder)
3. Vercel: Root Directory empty, Framework Preset Next.js. Auto-deploys.

## What to watch in feedback

The new lesson mechanics are the riskiest change. Watch for:
- Do users finish lessons that include drag-to-order or fill-the-blank, or do they bail?
- Does free-text typing feel rewarding when correct, or annoying when it marks them wrong over a typo?
- Does the variety of mechanics make lessons feel fresher, or just more confusing?

The Profile page is the easy win. Watch for:
- Do users actually visit Profile (not just see it in the nav)?
- Does the activity heatmap motivate the streak behaviour?

The bottom nav is the highest-impact change. Watch for:
- Time-to-second-action: how long from landing to opening a second lesson/scenario? Should be much shorter than v3.
- Lesson-to-simulator cross-traffic: do users now flip between the two?

## Known limitations

- Activity heatmap approximates active days from the streak, not real per-day tracking. Cosmetic for now.
- Reset progress requires a confirm dialog instead of being a one-click button. Intentional, but worth flagging.
- Free-text answers in the new mechanics are checked against a small list of accepted answers. Not fuzzy-matched. Some legitimate near-answers may be marked wrong.
