"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { timelinePhases, type TimelinePhase } from "@/lib/data/timeline";

// ─── Ease constants (typed tuples for Framer Motion v12) ──────────────────

const EASE_SPRING = [0.25, 0.46, 0.45, 0.94] as [
  number,
  number,
  number,
  number,
];
const EASE_STANDARD = [0.4, 0, 0.2, 1] as [number, number, number, number];

// ─── Animation variants ────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_SPRING,
      delay: i * 0.12,
    },
  }),
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: EASE_STANDARD, delay: 0.2 },
  },
};

const verticalLineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.8, ease: EASE_STANDARD, delay: 0.1 },
  },
};

// ─── Gradient track colors (red → amber → azure → green → cyan) ───────────

const TRACK_GRADIENT =
  "linear-gradient(90deg, #dc2626 0%, #d97706 25%, #0078d4 50%, #107c10 75%, #0891b2 100%)";

// ─── Phase number circle ───────────────────────────────────────────────────

function PhaseCircle({
  phase,
  size = "lg",
}: {
  phase: TimelinePhase;
  size?: "sm" | "lg";
}) {
  const isLg = size === "lg";
  return (
    <div
      className={`
        flex items-center justify-center rounded-full font-mono-tech font-bold
        border-2 bg-background transition-colors shrink-0
        ${isLg ? "w-12 h-12 text-sm" : "w-9 h-9 text-xs"}
      `}
      style={{
        borderColor: phase.color,
        color: phase.color,
        boxShadow: `0 0 12px ${phase.color}33`,
      }}
    >
      {phase.number}
    </div>
  );
}

// ─── Bullet dot ───────────────────────────────────────────────────────────

function BulletDot({ color }: { color: string }) {
  return (
    <span
      className="mt-[5px] shrink-0 w-[6px] h-[6px] rounded-full"
      style={{ background: color }}
    />
  );
}

// ─── Phase card ───────────────────────────────────────────────────────────

function PhaseCard({
  phase,
  index,
  layout,
}: {
  phase: TimelinePhase;
  index: number;
  layout: "horizontal" | "vertical";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
      className={`
        group relative rounded-xl border border-border bg-card/60 dark:bg-card/40
        backdrop-blur-sm p-5 hover:border-current/30 transition-colors duration-300 overflow-hidden
        ${layout === "horizontal" ? "flex-1 min-w-0" : "w-full"}
      `}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: phase.color }}
      />

      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <PhaseCircle phase={phase} size="sm" />
        <div className="min-w-0">
          <h3 className="font-display font-bold text-base text-foreground leading-tight">
            {phase.title}
          </h3>
          <p
            className="font-mono-tech text-[11px] mt-0.5"
            style={{ color: phase.color }}
          >
            {phase.period}
          </p>
        </div>
      </div>

      {/* Detail bullets */}
      <ul className="space-y-2 mb-4">
        {phase.details.map((detail, di) => (
          <li key={di} className="flex items-start gap-2">
            <BulletDot color={phase.color} />
            <span className="text-[12px] text-muted-foreground leading-snug">
              {detail}
            </span>
          </li>
        ))}
      </ul>

      {/* Deliverables box */}
      <div
        className="rounded-lg p-3 border"
        style={{
          background: `${phase.color}08`,
          borderColor: `${phase.color}22`,
        }}
      >
        <p
          className="font-mono-tech text-[10px] uppercase tracking-wider mb-2 font-semibold"
          style={{ color: phase.color }}
        >
          Entregáveis
        </p>
        <ul className="space-y-1">
          {phase.deliverables.map((del, di) => (
            <li key={di} className="flex items-start gap-2">
              <BulletDot color={phase.color} />
              <span className="text-[11px] text-muted-foreground/80 leading-snug font-mono-tech">
                {del}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ─── Desktop horizontal layout ────────────────────────────────────────────

function DesktopTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="hidden lg:block">
      {/* Track row */}
      <div className="relative flex items-center justify-between mb-8 px-6">
        {/* Animated gradient line */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] origin-left"
          style={{ background: TRACK_GRADIENT }}
        />

        {/* Phase circles on the line */}
        {timelinePhases.map((phase, i) => (
          <motion.div
            key={phase.id}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={i}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <PhaseCircle phase={phase} size="lg" />
            <div className="text-center">
              <p className="font-display font-bold text-sm text-foreground whitespace-nowrap">
                {phase.title}
              </p>
              <p
                className="font-mono-tech text-[10px] mt-0.5"
                style={{ color: phase.color }}
              >
                {phase.period}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cards row */}
      <div className="flex gap-4 items-start">
        {timelinePhases.map((phase, i) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            index={i}
            layout="horizontal"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Mobile vertical layout ───────────────────────────────────────────────

function MobileTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="lg:hidden relative">
      {/* Vertical gradient line */}
      <div className="absolute left-[17px] top-0 bottom-0 w-[2px] overflow-hidden">
        <motion.div
          variants={verticalLineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full h-full origin-top"
          style={{ background: TRACK_GRADIENT }}
        />
      </div>

      {/* Phase items */}
      <div className="space-y-6 pl-12">
        {timelinePhases.map((phase, i) => (
          <div key={phase.id} className="relative">
            {/* Number circle on the vertical line */}
            <div
              className="absolute -left-12 top-4 flex items-center justify-center rounded-full w-9 h-9 text-xs font-bold font-mono-tech border-2 bg-background shrink-0"
              style={{
                borderColor: phase.color,
                color: phase.color,
                boxShadow: `0 0 10px ${phase.color}44`,
              }}
            >
              {phase.number}
            </div>

            <PhaseCard phase={phase} index={i} layout="vertical" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────

export function JourneyTimeline() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, {
    once: true,
    margin: "-50px",
  });

  return (
    <section
      id="timeline"
      className="relative border-t border-b border-border/50"
    >
      {/* Subtle background tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,120,212,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="section-container relative z-10">
        {/* ── Section heading ── */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{
            duration: 0.55,
            ease: EASE_SPRING,
          }}
          className="mb-12 lg:mb-16 text-center"
        >
          <SectionLabel>A Jornada</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight max-w-2xl mx-auto">
            Dois caminhos analisados,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-azure-blue-l), var(--color-green-ok-l))",
              }}
            >
              uma decisão implementada
            </span>
          </h2>
        </motion.div>

        {/* ── Desktop ── */}
        <DesktopTimeline />

        {/* ── Mobile ── */}
        <MobileTimeline />
      </div>
    </section>
  );
}
