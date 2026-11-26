import { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Undo2,
} from 'lucide-react';

interface GoalFrame {
  label?: string;
  localHyps: { name: string; type: string }[];
  target: string;
}

interface SandboxState {
  goals: GoalFrame[];
  history: string[];
  error: string | null;
}

interface SandboxLevel {
  id: string;
  title: string;
  signature: string;
  description: string;
  hint: string;
  solution: string[];
  chips: string[];
  initialGoals: GoalFrame[];
  applyTactic: (state: SandboxState, rawTactic: string) => SandboxState;
}

function makeInitialState(level: SandboxLevel): SandboxState {
  return {
    goals: level.initialGoals.map((g) => ({
      ...g,
      localHyps: [...g.localHyps],
    })),
    history: [],
    error: null,
  };
}

const SANDBOX_LEVELS: SandboxLevel[] = [
  {
    id: 'sandbox-1',
    title: '第 1 关 · 常函数即 K 组合子 (P → Q → P)',
    signature: 'theorem ex1 (P Q : Prop) : P → Q → P := by',
    description:
      '给定命题 P 和 Q，证明“若 P 成立，则只要 Q 成立，P 依然成立”。提示：依次引入两个前提，再精确提交证据。',
    hint: '依次使用 `intro hp`、`intro hq`，最后用 `exact hp` 交出 P 的证据。',
    solution: ['intro hp', 'intro hq', 'exact hp'],
    chips: ['intro hp', 'intro hq', 'exact hp', 'exact hq'],
    initialGoals: [
      {
        localHyps: [{ name: 'P Q', type: 'Prop' }],
        target: 'P → Q → P',
      },
    ],
    applyTactic: (state, rawTactic) => {
      const cmd = rawTactic.trim();
      if (state.goals.length === 0) return state;
      const [top, ...rest] = state.goals;

      if (cmd.startsWith('intro ')) {
        const varName = cmd.slice('intro '.length).trim();
        if (!varName || /\s/.test(varName)) {
          return { ...state, error: '语法提示：请写单个变量名，例如 `intro hp` 。' };
        }
        if (top.target === 'P → Q → P') {
          return {
            goals: [
              {
                ...top,
                localHyps: [...top.localHyps, { name: varName, type: 'P' }],
                target: 'Q → P',
              },
              ...rest,
            ],
            history: [...state.history, cmd],
            error: null,
          };
        }
        if (top.target === 'Q → P') {
          return {
            goals: [
              {
                ...top,
                localHyps: [...top.localHyps, { name: varName, type: 'Q' }],
                target: 'P',
              },
              ...rest,
            ],
            history: [...state.history, cmd],
            error: null,
          };
        }
        return {
          ...state,
          error: `无法应用 intro：当前目标 \`${top.target}\` 不是 \`A → B\` 的蕴含形式。`,
        };
      }

      if (cmd.startsWith('exact ')) {
        const ref = cmd.slice('exact '.length).trim();
        const found = top.localHyps.find((h) => h.name === ref);
        if (!found) {
          return {
            ...state,
            error: `unknown identifier '${ref}'：上下文中没有名为 ${ref} 的前提。`,
          };
        }
        if (found.type !== top.target) {
          return {
            ...state,
            error: `type mismatch: '${ref}' has type ${found.type}, but goal expects ${top.target}`,
          };
        }
        return {
          goals: rest,
          history: [...state.history, cmd],
          error: null,
        };
      }

      return {
        ...state,
        error: `未知或不适用策略 '${cmd}'。试试点击下方提示词，或输入 intro / exact。`,
      };
    },
  },
  {
    id: 'sandbox-2',
    title: '第 2 关 · 拆解并重装合取式 (P ∧ Q → Q ∧ P)',
    signature: 'theorem ex2 (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by',
    description:
      '动手操作一遍合取交换律：先拆开盒子 `h`，再用 `constructor` 裂变成两个子目标，最后逐一填满。',
    hint: '步骤：`cases h` → `constructor` → `exact hq` → `exact hp`。',
    solution: ['cases h', 'constructor', 'exact hq', 'exact hp'],
    chips: ['cases h', 'constructor', 'exact hq', 'exact hp'],
    initialGoals: [
      {
        localHyps: [
          { name: 'P Q', type: 'Prop' },
          { name: 'h', type: 'P ∧ Q' },
        ],
        target: 'Q ∧ P',
      },
    ],
    applyTactic: (state, rawTactic) => {
      const cmd = rawTactic.trim();
      if (state.goals.length === 0) return state;
      const [top, ...rest] = state.goals;

      if (cmd === 'cases h' || cmd.startsWith('cases h with')) {
        const hasH = top.localHyps.some((h) => h.name === 'h' && h.type === 'P ∧ Q');
        if (!hasH) {
          return { ...state, error: '前提 h : P ∧ Q 已经被拆解过了！' };
        }
        const filtered = top.localHyps.filter((h) => h.name !== 'h');
        return {
          goals: [
            {
              ...top,
              localHyps: [
                ...filtered,
                { name: 'hp', type: 'P' },
                { name: 'hq', type: 'Q' },
              ],
            },
            ...rest,
          ],
          history: [...state.history, 'cases h with | intro hp hq =>'],
          error: null,
        };
      }

      if (cmd === 'constructor') {
        if (top.target !== 'Q ∧ P') {
          return {
            ...state,
            error: `当前目标 '${top.target}' 不是合取类型 (∧)，不能用 constructor 拆分。`,
          };
        }
        return {
          goals: [
            { label: '左子目标', localHyps: [...top.localHyps], target: 'Q' },
            { label: '右子目标', localHyps: [...top.localHyps], target: 'P' },
            ...rest,
          ],
          history: [...state.history, 'constructor'],
          error: null,
        };
      }

      if (cmd.startsWith('exact ')) {
        const ref = cmd.slice('exact '.length).trim();
        const found = top.localHyps.find((h) => h.name === ref);
        if (!found) {
          return {
            ...state,
            error: `unknown identifier '${ref}'（如果还没拆开 h，请先运行 cases h）。`,
          };
        }
        if (found.type !== top.target) {
          return {
            ...state,
            error: `type mismatch: '${ref}' 的类型是 ${found.type}，但当前第一个目标要求 ${top.target}！`,
          };
        }
        return {
          goals: rest,
          history: [...state.history, cmd],
          error: null,
        };
      }

      return {
        ...state,
        error: `未知或不适用策略 '${cmd}'。当前可用：cases h / constructor / exact ...`,
      };
    },
  },
  {
    id: 'sandbox-3',
    title: '第 3 关 · 亲手用数学归纳法证明 0 + n = n',
    signature: 'theorem ex3 (n : Nat) : 0 + n = n := by',
    description:
      '试着先直接点 `rfl` 看看内核怎么拒绝你！然后再用 `induction n` 进入基础步与归纳步完成证明。',
    hint: '步骤：`induction n` → `rfl`（闭合 zero 分支）→ `rw [Nat.add_succ]` → `rw [ih]`。',
    solution: ['induction n', 'rfl', 'rw [Nat.add_succ]', 'rw [ih]'],
    chips: ['rfl', 'induction n', 'rw [Nat.add_succ]', 'rw [ih]'],
    initialGoals: [
      {
        localHyps: [{ name: 'n', type: 'Nat' }],
        target: '0 + n = n',
      },
    ],
    applyTactic: (state, rawTactic) => {
      const cmd = rawTactic.trim();
      if (state.goals.length === 0) return state;
      const [top, ...rest] = state.goals;

      if (cmd === 'rfl') {
        if (top.target === '0 + 0 = 0' || top.target === 'k + 1 = k + 1') {
          return {
            goals: rest,
            history: [...state.history, 'rfl'],
            error: null,
          };
        }
        if (top.target === '0 + n = n') {
          return {
            ...state,
            error:
              "error: tactic 'rfl' failed — 0 + n 与 n 不是定义相等（加法对右参数递归，右边的 n 未知），请先使用 induction n！",
          };
        }
        return {
          ...state,
          error: `error: tactic 'rfl' failed — 左右两边 '${top.target}' 尚不能直接按定义归约成相同形式。`,
        };
      }

      if (cmd === 'induction n' || cmd.startsWith('induction n with')) {
        if (top.target !== '0 + n = n') {
          return { ...state, error: '已经对 n 做过归纳分叉了！' };
        }
        return {
          goals: [
            {
              label: 'case zero',
              localHyps: [],
              target: '0 + 0 = 0',
            },
            {
              label: 'case succ',
              localHyps: [
                { name: 'k', type: 'Nat' },
                { name: 'ih', type: '0 + k = k' },
              ],
              target: '0 + (k + 1) = k + 1',
            },
            ...rest,
          ],
          history: [...state.history, 'induction n with | zero => ... | succ k ih => ...'],
          error: null,
        };
      }

      if (cmd === 'rw [Nat.add_succ]') {
        if (top.target !== '0 + (k + 1) = k + 1') {
          return {
            ...state,
            error: `当前目标 '${top.target}' 中没有出现形如 a + (b + 1) 的可展开项。`,
          };
        }
        return {
          goals: [{ ...top, target: '(0 + k) + 1 = k + 1' }, ...rest],
          history: [...state.history, 'rw [Nat.add_succ]'],
          error: null,
        };
      }

      if (cmd === 'rw [ih]') {
        if (top.target === '0 + (k + 1) = k + 1') {
          return {
            ...state,
            error:
              "did not find pattern '0 + k' in '0 + (k + 1) = k + 1' — 请先用 rw [Nat.add_succ] 把括号里的 + 1 剥出来！",
          };
        }
        if (top.target === '(0 + k) + 1 = k + 1') {
          return {
            goals: rest,
            history: [...state.history, 'rw [ih]'],
            error: null,
          };
        }
        return {
          ...state,
          error: '当前上下文中没有可供替换的归纳假设 ih。',
        };
      }

      return {
        ...state,
        error: `未知或不适用策略 '${cmd}'。试试 rfl / induction n / rw [Nat.add_succ] / rw [ih]。`,
      };
    },
  },
];

interface MiniProofSandboxProps {
  completedIds: string[];
  onCompleteSandbox: (id: string) => void;
}

export function MiniProofSandbox({
  completedIds,
  onCompleteSandbox,
}: MiniProofSandboxProps) {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = SANDBOX_LEVELS[levelIdx];

  const [states, setStates] = useState<Record<string, SandboxState>>(() => {
    const init: Record<string, SandboxState> = {};
    for (const lv of SANDBOX_LEVELS) {
      init[lv.id] = makeInitialState(lv);
    }
    return init;
  });
  const [undoStack, setUndoStack] = useState<Record<string, SandboxState[]>>({});
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const currentState = states[level.id];
  const solved = currentState.goals.length === 0;

  const runTactic = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || solved) return;

    const next = level.applyTactic(currentState, trimmed);
    if (!next.error) {
      setUndoStack((prev) => ({
        ...prev,
        [level.id]: [...(prev[level.id] ?? []), currentState],
      }));
      if (next.goals.length === 0) {
        onCompleteSandbox(level.id);
      }
      setInput('');
    }
    setStates((prev) => ({ ...prev, [level.id]: next }));
  };

  const handleUndo = () => {
    const stack = undoStack[level.id] ?? [];
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    setUndoStack((u) => ({ ...u, [level.id]: stack.slice(0, -1) }));
    setStates((s) => ({ ...s, [level.id]: prev }));
  };

  const handleReset = () => {
    setUndoStack((u) => ({ ...u, [level.id]: [] }));
    setStates((s) => ({ ...s, [level.id]: makeInitialState(level) }));
    setInput('');
  };

  const handleAutoSolve = () => {
    let st = makeInitialState(level);
    const stack: SandboxState[] = [];
    for (const step of level.solution) {
      stack.push(st);
      st = level.applyTactic(st, step);
    }
    setUndoStack((u) => ({ ...u, [level.id]: stack }));
    setStates((s) => ({ ...s, [level.id]: st }));
    if (st.goals.length === 0) {
      onCompleteSandbox(level.id);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] shadow-xs">
      {/* Level tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--art-line)] px-5 py-3.5">
        <div className="flex flex-wrap gap-2">
          {SANDBOX_LEVELS.map((lv, idx) => {
            const active = idx === levelIdx;
            const done = completedIds.includes(lv.id);
            return (
              <button
                key={lv.id}
                type="button"
                onClick={() => {
                  setLevelIdx(idx);
                  setShowHint(false);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'border-[var(--art-accent)] bg-[var(--art-tint)] text-[var(--art-accent)]'
                    : 'border-[var(--art-line)] bg-[var(--art-page)] text-[var(--art-muted)] hover:text-[var(--art-ink)]'
                }`}
              >
                {done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                <span>第 {idx + 1} 关</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--art-line)] bg-[var(--art-page)] px-2.5 py-1 text-xs text-[var(--art-ink)] hover:border-[var(--art-accent)]"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[var(--art-accent)]" />
            {showHint ? '隐藏提示' : '给我提示'}
          </button>
          <button
            type="button"
            onClick={handleAutoSolve}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--art-line)] bg-[var(--art-page)] px-2.5 py-1 text-xs text-[var(--art-muted)] hover:text-[var(--art-ink)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            演示标准答案
          </button>
        </div>
      </div>

      <div className="p-5">
        <h4 className="font-display text-lg font-bold text-[var(--art-ink)]">{level.title}</h4>
        <p className="mt-1 text-sm text-[var(--art-muted)]">{level.description}</p>

        {showHint && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-[var(--art-tint)] px-3.5 py-2.5 text-xs text-[var(--art-accent)]">
            <strong>通关提示：</strong>
            {level.hint}
          </div>
        )}

        {/* Interactive Console */}
        <div className="mt-4 grid overflow-hidden rounded-xl border border-[var(--art-slate-border)] bg-[var(--art-slate)] lg:grid-cols-12">
          {/* Left: Script & Input */}
          <div className="flex flex-col justify-between border-b border-[var(--art-slate-border)] p-4 lg:col-span-6 lg:border-r lg:border-b-0">
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase">
                <span>你的证明脚本</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={(undoStack[level.id]?.length ?? 0) === 0}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white disabled:opacity-35"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    撤销
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    重置
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-[#141d22] p-3 font-mono text-xs leading-6 text-slate-200">
                <div className="text-emerald-300">{level.signature}</div>
                {currentState.history.map((h, i) => (
                  <div key={i} className="pl-4 text-slate-100">
                    {h}
                  </div>
                ))}
                {!solved && (
                  <div className="pl-4 text-amber-300/80 animate-pulse">
                    {'  -- 等待你的下一步 tactic ...'}
                  </div>
                )}
              </div>

              {currentState.error && (
                <div className="mt-3 rounded-md border border-rose-500/40 bg-rose-950/60 p-2.5 font-mono text-xs text-rose-200">
                  {currentState.error}
                </div>
              )}
            </div>

            {/* Command input + chips */}
            <div className="mt-4 space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {level.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={solved}
                    onClick={() => runTactic(chip)}
                    className="rounded border border-slate-600 bg-slate-800 px-2.5 py-1 font-mono text-xs text-emerald-200 transition-colors hover:border-emerald-400 hover:bg-slate-700 disabled:opacity-40"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runTactic(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={solved}
                  placeholder="也可手动输入策略，例如 intro hp ..."
                  className="flex-1 rounded-md border border-slate-600 bg-[#141d22] px-3 py-1.5 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={solved || !input.trim()}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
                >
                  <Play className="h-3.5 w-3.5" />
                  执行
                </button>
              </form>
            </div>
          </div>

          {/* Right: Live Infoview */}
          <div className="bg-[#141d22] p-4 lg:col-span-6">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--art-slate-border)] pb-2">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                实时目标栈 ({currentState.goals.length} 个剩余目标)
              </span>
            </div>

            {solved ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <div className="mt-2 font-mono text-sm font-bold text-emerald-200">
                  No goals! 🎉
                </div>
                <p className="mt-1 text-xs text-emerald-100/80">
                  你构造的策略流已成功将待证目标全部消解，定理通过校验！
                </p>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {currentState.goals.map((g, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 ${
                      idx === 0
                        ? 'border-emerald-500/40 bg-[var(--art-slate)]'
                        : 'border-slate-700 bg-[var(--art-slate)]/50 opacity-75'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-400">
                        {g.label ? g.label : `目标 #${idx + 1}`}
                      </span>
                      {idx === 0 && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
                          当前焦点
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-slate-200">
                      {g.localHyps.map((h, hIdx) => (
                        <div key={hIdx}>
                          <span className="text-sky-300">{h.name}</span>
                          <span className="text-slate-500"> : </span>
                          <span>{h.type}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 border-t border-slate-700 pt-2 text-amber-200">
                      <span className="mr-1.5 font-bold text-amber-400">⊢</span>
                      {g.target}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
