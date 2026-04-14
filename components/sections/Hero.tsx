"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowRight } from "lucide-react";

// ─── Inline GitHub SVG (lucide-react v1.7 ships no Github icon) ───────────

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─── Metric card data ──────────────────────────────────────────────────────

interface MetricCard {
  fromLabel: string;
  from: number;
  to: number;
  suffix?: string;
  description: string;
  accentColor: string;
}

const metrics: MetricCard[] = [
  {
    fromLabel: "~1.100 classes Java",
    from: 1100,
    to: 383,
    suffix: " tipos",
    description: "redução com Clean Arch",
    accentColor: "var(--metric-red)",
  },
  {
    fromLabel: "9 CVEs críticos",
    from: 9,
    to: 0,
    suffix: " CVEs",
    description: "vulnerabilidades eliminadas",
    accentColor: "var(--metric-green)",
  },
  {
    fromLabel: "0 testes no legado",
    from: 0,
    to: 163,
    suffix: " testes",
    description: "testes automatizados",
    accentColor: "var(--metric-blue)",
  },
  {
    fromLabel: "48 dívidas técnicas",
    from: 48,
    to: 0,
    suffix: " dívidas",
    description: "débito técnico zerado",
    accentColor: "var(--metric-amber)",
  },
];

// ─── Ease helpers (Framer Motion v12 compatible) ───────────────────────────
// We use inline transition objects instead of shared variant factories
// to avoid TargetResolver type constraints.

const EASE_OUT = "easeOut" as const;
const EASE_SPRING = [0.25, 0.46, 0.45, 0.94] as [
  number,
  number,
  number,
  number,
];

// ─── Component ─────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-24"
    >
      {/* Radial accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,120,212,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="section-container relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* ── Eyebrow ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0 }}
            className="mb-6"
          >
            {/* Thin gradient line */}
            <div
              className="mx-auto mb-4 h-px w-24"
              style={{
                background: "linear-gradient(90deg, #0078d4, #107c10)",
              }}
            />
            <SectionLabel className="font-mono-tech text-xs tracking-[0.2em] uppercase">
              Transformação Tecnológica · 2024–2026
            </SectionLabel>
          </motion.div>

          {/* ── Main title ── */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SPRING, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6"
          >
            De um monolito com{" "}
            <br className="hidden sm:block" />
            <span className="line-through text-red-500 dark:text-red-400">
              48 dívidas técnicas
            </span>
            <br />
            <span className="text-foreground">
              para arquitetura cloud-native
            </span>
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.35 }}
            className="font-mono-tech text-sm sm:text-base text-muted-foreground mb-12 tracking-wide"
          >
            Assurant DBS — Delphos Billing System · Sistran × Lumina AI
          </motion.p>

          {/* ── Metric cards grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.fromLabel}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: EASE_SPRING,
                  delay: 0.5 + i * 0.1,
                }}
                className="group relative rounded-xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-sm p-5 text-center hover:border-[var(--color-azure-blue)]/40 transition-colors duration-300 overflow-hidden"
              >
                {/* From label (struck through) */}
                <p className="font-mono-tech text-[11px] text-muted-foreground/60 line-through mb-2 leading-tight">
                  {metric.fromLabel}
                </p>

                {/* Animated counter */}
                <p
                  className="text-3xl font-bold font-display tabular-nums leading-none mb-1"
                  style={{ color: metric.accentColor }}
                >
                  <AnimatedCounter
                    from={metric.from}
                    to={metric.to}
                    suffix={metric.suffix ?? ""}
                  />
                </p>

                {/* Description */}
                <p className="font-mono-tech text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wider leading-tight">
                  {metric.description}
                </p>

                {/* Hover corner accent */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-xl"
                  style={{
                    background: `linear-gradient(225deg, ${metric.accentColor}22, transparent)`,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* ── CTA buttons ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.0 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary */}
            <a
              href="#architecture"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
              style={{
                background: "var(--color-azure-blue)",
                boxShadow: "0 0 0 0 rgba(0,120,212,0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 20px rgba(0,120,212,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 0 0 rgba(0,120,212,0)";
              }}
            >
              Ver Arquitetura
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground bg-transparent transition-all duration-200 hover:bg-secondary hover:border-[var(--color-azure-blue)]/50 active:scale-[0.98]"
            >
              <GithubIcon className="w-4 h-4" />
              GitHub →
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
