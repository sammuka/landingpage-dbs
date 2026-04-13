"use client";

import { pipelineStages, bicepModules, branches, deployCommand } from "@/lib/data/devops";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AzureIcon } from "@/components/ui/AzureIcon";
import { motion } from "framer-motion";

// ─── Badge color helpers ───────────────────────────────────────────

type BadgeType = "blue" | "green" | "amber" | "purple" | "neutral";

function stageBadgeClass(type: BadgeType): string {
  const map: Record<BadgeType, string> = {
    blue: "bg-blue-950/70 text-blue-300 border-blue-700/50",
    green: "bg-green-950/70 text-green-300 border-green-700/50",
    amber: "bg-amber-950/70 text-amber-300 border-amber-700/50",
    purple: "bg-purple-950/70 text-purple-300 border-purple-700/50",
    neutral: "bg-slate-800/70 text-slate-300 border-slate-700/50",
  };
  return map[type];
}

// Light-mode variants share the same semantic palette but at lower opacity
function stageBadgeClassLight(type: BadgeType): string {
  const map: Record<BadgeType, string> = {
    blue: "dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-700/50 bg-blue-100 text-blue-700 border-blue-300",
    green:
      "dark:bg-green-950/70 dark:text-green-300 dark:border-green-700/50 bg-green-100 text-green-700 border-green-300",
    amber:
      "dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700/50 bg-amber-100 text-amber-700 border-amber-300",
    purple:
      "dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-700/50 bg-purple-100 text-purple-700 border-purple-300",
    neutral:
      "dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700/50 bg-slate-100 text-slate-600 border-slate-300",
  };
  return map[type];
}

// ─── Pipeline Stage Card ───────────────────────────────────────────

interface StageCardProps {
  stage: (typeof pipelineStages)[number];
  index: number;
}

function StageCard({ stage, index }: StageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex-shrink-0 w-52 md:w-48 lg:w-52 rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-sm"
    >
      {/* Icon + name */}
      <div className="flex items-center gap-2">
        <AzureIcon name={stage.icon} size={28} />
        <span className="text-sm font-semibold text-foreground leading-tight">{stage.name}</span>
      </div>

      {/* Badge */}
      <span
        className={`self-start inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${stageBadgeClassLight(stage.badgeType)}`}
      >
        {stage.badge}
      </span>

      {/* Trigger */}
      {stage.trigger && (
        <p className="text-[11px] text-muted-foreground font-mono-tech leading-tight">
          ↳ {stage.trigger}
        </p>
      )}

      {/* Steps */}
      <ul className="flex flex-col gap-1 mt-auto">
        {stage.steps.map((step) => (
          <li
            key={step}
            className="font-mono-tech text-[11px] text-muted-foreground leading-snug pl-2 border-l border-border truncate"
            title={step}
          >
            {step}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Branch Card ──────────────────────────────────────────────────

interface BranchCardProps {
  branch: (typeof branches)[number];
  index: number;
}

function BranchCard({ branch, index }: BranchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
    >
      {/* Pattern + tag */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <code className="font-mono-tech text-sm font-bold text-[var(--color-azure-blue-l)]">
          {branch.pattern}
        </code>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${stageBadgeClassLight(branch.badgeType)}`}
        >
          {branch.tag}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{branch.description}</p>

      {/* Triggers / Deploys */}
      <div className="flex flex-col gap-1 border-t border-border pt-3">
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground font-mono-tech shrink-0">Triggers:</span>
          <span className="text-foreground">{branch.triggers}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground font-mono-tech shrink-0">Deploys:</span>
          <span className="text-foreground">{branch.deploys}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────

export function DevOpsPipeline() {
  return (
    <section id="devops" className="bg-background">
      <div className="section-container">
        {/* Header */}
        <SectionLabel>DevOps &amp; IaC</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
          Esteira completa —{" "}
          <span className="text-[var(--color-azure-blue-l)]">3 pipelines</span>
          {" · "}
          <span className="text-[var(--color-green-ok-l)]">6 módulos Bicep</span>
        </h2>

        {/* ── Part 1: Pipeline stages ──────────────────────────────── */}
        <div className="mb-14">
          {/* Mobile: vertical stack */}
          <div className="flex flex-col gap-4 md:hidden">
            {pipelineStages.map((stage, i) => (
              <div key={stage.id} className="flex flex-col gap-2">
                <StageCard stage={stage} index={i} />
                {i < pipelineStages.length - 1 && (
                  <div className="flex justify-center text-muted-foreground text-lg select-none">↓</div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: horizontal scrollable */}
          <div className="hidden md:flex items-start gap-2 overflow-x-auto pb-4 scrollbar-thin">
            {pipelineStages.map((stage, i) => (
              <div key={stage.id} className="flex items-start gap-2">
                <StageCard stage={stage} index={i} />
                {i < pipelineStages.length - 1 && (
                  <div className="flex items-center self-center text-muted-foreground/60 text-xl select-none pt-1 shrink-0">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Part 2: Branch strategy ──────────────────────────────── */}
        <div className="mb-14">
          <h3 className="font-display text-xl font-semibold text-foreground mb-6">
            Estratégia de branches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((branch, i) => (
              <BranchCard key={branch.pattern} branch={branch} index={i} />
            ))}
          </div>
        </div>

        {/* ── Part 3: Bicep IaC ────────────────────────────────────── */}
        <div>
          <SectionLabel>Infrastructure as Code — 6 Módulos Bicep</SectionLabel>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8"
          >
            {bicepModules.map((mod, i) => (
              <motion.div
                key={mod.filename}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-2 rounded-lg border border-border bg-card p-3"
              >
                <AzureIcon
                  name="azure-resource-manager.svg"
                  size={18}
                  className="mt-0.5 shrink-0 opacity-70"
                />
                <div className="min-w-0">
                  <code className="font-mono-tech text-[11px] font-semibold text-[var(--color-azure-blue-l)] block truncate">
                    {mod.filename}
                  </code>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {mod.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Deploy command */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs font-mono-tech text-muted-foreground uppercase tracking-wider mb-2">
              Comando de deploy
            </p>
            <pre className="code-block text-green-300 dark:text-green-400 overflow-x-auto whitespace-pre">
              <code>{deployCommand}</code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
