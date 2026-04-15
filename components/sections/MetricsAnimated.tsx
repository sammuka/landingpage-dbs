"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { motion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Metric {
  label: string;
  from: number;
  to: number;
  suffix: string;
  description: string;
}

const metrics: Metric[] = [
  {
    label: "Classes Java → Tipos C#",
    from: 906,
    to: 383,
    suffix: "",
    description: "↓ 58% com Clean Architecture",
  },
  {
    label: "Testes Automatizados",
    from: 0,
    to: 163,
    suffix: "",
    description: "De zero para 163 testes",
  },
  {
    label: "CVEs Críticos",
    from: 9,
    to: 0,
    suffix: "",
    description: "Zero vulnerabilidades críticas",
  },
  {
    label: "Dívidas Técnicas",
    from: 42,
    to: 0,
    suffix: "",
    description: "Zero críticas abertas",
  },
  {
    label: "Stubs SOAP",
    from: 300,
    to: 36,
    suffix: "",
    description: "~300 stubs → ~36 DTOs records",
  },
  {
    label: "Containers Azure",
    from: 0,
    to: 3,
    suffix: "",
    description: "API Unificada, Portal, SOAP Adapter",
  },
  {
    label: "ADRs Documentados",
    from: 0,
    to: 21,
    suffix: "",
    description: "Decisões arquiteturais versionadas",
  },
  {
    label: "Camadas Clean Arch",
    from: 0,
    to: 5,
    suffix: "",
    description: "Domain, App, Infra, Contracts, API",
  },
  {
    label: "Módulos Bicep IaC",
    from: 0,
    to: 6,
    suffix: "",
    description: "Infraestrutura 100% code-as-data",
  },
];

/**
 * Determine if a metric represents an improvement by going DOWN (reduction).
 * Reductions: classes, CVEs, dívidas, stubs.
 * Increases: testes, containers, ADRs, camadas, módulos.
 */
function isReduction(metric: Metric): boolean {
  return metric.to < metric.from;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function MetricsAnimated() {
  return (
    <section id="metrics">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>Métricas</SectionLabel>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Números que definem a transformação
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Indicadores mensuráveis do impacto da modernização — de zero testes e
            9 CVEs abertos para uma base sólida, auditável e resiliente.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {metrics.map((metric) => {
            const reduction = isReduction(metric);

            return (
              <motion.div
                key={metric.label}
                variants={cardVariants}
                className={[
                  "group relative flex flex-col gap-2 overflow-hidden rounded-xl border p-5",
                  "bg-card text-card-foreground shadow-sm",
                  "transition-shadow duration-300 hover:shadow-lg",
                  // Light mode border
                  "border-border",
                  // Dark mode: subtle blue gradient border via ring + bg elevation
                  "dark:border-transparent dark:bg-[#0d1526]",
                  // Dark mode gradient border trick via box-shadow
                  "dark:[box-shadow:inset_0_0_0_1px_rgba(96,165,250,0.15),0_1px_3px_rgba(0,0,0,0.4)]",
                  "dark:hover:[box-shadow:inset_0_0_0_1px_rgba(96,165,250,0.35),0_4px_12px_rgba(0,0,0,0.5)]",
                ].join(" ")}
              >
                {/* Subtle top glow accent */}
                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-x-0 top-0 h-px",
                    reduction
                      ? "bg-gradient-to-r from-transparent via-red-500/40 to-transparent dark:via-red-500/30"
                      : "bg-gradient-to-r from-transparent via-blue-500/40 to-transparent dark:via-blue-400/30",
                  ].join(" ")}
                />

                {/* Counter + direction arrow */}
                <div className="flex items-end gap-2">
                  <AnimatedCounter
                    from={metric.from}
                    to={metric.to}
                    suffix={metric.suffix}
                    duration={2}
                    className="font-display text-4xl font-bold tabular-nums text-foreground"
                  />
                  <span
                    className={[
                      "mb-1 text-lg font-bold leading-none",
                      reduction
                        ? "text-red-500 dark:text-red-400"
                        : "text-green-600 dark:text-[var(--color-green-ok-l)]",
                    ].join(" ")}
                    aria-label={reduction ? "redução" : "aumento"}
                  >
                    {reduction ? "↓" : "↑"}
                  </span>
                </div>

                {/* Label */}
                <p className="text-sm font-semibold leading-tight text-foreground">
                  {metric.label}
                </p>

                {/* Description */}
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
