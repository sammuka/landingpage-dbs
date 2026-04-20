"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapToggle } from "@/components/architecture/MapToggle";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Skeleton shown while the React Flow bundle loads ────────────────────────

function MapLoading({ variant }: { variant: "legacy" | "cloud" }) {
  const bg = variant === "legacy" ? "#0e0b04" : "#060c18";
  const borderColor =
    variant === "legacy"
      ? "border-amber-800/30"
      : "border-blue-800/30";
  const pulseColor =
    variant === "legacy"
      ? "bg-amber-900/20"
      : "bg-blue-900/20";

  return (
    <div
      className={`w-full h-[580px] rounded-xl border ${borderColor} overflow-hidden flex flex-col gap-4 p-6 animate-pulse`}
      style={{ background: bg }}
    >
      {/* Simulated node rows */}
      <div className="flex gap-4 justify-center mt-4">
        <div className={`h-14 w-36 rounded-lg ${pulseColor}`} />
      </div>
      <div className="flex gap-4 justify-center">
        <div className={`h-14 w-36 rounded-lg ${pulseColor}`} />
        <div className={`h-14 w-40 rounded-lg ${pulseColor}`} />
      </div>
      <div className="flex gap-4 justify-center">
        <div className={`h-14 w-32 rounded-lg ${pulseColor}`} />
        <div className={`h-14 w-36 rounded-lg ${pulseColor}`} />
        <div className={`h-14 w-32 rounded-lg ${pulseColor}`} />
      </div>
      <div className="flex gap-4 justify-center">
        <div className={`h-14 w-40 rounded-lg ${pulseColor}`} />
        <div className={`h-14 w-36 rounded-lg ${pulseColor}`} />
      </div>
      <div className="flex-1 flex items-end justify-center pb-4">
        <div className={`h-4 w-48 rounded ${pulseColor}`} />
      </div>
    </div>
  );
}

// ─── Dynamic imports — SSR disabled (React Flow requires browser APIs) ────────

const LegacyMap = dynamic(
  () =>
    import("@/components/architecture/LegacyMap").then((m) => ({
      default: m.LegacyMap,
    })),
  { ssr: false, loading: () => <MapLoading variant="legacy" /> }
);

const CloudMap = dynamic(
  () =>
    import("@/components/architecture/CloudMap").then((m) => ({
      default: m.CloudMap,
    })),
  { ssr: false, loading: () => <MapLoading variant="cloud" /> }
);

// ─── Legend bar data ──────────────────────────────────────────────────────────

interface LegendStat {
  value: string;
  label: string;
  variant: "crit" | "warn" | "ok" | "neutral";
}

const legacyStats: LegendStat[] = [
  { value: "7", label: "módulos Java", variant: "warn" },
  { value: "906", label: "classes", variant: "warn" },
  { value: "9", label: "CVEs críticos", variant: "crit" },
];

const cloudStats: LegendStat[] = [
  { value: "3", label: "containers", variant: "ok" },
  { value: "197", label: "testes", variant: "ok" },
  { value: "0", label: "CVEs", variant: "ok" },
  { value: "6", label: "módulos Bicep", variant: "neutral" },
];

const statColors: Record<LegendStat["variant"], string> = {
  crit: "border-red-800/40 bg-red-950/40 text-red-300",
  warn: "border-amber-800/40 bg-amber-950/40 text-amber-300",
  ok: "border-green-800/40 bg-green-950/40 text-green-300",
  neutral: "border-slate-700/40 bg-slate-900/40 text-slate-300",
};

const statValueColors: Record<LegendStat["variant"], string> = {
  crit: "text-red-400",
  warn: "text-amber-400",
  ok: "text-green-400",
  neutral: "text-slate-300",
};

function LegendBar({ stats }: { stats: LegendStat[] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono-tech ${statColors[stat.variant]}`}
        >
          <span className={`text-base font-bold tabular-nums ${statValueColors[stat.variant]}`}>
            {stat.value}
          </span>
          <span className="opacity-80">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Framer Motion variants ───────────────────────────────────────────────────

const mapVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -40,
    transition: { duration: 0.25, ease: [0.55, 0.06, 0.68, 0.19] as const },
  }),
};

// ─── Section component ────────────────────────────────────────────────────────

export function ArchitectureMaps() {
  const [activeView, setActiveView] = useState<"legacy" | "cloud">("legacy");

  // Direction: 1 when moving right (legacy→cloud), -1 when moving left (cloud→legacy)
  const direction = activeView === "cloud" ? 1 : -1;

  return (
    <section id="architecture" className="relative">
      <div className="section-container">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <SectionLabel>Arquitetura</SectionLabel>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
          <span className="text-[var(--color-amber-warn-l)]">ANTES:</span>{" "}
          <span className="text-muted-foreground font-normal">Monolito JBoss</span>
          <span className="mx-3 text-muted-foreground/40">·</span>
          <span className="text-[var(--color-azure-blue-l)]">DEPOIS:</span>{" "}
          <span className="text-muted-foreground font-normal">Azure Container Apps</span>
        </h2>

        <p className="text-muted-foreground text-base mb-8 max-w-2xl">
          Clique em qualquer nó para ver detalhes técnicos. Use scroll para zoom e arraste para
          navegar pelo grafo interativo.
        </p>

        {/* ── Toggle control ─────────────────────────────────────────────── */}
        <div className="mb-6">
          <MapToggle active={activeView} onChange={setActiveView} />
        </div>

        {/* ── Animated map container ─────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-xl">
          <AnimatePresence mode="wait" custom={direction}>
            {activeView === "legacy" ? (
              <motion.div
                key="legacy"
                custom={direction}
                variants={mapVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <LegacyMap />
                <LegendBar stats={legacyStats} />
              </motion.div>
            ) : (
              <motion.div
                key="cloud"
                custom={direction}
                variants={mapVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <CloudMap />
                <LegendBar stats={cloudStats} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Subtle instruction hint ─────────────────────────────────────── */}
        <p className="mt-3 text-xs font-mono-tech text-muted-foreground/50 text-center">
          Arraste · Scroll para zoom · Clique nos nós para detalhes
        </p>
      </div>
    </section>
  );
}
