import { useState } from 'react';
import { AlertTriangle, CheckCircle, Cpu, Lock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { FAKE_PROOF_DEMOS, PIPELINE_STAGES } from '../data/curriculum';

export function KernelPipeline() {
  const [activeStageId, setActiveStageId] = useState<string>(PIPELINE_STAGES[2].id);
  const [activeFakeId, setActiveFakeId] = useState<string>(FAKE_PROOF_DEMOS[0].id);

  const stage =
    PIPELINE_STAGES.find((s) => s.id === activeStageId) ?? PIPELINE_STAGES[0];
  const fake =
    FAKE_PROOF_DEMOS.find((f) => f.id === activeFakeId) ?? FAKE_PROOF_DEMOS[0];

  return (
    <div className="space-y-8">
      {/* 4-stage pipeline */}
      <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[var(--art-accent)]" />
            <h4 className="font-display text-base font-semibold text-[var(--art-ink)]">
              Lean 4 编译与验算流水线（点击各阶段透视内部流转）
            </h4>
          </div>
          <span className="text-xs text-[var(--art-muted)]">
            de Bruijn 准则：信任边界严格收窄在阶段 03
          </span>
        </div>

        <div className="grid gap-2.5 md:grid-cols-4">
          {PIPELINE_STAGES.map((item) => {
            const active = item.id === stage.id;
            const isTrusted = item.trustLevel.includes('TCB');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveStageId(item.id)}
                className={`group flex flex-col justify-between rounded-lg border p-3.5 text-left transition-all ${
                  active
                    ? 'border-[var(--art-accent)] bg-[var(--art-tint)]/70 ring-1 ring-[var(--art-accent)]'
                    : 'border-[var(--art-line)] bg-[var(--art-page)]/50 hover:border-[var(--art-accent)]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--art-accent)]">
                      STAGE {item.step}
                    </span>
                    {isTrusted ? (
                      <Lock className="h-3.5 w-3.5 text-[var(--art-accent)]" />
                    ) : (
                      <span className="text-[10px] text-[var(--art-muted)]">可替换前端</span>
                    )}
                  </div>
                  <div className="mt-1.5 text-sm font-semibold text-[var(--art-ink)]">
                    {item.title.split(' (')[0]}
                  </div>
                </div>
                <div className="mt-2.5 text-[11px] leading-snug text-[var(--art-muted)]">
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage inspector */}
        <div className="mt-4 rounded-lg border border-[var(--art-line)] bg-[var(--art-page)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-semibold text-[var(--art-accent)]">
                STAGE {stage.step}
              </span>
              <h5 className="font-display text-lg font-semibold text-[var(--art-ink)]">
                {stage.title}
              </h5>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                stage.trustLevel.includes('TCB')
                  ? 'bg-[var(--art-tint)] text-[var(--art-accent)]'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {stage.trustLevel.includes('TCB') ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {stage.trustLevel}
            </span>
          </div>

          <p className="mt-2 text-xs font-medium text-[var(--art-accent)]">
            💡 感性类比：{stage.analogy}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--art-ink)]">{stage.detail}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-[var(--art-slate-border)] bg-[var(--art-slate)] p-3">
              <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                输入 (Input)
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-slate-100">
                {stage.inputSample}
              </pre>
            </div>
            <div className="rounded-md border border-[var(--art-slate-border)] bg-[var(--art-slate)] p-3">
              <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-emerald-400 uppercase">
                输出 (Output)
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-emerald-100">
                {stage.outputSample}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* 3 ways the kernel catches fake proofs */}
      <div className="rounded-xl border border-[var(--art-line)] bg-[var(--art-surface)] p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[var(--art-terracotta)]" />
            <h4 className="font-display text-base font-semibold text-[var(--art-ink)]">
              内核如何拦截“作弊证明”？三种经典造假实测
            </h4>
          </div>
          <span className="text-xs text-[var(--art-muted)]">
            试试人类写论文常混过去的三类逻辑漏洞
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FAKE_PROOF_DEMOS.map((item) => {
            const active = item.id === fake.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveFakeId(item.id)}
                className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
                  active
                    ? 'border-[var(--art-terracotta)] bg-[var(--art-terracotta-tint)] text-[var(--art-terracotta)]'
                    : 'border-[var(--art-line)] bg-[var(--art-page)] text-[var(--art-muted)] hover:text-[var(--art-ink)]'
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-3 rounded-lg border border-[var(--art-line)] bg-[var(--art-page)]/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-[var(--art-ink)]">
              <span className="text-[var(--art-terracotta)]">人类套路：</span>
              {fake.humanTrick}
            </p>
            <span className="rounded bg-[var(--art-terracotta-tint)] px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--art-terracotta)]">
              {fake.badge}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-[var(--art-slate-border)] bg-[var(--art-slate)] p-3">
              <div className="mb-1.5 text-[11px] font-semibold text-slate-400">
                尝试编译的作弊代码
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-slate-100">
                {fake.leanCode}
              </pre>
            </div>
            <div className="rounded-md border border-rose-900/60 bg-[#1f1517] p-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-300">
                <CheckCircle className="h-3.5 w-3.5" />
                Lean 编译器与内核真实拦截信息
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-rose-100">
                {fake.compilerResponse}
              </pre>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--art-muted)]">
            <strong className="text-[var(--art-ink)]">底层原理：</strong>
            {fake.whyCaught}
          </p>
        </div>
      </div>
    </div>
  );
}
