import { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import { PROOF_EXAMPLES } from '../data/examples';
import { Math as MathFormula } from './Math';

interface ProofWorkshopProps {
  completedIds: string[];
  onCompleteExample: (id: string) => void;
}

export function ProofWorkshop({ completedIds, onCompleteExample }: ProofWorkshopProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [showTermMode, setShowTermMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const example = PROOF_EXAMPLES[selectedIdx];
  const currentStep = example.proofSteps[stepIdx] ?? example.proofSteps[0];
  const isFinished = currentStep.goals.length === 0;

  useEffect(() => {
    setStepIdx(0);
    setShowTermMode(false);
    setCopied(false);
  }, [selectedIdx]);

  useEffect(() => {
    if (isFinished) {
      onCompleteExample(example.id);
    }
  }, [isFinished, example.id, onCompleteExample]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.fullLeanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard permission unavailable
    }
  };

  const leanLiveUrl = `https://live.lean-lang.org/#code=${encodeURIComponent(
    example.fullLeanCode
  )}`;

  const difficultyBadge = (diff: string) => {
    switch (diff) {
      case '入门':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case '基础':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case '进阶':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-orange-50 text-orange-900 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Level selector strip */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {PROOF_EXAMPLES.map((ex, idx) => {
          const active = idx === selectedIdx;
          const done = completedIds.includes(ex.id);
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                active
                  ? 'border-[var(--art-accent)] bg-[var(--art-tint)]/75 ring-1 ring-[var(--art-accent)]'
                  : 'border-[var(--art-line)] bg-[var(--art-surface)] hover:border-[var(--art-accent)]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[var(--art-accent)]">
                  例 {ex.level}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${difficultyBadge(
                      ex.difficulty
                    )}`}
                  >
                    {ex.difficulty}
                  </span>
                  {done && <CheckCircle2 className="h-4 w-4 text-[var(--art-accent)]" />}
                </div>
              </div>
              <div className="mt-1.5 font-display text-sm font-semibold text-[var(--art-ink)]">
                {ex.title}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {ex.concepts.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="rounded bg-[var(--art-page)] px-1.5 py-0.5 text-[10px] text-[var(--art-muted)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Example Container */}
      <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] shadow-xs">
        {/* Header */}
        <div className="border-b border-[var(--art-line)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[var(--art-accent)] px-2.5 py-0.5 font-mono text-xs font-semibold text-white">
                EXAMPLE 0{example.level}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyBadge(
                  example.difficulty
                )}`}
              >
                {example.difficulty}
              </span>
              {example.concepts.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--art-line)] bg-[var(--art-page)] px-2.5 py-0.5 text-xs text-[var(--art-muted)]"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--art-line)] bg-[var(--art-page)] px-3 py-1.5 text-xs font-medium text-[var(--art-ink)] transition-colors hover:border-[var(--art-accent)]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    已复制代码
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    复制完整 Lean 代码
                  </>
                )}
              </button>
              <a
                href={leanLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--art-accent)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--art-accent-hover)]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                在 Lean 4 Live 中真机编译
              </a>
            </div>
          </div>

          <h3 className="mt-3 font-display text-2xl font-bold text-[var(--art-ink)]">
            {example.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--art-muted)]">{example.subtitle}</p>

          {/* Math statement box */}
          <div className="mt-4 rounded-lg border border-[var(--art-line)] bg-[var(--art-page)] p-4">
            <div className="text-xs font-semibold tracking-wide text-[var(--art-accent)] uppercase">
              待证命题 · Proposition
            </div>
            <MathFormula tex={example.mathStatementLatex} display />
            <p className="text-center text-sm text-[var(--art-ink)]">{example.plainStatement}</p>
          </div>
        </div>

        {/* Layer 1: Natural language proof vs hidden leaps */}
        <div className="grid gap-6 border-b border-[var(--art-line)] p-5 sm:p-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--art-ink)]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-tint)] font-mono text-xs text-[var(--art-accent)]">
                1
              </span>
              先看传统自然语言证明（人类视角）
            </h4>
            <ol className="mt-3 space-y-2 pl-5 text-sm leading-relaxed text-[var(--art-ink)] list-decimal">
              {example.naturalProof.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--art-terracotta)]">
              <Lightbulb className="h-4 w-4" />
              人类跳过、但机器绝不放过的隐含前提
            </h4>
            <div className="mt-3 space-y-2.5">
              {example.naturalProof.hiddenLeaps.map((leap, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-orange-200/80 bg-[var(--art-terracotta-tint)]/70 p-3 text-xs leading-relaxed"
                >
                  <div className="font-semibold text-[var(--art-terracotta)]">
                    人话略过：{leap.humanSays}
                  </div>
                  <div className="mt-1 text-[var(--art-ink)]">
                    <strong>机器要求：</strong>
                    {leap.machineRequires}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Layer 2: Interactive Proof Stepper (Simulated Lean Infoview) */}
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--art-ink)]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-tint)] font-mono text-xs text-[var(--art-accent)]">
                  2
                </span>
                交互式单步推演（模拟 VS Code Lean Infoview）
              </h4>
              <p className="mt-0.5 text-xs text-[var(--art-muted)]">
                点击左侧带高亮标记的代码行，或使用“上一步 / 下一步”按钮观察右侧证明状态如何实时坍缩。
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStepIdx(0)}
                disabled={stepIdx === 0}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--art-line)] bg-[var(--art-page)] px-2.5 py-1.5 text-xs text-[var(--art-ink)] disabled:opacity-40"
                title="回到起点"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                disabled={stepIdx === 0}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--art-line)] bg-[var(--art-page)] px-3 py-1.5 text-xs font-medium text-[var(--art-ink)] hover:border-[var(--art-accent)] disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                上一步
              </button>
              <span className="px-2 font-mono text-xs font-semibold text-[var(--art-muted)]">
                {stepIdx + 1} / {example.proofSteps.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setStepIdx((i) => Math.min(example.proofSteps.length - 1, i + 1))
                }
                disabled={stepIdx === example.proofSteps.length - 1}
                className="inline-flex items-center gap-1 rounded-md bg-[var(--art-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--art-accent-hover)] disabled:opacity-40"
              >
                下一步
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div
            className="grid overflow-hidden rounded-xl border border-[var(--art-slate-border)] bg-[var(--art-slate)] lg:grid-cols-12 focus:outline-none focus:ring-2 focus:ring-[var(--art-accent)]"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setStepIdx((i) => Math.max(0, i - 1));
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setStepIdx((i) => Math.min(example.proofSteps.length - 1, i + 1));
              }
            }}
          >
            {/* Left: Lean 4 Source Lines */}
            <div className="border-b border-[var(--art-slate-border)] p-4 lg:col-span-6 lg:border-r lg:border-b-0">
              <div className="mb-2.5 flex items-center justify-between text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                  Lean 4 源码（点击可跳转步数）
                </span>
                <span className="font-mono text-emerald-400/90">Init Only</span>
              </div>
              <div className="slate-scroll overflow-x-auto font-mono text-xs leading-6">
                {example.codeLines.map((line, i) => {
                  const lineNo = i + 1;
                  const matchingStepIdx = example.proofSteps.findIndex(
                    (s) => s.lineNumber === lineNo
                  );
                  const isCurrentLine = currentStep.lineNumber === lineNo;
                  const isInteractive = matchingStepIdx !== -1;

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (isInteractive) setStepIdx(matchingStepIdx);
                      }}
                      className={`flex items-start gap-3 rounded px-2 py-0.5 transition-colors ${
                        isCurrentLine
                          ? 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/40'
                          : isInteractive
                            ? 'cursor-pointer text-slate-200 hover:bg-slate-800/80'
                            : 'text-slate-400'
                      }`}
                    >
                      <span className="w-5 shrink-0 select-none text-right text-[11px] text-slate-500">
                        {lineNo}
                      </span>
                      <pre className="whitespace-pre font-mono">
                        {line || ' '}
                      </pre>
                      {isInteractive && (
                        <span
                          className={`ml-auto shrink-0 self-center rounded px-1.5 py-0.5 text-[10px] ${
                            isCurrentLine
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          步 {matchingStepIdx + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Simulated Lean Infoview */}
            <div className="flex flex-col justify-between bg-[#141d22] p-4 lg:col-span-6">
              <div>
                <div className="mb-3 flex items-center justify-between border-b border-[var(--art-slate-border)] pb-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
                    <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                    Lean Infoview · 证明状态面板
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                    {currentStep.tacticLabel}
                  </span>
                </div>

                {/* Hypotheses */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="text-[11px] font-semibold text-slate-400">
                    上下文已知条件 (Context / Hypotheses)
                  </div>
                  {currentStep.hypotheses.length === 0 ? (
                    <div className="text-slate-500 italic">（当前分支无需额外假设）</div>
                  ) : (
                    <div className="space-y-1 rounded-md bg-[var(--art-slate)] p-2.5">
                      {currentStep.hypotheses.map((h, idx) => (
                        <div
                          key={`${h.name}-${idx}`}
                          className={`flex items-baseline gap-2 rounded px-1.5 py-0.5 ${
                            h.isNew ? 'bg-emerald-500/15 text-emerald-200' : 'text-slate-200'
                          }`}
                        >
                          <span className="font-semibold text-sky-300">{h.name}</span>
                          <span className="text-slate-500">:</span>
                          <span>{h.type}</span>
                          {h.isNew && (
                            <span className="ml-auto rounded bg-emerald-500/20 px-1.5 text-[10px] text-emerald-300">
                              新增
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Goals */}
                <div className="mt-4 space-y-1.5 font-mono text-xs">
                  <div className="text-[11px] font-semibold text-slate-400">
                    待证目标 (Goals)
                  </div>
                  {isFinished ? (
                    <div className="flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/15 p-3 text-emerald-200">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <div>
                        <div className="font-semibold">No goals!（所有目标已清零）</div>
                        <div className="mt-0.5 font-sans text-[11px] text-emerald-200/80">
                          内核已验收通过，定理写入可信环境。
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {currentStep.goals.map((g, idx) => (
                        <div
                          key={idx}
                          className="flex items-baseline gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-100"
                        >
                          <span className="font-bold text-amber-400">⊢</span>
                          <span>{g}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step Explanation inside panel */}
              <div className="mt-4 rounded-lg border border-[var(--art-slate-border)] bg-[var(--art-slate-2)] p-3.5 text-xs leading-relaxed text-slate-200">
                <div className="font-semibold text-emerald-300">
                  状态变化：{currentStep.changedNote}
                </div>
                <div className="mt-1.5 text-sky-200">
                  <strong>对应人话：</strong>
                  {currentStep.naturalCorrespondence}
                </div>
                <div className="mt-1.5 text-slate-300">
                  <strong>机械逻辑：</strong>
                  {currentStep.rationale}
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: Toggleable Underlying Proof Term */}
          <div className="mt-4 rounded-lg border border-[var(--art-line)] bg-[var(--art-page)]">
            <button
              type="button"
              onClick={() => setShowTermMode((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-semibold text-[var(--art-ink)] hover:bg-[var(--art-tint)]/50"
            >
              <span className="flex items-center gap-2">
                {showTermMode ? (
                  <EyeOff className="h-4 w-4 text-[var(--art-accent)]" />
                ) : (
                  <Eye className="h-4 w-4 text-[var(--art-accent)]" />
                )}
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--art-tint)] font-mono text-xs text-[var(--art-accent)]">
                  3
                </span>
                展开编译底层：内核实际校验的纯 λ 证明项 (Proof Term)
              </span>
              <span className="text-[var(--art-accent)]">
                {showTermMode ? '收起' : '透视内核视角'}
              </span>
            </button>

            {showTermMode && (
              <div className="space-y-3 border-t border-[var(--art-line)] p-4">
                <pre className="overflow-x-auto rounded-md border border-[var(--art-slate-border)] bg-[var(--art-slate)] p-3 font-mono text-xs leading-relaxed text-emerald-100">
                  {example.termMode.code}
                </pre>
                <p className="text-xs leading-relaxed text-[var(--art-ink)]">
                  {example.termMode.explanation}
                </p>
                <div className="space-y-1 rounded-md bg-[var(--art-surface)] p-3 text-xs text-[var(--art-muted)] border border-[var(--art-line)]">
                  <div className="font-semibold text-[var(--art-ink)]">
                    Kernel 类型检查逐行追踪：
                  </div>
                  {example.termMode.typeCheckTrace.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono text-[var(--art-accent)]">[{i + 1}]</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
