import { useState } from 'react';
import { BookOpen, CheckCircle2, Menu, X } from 'lucide-react';

export interface NavSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
}

interface SidebarNavProps {
  sections: NavSection[];
  activeId: string;
  completedExamplesCount: number;
  totalExamplesCount: number;
  completedSandboxCount: number;
  totalSandboxCount: number;
}

export function SidebarNav({
  sections,
  activeId,
  completedExamplesCount,
  totalExamplesCount,
  completedSandboxCount,
  totalSandboxCount,
}: SidebarNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalTasks = totalExamplesCount + totalSandboxCount;
  const doneTasks = completedExamplesCount + completedSandboxCount;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="sticky top-0 z-30 border-b border-[var(--art-line)] bg-[var(--art-page)]/95 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-[var(--art-accent)]" />
            <span className="font-display text-sm font-semibold text-[var(--art-ink)]">
              Lean 4 形式化证明导论
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[var(--art-muted)]">
              进度 {progressPct}%
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-md border border-[var(--art-line)] bg-[var(--art-surface)] p-1.5 text-[var(--art-ink)]"
              aria-label="展开目录"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t border-[var(--art-line)] bg-[var(--art-surface)] px-4 py-3">
            <ul className="space-y-1">
              {sections.map((sec) => {
                const active = sec.id === activeId;
                return (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-baseline gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-[var(--art-tint)] font-medium text-[var(--art-accent)]'
                          : 'text-[var(--art-muted)] hover:text-[var(--art-ink)]'
                      }`}
                    >
                      <span className="font-mono text-xs opacity-75">{sec.number}</span>
                      <span>{sec.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop quiet left-hand index */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="sticky top-8 space-y-6 pr-4">
          <div className="border-b border-[var(--art-line)] pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--art-accent)] uppercase">
              <BookOpen className="h-3.5 w-3.5" />
              <span>自学索引 · Index</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--art-muted)]">
              面向非数学专业工科读者的交互式证明笔记
            </p>
          </div>

          <nav aria-label="章节目录">
            <ul className="space-y-1 border-l border-[var(--art-line)]">
              {sections.map((sec) => {
                const active = sec.id === activeId;
                return (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className={`-ml-px block border-l-2 py-2 pl-3.5 transition-all ${
                        active
                          ? 'border-[var(--art-accent)] bg-[var(--art-tint)]/60 text-[var(--art-accent)]'
                          : 'border-transparent text-[var(--art-muted)] hover:border-[var(--art-line)] hover:text-[var(--art-ink)]'
                      }`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[11px] opacity-75">{sec.number}</span>
                        <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                          {sec.title}
                        </span>
                      </div>
                      <p className="mt-0.5 pl-6 text-[11px] leading-snug opacity-80">
                        {sec.subtitle}
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Compact progress tracker */}
          <div className="rounded-lg border border-[var(--art-line)] bg-[var(--art-surface)] p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--art-ink)]">学习与推演进度</span>
              <span className="font-mono font-semibold text-[var(--art-accent)]">
                {progressPct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--art-line)]">
              <div
                className="h-full rounded-full bg-[var(--art-accent)] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-2.5 space-y-1 text-[11px] text-[var(--art-muted)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[var(--art-accent)]" />
                  例题单步推演
                </span>
                <span className="font-mono">
                  {completedExamplesCount}/{totalExamplesCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[var(--art-accent)]" />
                  交互沙盒通关
                </span>
                <span className="font-mono">
                  {completedSandboxCount}/{totalSandboxCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
