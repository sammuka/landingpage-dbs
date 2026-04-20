"use client";

import { AzureIcon } from "@/components/ui/AzureIcon";
import type { InfraService, BadgeVariant } from "@/lib/data/infrastructure";
import { motion } from "framer-motion";

// ─── Badge color helpers (dual dark/light — same pattern as DevOpsPipeline) ──

function badgeClass(variant: BadgeVariant): string {
  const map: Record<BadgeVariant, string> = {
    blue: "dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-700/50 bg-blue-100 text-blue-700 border-blue-300",
    green:
      "dark:bg-green-950/70 dark:text-green-300 dark:border-green-700/50 bg-green-100 text-green-700 border-green-300",
    amber:
      "dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700/50 bg-amber-100 text-amber-700 border-amber-300",
    neutral:
      "dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700/50 bg-slate-100 text-slate-600 border-slate-300",
    crit: "dark:bg-red-950/70 dark:text-red-300 dark:border-red-700/50 bg-red-100 text-red-700 border-red-300",
  };
  return map[variant];
}

// ─── Card variants ────────────────────────────────────────────────

export const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────

interface InfraCardProps {
  service: InfraService;
}

export function InfraCard({ service }: InfraCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className={[
        "group relative flex flex-col overflow-hidden rounded-xl border p-4",
        "bg-card text-card-foreground shadow-sm",
        "transition-shadow duration-300 hover:shadow-lg",
        "border-border",
        "dark:border-transparent dark:bg-[#0d1526]",
        "dark:[box-shadow:inset_0_0_0_1px_rgba(96,165,250,0.15),0_1px_3px_rgba(0,0,0,0.4)]",
        "dark:hover:[box-shadow:inset_0_0_0_1px_rgba(96,165,250,0.35),0_4px_12px_rgba(0,0,0,0.5)]",
      ].join(" ")}
    >
      {/* Top glow accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent dark:via-blue-400/30"
      />

      {/* ── Header: Icon + Name + Azure Product ── */}
      <div className="flex items-start gap-3 mb-3">
        <div className="shrink-0 mt-0.5">
          <AzureIcon name={service.icon} size={28} />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground leading-tight truncate">
            {service.name}
          </h4>
          <p className="text-[11px] font-mono-tech text-muted-foreground leading-tight mt-0.5 truncate">
            {service.azureProduct}
          </p>
        </div>
      </div>

      {/* ── Specs Grid ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 flex-1">
        {service.specs.map((spec) => (
          <div key={spec.label} className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-[10px] font-mono-tech text-muted-foreground shrink-0 uppercase tracking-wider">
              {spec.label}
            </span>
            <span
              className={[
                "text-[11px] font-mono-tech font-medium truncate",
                spec.highlight
                  ? "text-[var(--color-azure-blue-l)]"
                  : "text-foreground",
              ].join(" ")}
            >
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Badges ── */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-border dark:border-white/5">
        {service.badges.map((badge) => (
          <span
            key={badge.text}
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${badgeClass(badge.variant)}`}
          >
            {badge.text}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
