import { useState } from 'react';
import { ArrowLeftRight, Code2, Sparkles } from 'lucide-react';
import { CURRY_HOWARD_ROWS } from '../data/curriculum';

export function CurryHowardExplorer() {
  const [selectedId, setSelectedId] = useState<string>(CURRY_HOWARD_ROWS[0].id);
  const selected =
    CURRY_HOWARD_ROWS.find((r) => r.id === selectedId) ?? CURRY_HOWARD_ROWS[0];

  return (
    <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--art-line)] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-[var(--art-accent)]" />
          <h4 className="font-display text-base font-semibold text-[var(--art-ink)]">
            交互式罗塞塔石碑：逻辑 × 类型论 × 编程对照表
          </h4>
        </div>
        <span className="text-xs text-[var(--art-muted)]">点击任意一行查看具体代码对照</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--art-line)] bg-[var(--art-page)]/70 text-xs font-semibold text-[var(--art-muted)]">
              <th className="px-4 py-2.5">数理逻辑概念</th>
              <th className="px-4 py-2.5">逻辑符号</th>
              <th className="px-4 py-2.5">类型论对应物</th>
              <th className="hidden px-4 py-2.5 md:table-cell">工程编程类比</th>
              <th className="px-4 py-2.5">Lean 4 写法</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--art-line)]">
            {CURRY_HOWARD_ROWS.map((row) => {
              const isSelected = row.id === selected.id;
              return (
                <tr
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--art-tint)]'
                      : 'hover:bg-[var(--art-page)]'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-[var(--art-ink)]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          isSelected ? 'bg-[var(--art-accent)]' : 'bg-[var(--art-line)]'
                        }`}
                      />
                      {row.logicName}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--art-accent)]">
                    {row.logicSymbol}
                  </td>
                  <td className="px-4 py-3 text-[var(--art-ink)]">{row.typeName}</td>
                  <td className="hidden px-4 py-3 text-xs text-[var(--art-muted)] md:table-cell">
                    {row.progAnalogy}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--art-terracotta)]">
                    {row.leanSyntax}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected detail drawer */}
      <div className="border-t border-[var(--art-line)] bg-[var(--art-page)]/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--art-accent)]">
            <Sparkles className="h-4 w-4" />
            <span>{selected.logicName}</span>
            <span className="text-[var(--art-muted)]">↔</span>
            <span>{selected.typeName}</span>
          </div>
          <span className="rounded-full bg-[var(--art-tint)] px-2.5 py-0.5 text-xs font-medium text-[var(--art-accent)]">
            工程类比：{selected.progAnalogy}
          </span>
        </div>

        <p className="mt-2.5 text-sm font-medium text-[var(--art-ink)]">
          {selected.concreteExample.statement}
        </p>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--art-slate-border)] bg-[var(--art-slate)] px-4 py-2.5 text-xs text-slate-100">
          <Code2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <code className="overflow-x-auto whitespace-nowrap font-mono">
            {selected.concreteExample.leanSnippet}
          </code>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[var(--art-muted)]">
          {selected.concreteExample.explanation}
        </p>
      </div>
    </div>
  );
}
