import { useState } from 'react';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/curriculum';

export function ConceptQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] px-5 py-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--art-ink)]">
          <HelpCircle className="h-4 w-4 text-[var(--art-accent)]" />
          <span>理性认知自测（共 {QUIZ_QUESTIONS.length} 题）</span>
        </div>
        <div className="font-mono text-xs text-[var(--art-muted)]">
          已作答 {answeredCount}/{QUIZ_QUESTIONS.length} · 正确{' '}
          <span className="font-bold text-[var(--art-accent)]">{correctCount}</span>
        </div>
      </div>

      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q, qIdx) => {
          const picked = answers[q.id];
          const hasPicked = picked !== undefined;
          const isCorrect = picked === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-5 shadow-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--art-tint)] font-mono text-xs font-bold text-[var(--art-accent)]">
                  {qIdx + 1}
                </span>
                <h4 className="text-sm font-semibold leading-relaxed text-[var(--art-ink)]">
                  {q.question}
                </h4>
              </div>

              <div className="mt-3.5 grid gap-2 pl-7">
                {q.options.map((opt, optIdx) => {
                  const chosen = picked === optIdx;
                  const right = optIdx === q.correctIndex;

                  let style =
                    'border-[var(--art-line)] bg-[var(--art-page)]/60 text-[var(--art-ink)] hover:border-[var(--art-accent)]/60';
                  if (hasPicked) {
                    if (right) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                    } else if (chosen) {
                      style = 'border-rose-400 bg-rose-50 text-rose-900';
                    } else {
                      style = 'border-[var(--art-line)] bg-[var(--art-page)]/30 text-[var(--art-muted)] opacity-75';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={`flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-left text-xs leading-relaxed transition-all ${style}`}
                    >
                      <span>{opt}</span>
                      {hasPicked && right && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      )}
                      {hasPicked && chosen && !right && (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {hasPicked && (
                <div
                  className={`mt-3 ml-7 rounded-lg border px-3.5 py-2.5 text-xs leading-relaxed ${
                    isCorrect
                      ? 'border-emerald-200 bg-[var(--art-tint)] text-[var(--art-ink)]'
                      : 'border-amber-200 bg-amber-50/70 text-[var(--art-ink)]'
                  }`}
                >
                  <strong
                    className={
                      isCorrect ? 'text-[var(--art-accent)]' : 'text-[var(--art-terracotta)]'
                    }
                  >
                    {isCorrect ? '回答正确 · 解析：' : '解析：'}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
