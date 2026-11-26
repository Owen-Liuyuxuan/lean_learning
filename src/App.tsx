import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  Compass,
  ExternalLink,
  FileCode2,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { ConceptQuiz } from './components/ConceptQuiz';
import { CurryHowardExplorer } from './components/CurryHowardExplorer';
import { KernelPipeline } from './components/KernelPipeline';
import { Math } from './components/Math';
import { MiniProofSandbox } from './components/MiniProofSandbox';
import { ProofWorkshop } from './components/ProofWorkshop';
import { type NavSection, SidebarNav } from './components/SidebarNav';
import { PROOF_EXAMPLES } from './data/examples';

const SECTIONS: NavSection[] = [
  {
    id: 'why-formal',
    number: '01',
    title: '为什么需要形式化证明',
    subtitle: '自然语言的灰色地带与机械审计',
  },
  {
    id: 'math-logic',
    number: '02',
    title: '背后的数学与逻辑原理',
    subtitle: 'Curry-Howard 同构与依赖类型论',
  },
  {
    id: 'compiler-kernel',
    number: '03',
    title: '“编译运行”究竟在算什么',
    subtitle: '极简可信内核与 3 种造假拦截',
  },
  {
    id: 'proof-workshop',
    number: '04',
    title: '6 个渐进式证明实战',
    subtitle: '从自然语言到单步 Infoview 推演',
  },
  {
    id: 'sandbox',
    number: '05',
    title: '动手证明沙盒',
    subtitle: '亲手把 Goal 逐一清零',
  },
  {
    id: 'quiz-and-next',
    number: '06',
    title: '概念自测与进阶路线',
    subtitle: '巩固认知并继续探索 Mathlib',
  },
];

const STORAGE_KEY_EXAMPLES = 'lean_learning_completed_examples_v1';
const STORAGE_KEY_SANDBOX = 'lean_learning_completed_sandbox_v1';

export default function App() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [completedExamples, setCompletedExamples] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EXAMPLES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [completedSandbox, setCompletedSandbox] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SANDBOX);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleCompleteExample = useCallback((id: string) => {
    setCompletedExamples((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY_EXAMPLES, JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  }, []);

  const handleCompleteSandbox = useCallback((id: string) => {
    setCompletedSandbox((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY_SANDBOX, JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: [0.05, 0.25] }
    );

    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--art-page)] text-[var(--art-ink)]">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:flex-row lg:gap-10 lg:px-8 lg:py-12">
        <SidebarNav
          sections={SECTIONS}
          activeId={activeId}
          completedExamplesCount={completedExamples.length}
          totalExamplesCount={PROOF_EXAMPLES.length}
          completedSandboxCount={completedSandbox.length}
          totalSandboxCount={3}
        />

        <main className="min-w-0 flex-1 space-y-20 pb-24">
          {/* Editorial Opening */}
          <header className="border-b border-[var(--art-line)] pb-10 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--art-line)] bg-[var(--art-surface)] px-3 py-1 text-xs font-medium text-[var(--art-accent)]">
              <Compass className="h-3.5 w-3.5" />
              <span>交互式形式化证明札记 · Pure Lean 4 Core</span>
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-[var(--art-ink)] sm:text-5xl sm:leading-[1.18]">
              Lean 4 形式化证明导论
              <span className="mt-2 block text-xl font-normal text-[var(--art-muted)] sm:text-2xl">
                为什么“代码编译通过”，就能保证数学证明绝对正确？
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--art-ink)]/90">
              这份自学案专为<strong>非数学专业本科背景（学过微积分与线代、懂函数与静态类型等基础编程概念）</strong>的读者设计。
              我们不堆砌抽象的数理逻辑黑话，而是用你熟悉的<strong>函数、结构体与编译器</strong>做感性锚点，再一步步落到真实的数学计算与推导上，带你打通“写数学证明”与“写可编译程序”之间的那堵墙。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#proof-workshop"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--art-accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--art-accent-hover)]"
              >
                直接进入 6 个单步推演实例
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#sandbox"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--art-line)] bg-[var(--art-surface)] px-4 py-2.5 text-sm font-medium text-[var(--art-ink)] transition-colors hover:border-[var(--art-accent)]"
              >
                先玩一把证明沙盒
              </a>
              <a
                href="https://github.com/Owen-Liuyuxuan/lean_learning/blob/main/lean/Examples.lean"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--art-line)] bg-[var(--art-surface)] px-4 py-2.5 text-sm font-medium text-[var(--art-muted)] transition-colors hover:text-[var(--art-ink)]"
              >
                <FileCode2 className="h-4 w-4" />
                查看纯 Lean 源码
              </a>
            </div>
          </header>

          {/* Section 01: Why Formal Proof */}
          <section id="why-formal" className="scroll-mt-20 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--art-accent)] uppercase">
                Chapter 01 · 从模糊到确凿
              </span>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                为什么自然语言证明会出错？Lean 到底在“形式化”什么？
              </h2>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-[var(--art-ink)]/90">
              翻开大学高数教材或数学论文，你经常会看到“同理可证”“显然成立”“不失一般性”这样的字眼。这并不是数学家懒惰，而是因为人类靠直觉和语境填补了大量微小的推理缝隙。但当证明长达数百页（或者交给 AI 生成）时，隐含假设、边界漏判（比如分母可能为零）、甚至循环论证就会悄然藏在“显然”两个字背后。
            </p>

            {/* Intuitive Metaphor + Concrete Comparison */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--art-terracotta)]">
                  <Scale className="h-4 w-4" />
                  <span>感性类比：同行评审 vs 静态类型编译器</span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--art-ink)]/90">
                  传统论文证明就像<strong>给资深编辑审一篇建筑蓝图说明文</strong>：只要整体思路顺畅、关键转折合理，编辑就会点头发表，但墙体承重有没有少算一根钢筋，人眼很难逐一穷举。
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--art-muted)]">
                  而 Lean 形式化证明则像<strong>把整套力学方程写成强类型程序交给物理内核编译器</strong>：只要有一个尺寸接口不匹配、有一个边界条件没覆盖，编译器直接报错拒绝通过。
                </p>
              </div>

              <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-tint)]/55 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--art-accent)]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>一个常见的真实隐患：隐性除零</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--art-ink)]">
                  人常顺手写：“已知 <Math tex="ax = ay" />，两边消去 <Math tex="a" /> 得 <Math tex="x = y" />。”
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--art-muted)]">
                  但在 Lean 里调用消去律 <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs text-[var(--art-accent)]">Nat.mul_left_cancel</code> 时，它强制要求你同时交付两个参数：一是等式 <Math tex="ax = ay" />，二是证明 <Math tex="0 < a" />！漏掉第二个条件，代码根本编不过。
                </p>
              </div>
            </div>
          </section>

          {/* Section 02: Mathematical & Logical Foundations */}
          <section id="math-logic" className="scroll-mt-20 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--art-accent)] uppercase">
                Chapter 02 · 背后的数学与推理逻辑
              </span>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                为什么“写代码”会等价于“证定理”？—— Curry-Howard 同构与依赖类型论
              </h2>
            </div>

            <div className="max-w-3xl space-y-4 text-base leading-relaxed text-[var(--art-ink)]/90">
              <p>
                很多初学者最困惑的问题是：<strong>Lean 看起来既像 Python/Rust，又在证数学定理，这两件事在数学上是怎么挂钩的？</strong>
              </p>
              <p>
                答案是 20 世纪逻辑学与计算机科学最深刻的发现之一——<strong>Curry-Howard 同构（命题即类型，证明即程序）</strong>，以及它升级到现代数学所需的引擎——<strong>依赖类型论（Dependent Type Theory，具体到 Lean 4 是“归纳构造演算 CIC”）</strong>。
              </p>
            </div>

            {/* 3 core pillars */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-4">
                <div className="font-mono text-xs font-bold text-[var(--art-accent)]">
                  PILLAR 01
                </div>
                <h3 className="mt-1 font-display text-base font-bold">
                  命题 = 类型，证明 = 值
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--art-muted)]">
                  一个数学命题 <Math tex="P" /> 就是一种数据类型（类型为 <code className="font-mono">Prop</code>）。能造出该类型的任意一个实体值 <code className="font-mono">h : P</code>，就证明了 <Math tex="P" /> 为真；如果该命题为假，它的类型就是空的，永远造不出值。
                </p>
              </div>
              <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-4">
                <div className="font-mono text-xs font-bold text-[var(--art-accent)]">
                  PILLAR 02
                </div>
                <h3 className="mt-1 font-display text-base font-bold">
                  值可以跑进类型里（依赖类型）
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--art-muted)]">
                  普通语言只能写 <code className="font-mono">List&lt;Int&gt;</code>（类型依赖类型），写不出“<code className="font-mono">a + b = b + a</code>”这种<strong>随变量值而变化的类型</strong>。依赖类型打通了值与类型，才让通用数学命题成为合法的类型签名！
                </p>
              </div>
              <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-4">
                <div className="font-mono text-xs font-bold text-[var(--art-accent)]">
                  PILLAR 03
                </div>
                <h3 className="mt-1 font-display text-base font-bold">
                  必须停机（全函数性 Totality）
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--art-muted)]">
                  如果允许无限循环，就能写出 <code className="font-mono">loop : False := loop</code> 骗过类型系统。因此 Lean 要求所有证明递归必须严格递减并停机，彻底封死“循环论证”。
                </p>
              </div>
            </div>

            <CurryHowardExplorer />
          </section>

          {/* Section 03: What "Compile & Run" Actually Means */}
          <section id="compiler-kernel" className="scroll-mt-20 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--art-accent)] uppercase">
                Chapter 03 · 编译运行的真正含义
              </span>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                这里的“编译运行”是在运行什么？为什么内核不出错，证明就一定对？
              </h2>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-[var(--art-ink)]/90">
              写常规软件时，“编译通过”只说明语法和基本类型没错，业务逻辑还要靠单元测试来跑；但在 Lean 里证明定理，<strong>“编译通过”本身就是终极验收</strong>！因为你写的策略（<code className="rounded bg-[var(--art-surface)] px-1.5 py-0.5 font-mono text-xs border border-[var(--art-line)]">intro</code>、<code className="rounded bg-[var(--art-surface)] px-1.5 py-0.5 font-mono text-xs border border-[var(--art-line)]">rw</code>、<code className="rounded bg-[var(--art-surface)] px-1.5 py-0.5 font-mono text-xs border border-[var(--art-line)]">induction</code>）根本不是给内核看的最终证明——它们只是帮你拼装出底层纯 λ-证明项的脚手架。
            </p>

            <KernelPipeline />
          </section>

          {/* Section 04: 6 Progressive Examples */}
          <section id="proof-workshop" className="scroll-mt-20 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--art-accent)] uppercase">
                Chapter 04 · 从自然语言到形式化单步推演
              </span>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                6 个由浅入深的实战命题：对照自然语言，透视每一步推演状态
              </h2>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-[var(--art-ink)]/90">
              以下 6 个例子全部只使用 Lean 4 核心库（<code className="font-mono text-sm">Init</code>），无需庞大的第三方库。每个例子都遵循四步结构：<strong>先读传统自然语言证明</strong> → <strong>揪出人类忽略的隐含前提</strong> → <strong>在模拟 Infoview 中单步观看待证目标如何消解</strong> → <strong>透视底层证明项或一键跳转真机编译</strong>。
            </p>

            <ProofWorkshop
              completedIds={completedExamples}
              onCompleteExample={handleCompleteExample}
            />
          </section>

          {/* Section 05: Interactive Proof Sandbox */}
          <section id="sandbox" className="scroll-mt-20 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--art-accent)] uppercase">
                Chapter 05 · 亲自上阵写证明
              </span>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                动手迷你沙盒：把右侧的目标栈（Goals）逐一清零
              </h2>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-[var(--art-ink)]/90">
              光看不练很难建立手感。在下面这 3 个关卡里，点击策略快捷按钮（或亲自敲入命令），观察内核如何真实地拆解条件、拒绝偷懒（试试第 3 关直接点 <code className="font-mono text-sm">rfl</code> 会发生什么！），直到出现 <code className="font-mono text-sm text-[var(--art-accent)]">No goals!</code>。
            </p>

            <MiniProofSandbox
              completedIds={completedSandbox}
              onCompleteSandbox={handleCompleteSandbox}
            />
          </section>

          {/* Section 06: Concept Quiz & Next Steps */}
          <section id="quiz-and-next" className="scroll-mt-20 space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--art-accent)] uppercase">
                Chapter 06 · 巩固与进阶
              </span>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                理性认知自测 & 继续深入的学习路线
              </h2>
            </div>

            <ConceptQuiz />

            <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-6">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-[var(--art-ink)]">
                <BookMarked className="h-5 w-5 text-[var(--art-accent)]" />
                <span>下一步推荐去哪里？</span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <a
                  href="https://adam.math.hhu.de/#/g/leanprover-community/nng4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-[var(--art-line)] bg-[var(--art-page)] p-4 transition-colors hover:border-[var(--art-accent)]"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-[var(--art-ink)] group-hover:text-[var(--art-accent)]">
                    <span>Natural Number Game</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--art-muted)]">
                    从零公理亲手证明加法交换律、乘法结合律的经典闯关游戏，极适合巩固例 4 与例 5 的手感。
                  </p>
                </a>

                <a
                  href="https://lean-lang.org/theorem_proving_in_lean4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-[var(--art-line)] bg-[var(--art-page)] p-4 transition-colors hover:border-[var(--art-accent)]"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-[var(--art-ink)] group-hover:text-[var(--art-accent)]">
                    <span>Theorem Proving in Lean 4</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--art-muted)]">
                    官方免费电子书，系统讲解依赖类型论、归纳类型、类型类（Type Classes）与策略元编程。
                  </p>
                </a>

                <a
                  href="https://leanprover-community.github.io/mathematics_in_lean/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-[var(--art-line)] bg-[var(--art-page)] p-4 transition-colors hover:border-[var(--art-accent)]"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-[var(--art-ink)] group-hover:text-[var(--art-accent)]">
                    <span>Mathematics in Lean</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--art-muted)]">
                    基于 Mathlib 实战微积分极限、线性代数、群环域和测度论的最佳交互教程。
                  </p>
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
