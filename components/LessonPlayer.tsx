'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { Lesson, LessonCard } from '@/lib/lessons';

type Answer = { selected: any; correct: boolean };

export function LessonPlayer({
  lesson, onComplete, onExit,
}: {
  lesson: Lesson; onComplete: () => void; onExit: () => void;
}) {
  const [cardIndex, setCardIndex] = useState(0);
  const [answered, setAnswered] = useState<Record<number, Answer>>({});

  const card = lesson.cards[cardIndex];
  const isLast = cardIndex === lesson.cards.length - 1;
  const currentAnswer = answered[cardIndex];

  const next = () => {
    if (isLast) onComplete();
    else setCardIndex(cardIndex + 1);
  };

  const setAnswer = (a: Answer) => setAnswered({ ...answered, [cardIndex]: a });

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onExit} className="text-muted hover:text-text transition-colors text-xl">✕</button>
        <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-electric to-violet"
            initial={{ width: 0 }}
            animate={{ width: `${((cardIndex + (currentAnswer ? 1 : 0)) / lesson.cards.length) * 100}%` }}
            transition={{ duration: 0.4 }} />
        </div>
        <div className="text-xs font-mono text-muted num">
          {cardIndex + 1}/{lesson.cards.length}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={cardIndex}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="w-full">
            {renderCard(card, currentAnswer, setAnswer)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8">
        {(card.type === 'concept' || currentAnswer) && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={next}
            className="shine w-full bg-text text-bg py-4 rounded-xl font-semibold transition-all hover:scale-[1.01]">
            {isLast ? `Complete · +${lesson.xpReward} XP` : 'Continue →'}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function renderCard(card: LessonCard, answer: Answer | undefined, setAnswer: (a: Answer) => void) {
  if (card.type === 'concept') {
    return (
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">{card.title}</h2>
        <p className="text-lg text-muted leading-relaxed">{card.body}</p>
      </div>
    );
  }

  if (card.type === 'quiz') {
    return <QuizCard card={card} answer={answer} setAnswer={setAnswer} />;
  }

  if (card.type === 'compare') {
    return <CompareCard card={card} answer={answer} setAnswer={setAnswer} />;
  }

  if (card.type === 'fill-blank') {
    return <FillBlankCard card={card} answer={answer} setAnswer={setAnswer} />;
  }

  if (card.type === 'order') {
    return <OrderCard card={card} answer={answer} setAnswer={setAnswer} />;
  }

  if (card.type === 'type-term') {
    return <TypeTermCard card={card} answer={answer} setAnswer={setAnswer} />;
  }

  return null;
}

function Feedback({ correct, explanation }: { correct: boolean; explanation: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`mt-5 p-4 rounded-xl border ${correct ? 'border-green/40 bg-green/10' : 'border-amber/40 bg-amber/10'}`}>
      <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: correct ? '#00E676' : '#FFB020' }}>
        {correct ? '✓ Correct' : 'Not quite'}
      </div>
      <p className="text-sm">{explanation}</p>
    </motion.div>
  );
}

function QuizCard({ card, answer, setAnswer }: { card: any; answer: Answer | undefined; setAnswer: (a: Answer) => void }) {
  const handle = (idx: number) => {
    if (answer) return;
    setAnswer({ selected: idx, correct: idx === card.correctIndex });
  };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Quiz</div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-8">{card.question}</h2>
      <div className="space-y-3">
        {card.options.map((opt: string, idx: number) => {
          const isSelected = answer?.selected === idx;
          const isCorrect = idx === card.correctIndex;
          const showState = !!answer;

          let bg = 'bg-surface border-border';
          if (showState && isSelected && answer.correct) bg = 'bg-green/15 border-green';
          else if (showState && isSelected && !answer.correct) bg = 'bg-red/15 border-red';
          else if (showState && isCorrect && !answer.correct) bg = 'bg-green/10 border-green/50';

          return (
            <button key={idx} onClick={() => handle(idx)} disabled={showState}
              className={`w-full text-left p-4 rounded-xl border transition-all ${bg} ${showState ? 'cursor-default' : 'hover:border-text/40'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center font-mono text-sm shrink-0">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1">{opt}</span>
                {showState && isSelected && answer.correct && <span className="text-green">✓</span>}
                {showState && isSelected && !answer.correct && <span className="text-red">✗</span>}
              </div>
            </button>
          );
        })}
      </div>
      {answer && <Feedback correct={answer.correct} explanation={card.explanation} />}
    </div>
  );
}

function CompareCard({ card, answer, setAnswer }: { card: any; answer: Answer | undefined; setAnswer: (a: Answer) => void }) {
  const handle = (side: 'left' | 'right') => {
    if (answer) return;
    setAnswer({ selected: side, correct: side === card.correct });
  };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Pick one</div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-8">{card.question}</h2>
      <div className="grid grid-cols-2 gap-3">
        {(['left', 'right'] as const).map((side) => {
          const data = card[side];
          const isSelected = answer?.selected === side;
          const isCorrect = side === card.correct;
          const showState = !!answer;

          let bg = 'bg-surface border-border';
          if (showState && isSelected && answer.correct) bg = 'bg-green/15 border-green';
          else if (showState && isSelected && !answer.correct) bg = 'bg-red/15 border-red';
          else if (showState && isCorrect && !answer.correct) bg = 'bg-green/10 border-green/50';

          return (
            <button key={side} onClick={() => handle(side)} disabled={showState}
              className={`p-5 rounded-xl border transition-all ${bg} ${showState ? 'cursor-default' : 'hover:border-text/40'}`}>
              <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">{data.label}</div>
              <div className="font-semibold text-lg">{data.value}</div>
            </button>
          );
        })}
      </div>
      {answer && <Feedback correct={answer.correct} explanation={card.explanation} />}
    </div>
  );
}

function FillBlankCard({ card, answer, setAnswer }: { card: any; answer: Answer | undefined; setAnswer: (a: Answer) => void }) {
  const [input, setInput] = useState('');

  const submit = () => {
    if (answer || !input.trim()) return;
    const cleaned = input.trim().toLowerCase();
    const correct = cleaned === card.answer.toLowerCase() ||
      (card.alternates || []).some((alt: string) => alt.toLowerCase() === cleaned);
    setAnswer({ selected: input, correct });
  };

  const parts = card.sentence.split('_____');

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Fill the blank</div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-8">{card.question}</h2>
      <div className="bg-surface border border-border rounded-xl p-6 mb-4">
        <div className="text-lg leading-relaxed">
          {parts[0]}
          <span className="inline-block min-w-[100px] mx-1">
            <input
              type="text"
              value={answer ? answer.selected : input}
              onChange={(e) => !answer && setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              disabled={!!answer}
              autoFocus
              placeholder="..."
              className={`bg-elevated border-b-2 px-2 py-1 outline-none transition-colors w-full text-center font-semibold ${
                answer
                  ? answer.correct
                    ? 'border-green text-green'
                    : 'border-red text-red'
                  : 'border-violet focus:border-electric'
              }`}
            />
          </span>
          {parts[1]}
        </div>
      </div>
      {!answer && (
        <button onClick={submit} disabled={!input.trim()}
          className="w-full bg-violet text-bg py-3 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.01]">
          Check
        </button>
      )}
      {answer && (
        <div>
          {!answer.correct && (
            <div className="text-sm text-muted mb-2">
              Answer: <span className="text-text font-semibold">{card.answer}</span>
            </div>
          )}
          <Feedback correct={answer.correct} explanation={card.explanation} />
        </div>
      )}
    </div>
  );
}

function OrderCard({ card, answer, setAnswer }: { card: any; answer: Answer | undefined; setAnswer: (a: Answer) => void }) {
  // Items start in shuffled order; user reorders them.
  // We shuffle once on mount using a simple deterministic shuffle so it stays stable.
  const [items, setItems] = useState<Array<{ id: number; label: string }>>(() => {
    const indices = card.items.map((_: any, i: number) => i);
    // Reverse for predictable shuffle (simple but effective)
    const shuffled = [...indices].reverse();
    return shuffled.map((i) => ({ id: i, label: card.items[i] }));
  });

  const submit = () => {
    if (answer) return;
    const userOrder = items.map((it) => it.id);
    const correct = JSON.stringify(userOrder) === JSON.stringify(card.correctOrder);
    setAnswer({ selected: userOrder, correct });
  };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Drag to order</div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-8">{card.question}</h2>
      <Reorder.Group axis="y" values={items} onReorder={(v) => !answer && setItems(v)} className="space-y-2 mb-4">
        {items.map((item, idx) => {
          const correctPosition = card.correctOrder.indexOf(item.id);
          const isInCorrectPosition = correctPosition === idx;
          const showState = !!answer;

          let bg = 'bg-surface border-border';
          if (showState) {
            bg = isInCorrectPosition ? 'bg-green/10 border-green/50' : 'bg-red/10 border-red/50';
          }

          return (
            <Reorder.Item key={item.id} value={item}
              className={`p-4 rounded-xl border ${bg} ${answer ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} transition-colors`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted">{idx + 1}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-muted">⋮⋮</span>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      {!answer && (
        <button onClick={submit}
          className="w-full bg-violet text-bg py-3 rounded-xl font-semibold transition-all hover:scale-[1.01]">
          Check
        </button>
      )}
      {answer && <Feedback correct={answer.correct} explanation={card.explanation} />}
    </div>
  );
}

function TypeTermCard({ card, answer, setAnswer }: { card: any; answer: Answer | undefined; setAnswer: (a: Answer) => void }) {
  const [input, setInput] = useState('');

  const submit = () => {
    if (answer || !input.trim()) return;
    const cleaned = input.trim().toLowerCase();
    const correct = cleaned === card.answer.toLowerCase() ||
      (card.alternates || []).some((alt: string) => alt.toLowerCase() === cleaned);
    setAnswer({ selected: input, correct });
  };

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">Type the term</div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight mb-4">{card.question}</h2>
      {card.hint && <p className="text-muted mb-6 text-sm italic">Hint: {card.hint}</p>}
      <input
        type="text"
        value={answer ? answer.selected : input}
        onChange={(e) => !answer && setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        disabled={!!answer}
        autoFocus
        placeholder="Your answer..."
        className={`w-full bg-surface border-2 rounded-xl px-5 py-4 text-lg outline-none transition-colors mb-4 ${
          answer
            ? answer.correct
              ? 'border-green text-green'
              : 'border-red text-red'
            : 'border-border focus:border-violet'
        }`}
      />
      {!answer && (
        <button onClick={submit} disabled={!input.trim()}
          className="w-full bg-violet text-bg py-3 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.01]">
          Check
        </button>
      )}
      {answer && (
        <div>
          {!answer.correct && (
            <div className="text-sm text-muted mb-2">
              Answer: <span className="text-text font-semibold">{card.answer}</span>
            </div>
          )}
          <Feedback correct={answer.correct} explanation={card.explanation} />
        </div>
      )}
    </div>
  );
}
