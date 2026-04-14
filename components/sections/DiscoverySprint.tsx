"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  sprintDays,
  type SprintDay,
  type SprintEvent,
  type SprintBadge,
  type SprintEventCategory,
} from "@/lib/data/sprint";

// ─── Ease constants ──────────────────────────────────────────────────────────

const EASE_SPRING   = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const EASE_STANDARD = [0.4, 0, 0.2, 1] as [number, number, number, number];

// ─── Animation variants ──────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SPRING, delay: i * 0.09 },
  }),
};

const lineGrow: Variants = {
  hidden:   { scaleY: 0 },
  visible:  { scaleY: 1, transition: { duration: 1.0, ease: EASE_STANDARD, delay: 0.1 } },
};

// ─── Category metadata ───────────────────────────────────────────────────────

const CAT_COLOR: Record<SprintEventCategory, string> = {
  discovery:  "#d97706",
  docbuild:   "#7c3aed",
  decision:   "#0078d4",
  impl:       "#107c10",
  security:   "#00297a",
  infra:      "#d97706",
  validation: "#0891b2",
};

const CAT_LABEL: Record<SprintEventCategory, string> = {
  discovery:  "Engenharia Reversa",
  docbuild:   "Doc construída",
  decision:   "Decisão",
  impl:       "Implementação",
  security:   "Segurança",
  infra:      "Infra",
  validation: "Validação",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function BadgePill({ badge }: { badge: SprintBadge }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-tech uppercase tracking-wider whitespace-nowrap"
      style={{
        background: `${badge.color}20`,
        color: badge.color,
        border: `1px solid ${badge.color}40`,
      }}
    >
      {badge.label}
    </span>
  );
}

function CatTag({ category }: { category: SprintEventCategory }) {
  const color = CAT_COLOR[category];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono-tech uppercase tracking-wider"
      style={{ color }}
    >
      <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: color }} />
      {CAT_LABEL[category]}
    </span>
  );
}

function EventCard({ event }: { event: SprintEvent }) {
  const color = CAT_COLOR[event.category] ?? "#64748b";
  return (
    <div
      className="rounded-lg border border-border bg-card/50 dark:bg-card/30 backdrop-blur-sm p-3 overflow-hidden"
      style={{ borderLeftColor: color, borderLeftWidth: 2 }}
    >
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <CatTag category={event.category} />
        {event.badges.map((b) => <BadgePill key={b.label} badge={b} />)}
      </div>
      <p className="font-display font-semibold text-[13px] text-foreground leading-snug mb-1">
        {event.title}
      </p>
      <p className="text-[11px] text-muted-foreground leading-snug mb-2">
        {event.description}
      </p>
      {event.metrics && event.metrics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.metrics.map((m) => (
            <span
              key={m}
              className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: `${color}11`, color, border: `1px solid ${color}22` }}
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Desktop day column ───────────────────────────────────────────────────────

function DayColumn({ day, index, isInView }: { day: SprintDay; index: number; isInView: boolean }) {
  const isHeavy = day.weight === "heavy";
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
      className="flex flex-col gap-2 min-w-0"
    >
      {/* Header */}
      <div
        className={`rounded-xl border border-border backdrop-blur-sm p-3 text-center ${
          isHeavy
            ? "bg-card/80 dark:bg-card/60"
            : "bg-card/60 dark:bg-card/40"
        }`}
        style={{ borderTopColor: day.color, borderTopWidth: isHeavy ? 3 : 2 }}
      >
        {isHeavy && (
          <span
            className="inline-block font-mono-tech text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded mb-1"
            style={{ background: `${day.color}18`, color: day.color }}
          >
            Fase Discovery
          </span>
        )}
        <p className="font-mono-tech text-[10px] uppercase tracking-widest" style={{ color: day.color }}>
          {day.dayLabel} · {day.dayOfWeek}
        </p>
        <p className={`font-display font-bold tabular-nums ${isHeavy ? "text-xl" : "text-lg"}`} style={{ color: day.color }}>
          {day.date}
        </p>
        <p className="text-[10px] text-muted-foreground leading-tight mt-1">{day.headline}</p>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-2">
        {day.events.map((ev) => <EventCard key={ev.id} event={ev} />)}
      </div>
    </motion.div>
  );
}

// ─── Mobile day row ───────────────────────────────────────────────────────────

function DayRow({ day, index, isInView }: { day: SprintDay; index: number; isInView: boolean }) {
  const isHeavy = day.weight === "heavy";
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
      className="relative pl-12"
    >
      {/* Circle on vertical line */}
      <div
        className="absolute left-0 top-3 w-9 h-9 rounded-full border-2 bg-background flex items-center justify-center font-mono-tech font-bold text-[11px] shrink-0"
        style={{ borderColor: day.color, color: day.color, boxShadow: `0 0 ${isHeavy ? 14 : 8}px ${day.color}44` }}
      >
        {day.date.split("/")[0]}
      </div>

      {/* Day header card */}
      <div
        className="rounded-xl border border-border bg-card/70 dark:bg-card/50 p-3 mb-3 backdrop-blur-sm"
        style={{ borderLeftColor: day.color, borderLeftWidth: isHeavy ? 3 : 2 }}
      >
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="font-mono-tech text-[10px] uppercase tracking-widest" style={{ color: day.color }}>
            {day.dayLabel} · {day.date} · {day.dayOfWeek}
          </p>
          {isHeavy && (
            <span
              className="font-mono-tech text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
              style={{ background: `${day.color}18`, color: day.color }}
            >
              Fase Discovery
            </span>
          )}
        </div>
        <p className="text-[12px] text-muted-foreground leading-snug">{day.headline}</p>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {day.events.map((ev) => <EventCard key={ev.id} event={ev} />)}
      </div>
    </motion.div>
  );
}

// ─── Summary bar ─────────────────────────────────────────────────────────────

const SUMMARY = [
  { label: "Docs AS-IS construídos", value: "16",   color: "#7c3aed" },
  { label: "ADRs criados",           value: "21",   color: "#0078d4" },
  { label: "Dívidas mapeadas",       value: "42",   color: "#dc2626" },
  { label: "Gaps identificados",     value: "53",   color: "#d97706" },
  { label: "Testes (100%)",          value: "191",  color: "#107c10" },
  { label: "Tasks executadas",       value: "215",  color: "#0891b2" },
] as const;

function SummaryBar({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={0}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
    >
      {SUMMARY.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-sm p-3 text-center"
          style={{ borderTopColor: item.color, borderTopWidth: 2 }}
        >
          <p className="font-display font-bold text-2xl tabular-nums" style={{ color: item.color }}>
            {item.value}
          </p>
          <p className="font-mono-tech text-[10px] text-muted-foreground mt-1 uppercase tracking-wider leading-tight">
            {item.label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

// ─── "Built by the team" callout ─────────────────────────────────────────────

function TeamCallout({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={0.5}
      className="mb-8 rounded-2xl border p-4 relative overflow-hidden"
      style={{ borderColor: "#7c3aed33", background: "rgba(124,58,237,0.04)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, #7c3aed, transparent)" }}
      />
      <div className="relative flex flex-col sm:flex-row sm:items-start gap-3">
        <div
          aria-hidden="true"
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{ background: "#7c3aed18", color: "#7c3aed", border: "1px solid #7c3aed33" }}
        >
          ✦
        </div>
        <div>
          <p className="font-display font-bold text-sm text-foreground mb-1">
            Documentação construída pela equipe — não recebida
          </p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            O sistema legado não possuía nenhuma documentação, testes ou especificação.
            A equipe Sistran realizou a engenharia reversa completa: leu as 906 classes Java, mapeou os
            fluxos de negócio, identificou as 42 dívidas técnicas e construiu do zero os 16 documentos AS-IS e
            os dois caminhos TO-BE completos. A inteligência artificial foi utilizada como ferramenta de apoio
            à análise e síntese — o entendimento e as decisões são da equipe.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Fork callout ────────────────────────────────────────────────────────────

function ForkCallout({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={1}
      className="mb-8 rounded-2xl border border-border bg-card/40 dark:bg-card/20 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-4 border-b border-border text-center">
        <p className="font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
          02/04/2026 — Dois caminhos projetados pela equipe
        </p>
        <p className="font-display font-bold text-base text-foreground">
          Ambos documentados em detalhe antes da decisão.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Path A */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono-tech text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border text-muted-foreground border-border">
              Caminho A — Não escolhido
            </span>
          </div>
          <p className="font-display font-semibold text-sm text-foreground mb-1">
            Java 25 LTS + Spring Boot 3.x + Angular 18
          </p>
          <p className="text-[11px] text-muted-foreground leading-snug mb-2">
            On-premises · WildFly · Oracle inalterado · 4.327 linhas de especificação
          </p>
          <ul className="space-y-1.5">
            {[
              "Banco Oracle mantido sem migração",
              "Sem escalabilidade elástica",
              "Infraestrutura on-premises preservada",
              "Reescrita completa necessária (JNDI acoplado)",
              "12 meses de sunset para SOAP partners",
            ].map((t) => (
              <li key={t} className="flex items-start gap-1.5">
                <span className="text-muted-foreground/50 mt-[3px] shrink-0 text-[11px]">–</span>
                <span className="text-[11px] text-muted-foreground leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Path B */}
        <div className="p-4 relative">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, #0078d4, transparent)" }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-mono-tech text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
              style={{ color: "#0078d4", borderColor: "#0078d430", background: "#0078d410" }}
            >
              Caminho B — Escolhido ✓
            </span>
          </div>
          <p className="font-display font-semibold text-sm text-foreground mb-1">
            .NET 9 + Azure Container Apps + Okta
          </p>
          <p className="text-[11px] text-muted-foreground leading-snug mb-2">
            Cloud-native · Clean Architecture · 21 ADRs · PCI DSS
          </p>
          <ul className="space-y-1.5">
            {[
              "Escalabilidade elástica (Azure Container Apps)",
              "Zero-downtime deploy em <5 minutos",
              "Managed Identity — sem secrets em código",
              "Okta MFA + App-to-App (ADR-009)",
              "Cielo.js — PAN/CVV nunca chegam ao backend",
              "191 testes, >80% cobertura",
            ].map((t) => (
              <li key={t} className="flex items-start gap-1.5">
                <span className="shrink-0 mt-[3px] text-[11px]" style={{ color: "#107c10" }}>✓</span>
                <span className="text-[11px] text-muted-foreground leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function DiscoverySprint() {
  const headingRef = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-50px" });
  const isBodyInView    = useInView(bodyRef,    { once: true, margin: "-60px" });
  const isGridInView    = useInView(gridRef,    { once: true, margin: "-40px" });
  const isMobileInView  = useInView(mobileRef,  { once: true, margin: "-40px" });

  return (
    <section id="sprint" className="relative border-t border-b border-border/50">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.035) 0%, transparent 70%)" }}
      />

      <div className="section-container relative z-10">

        {/* ── Heading ── */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, ease: EASE_SPRING }}
          className="mb-10 text-center"
        >
          <SectionLabel>Discovery & Implementação</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight max-w-3xl mx-auto mb-3">
            De um sistema{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #dc2626, #d97706)" }}
            >
              sem documentação
            </span>{" "}
            a{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #0078d4, #107c10)" }}
            >
              arquitetura cloud-native
            </span>{" "}
            em 10 dias
          </h2>
          <p className="font-mono-tech text-sm text-muted-foreground tracking-wide">
            31/03/2026 → 10/04/2026 · Engenharia reversa · Dois caminhos projetados · IA como ferramenta · Okta MFA + App-to-App
          </p>
        </motion.div>

        {/* ── Body ── */}
        <div ref={bodyRef}>
          <TeamCallout  isInView={isBodyInView} />
          <SummaryBar   isInView={isBodyInView} />
          <ForkCallout  isInView={isBodyInView} />
        </div>

        {/* ── Desktop grid ── */}
        <div ref={gridRef} className="hidden lg:grid lg:grid-cols-7 gap-3">
          {sprintDays.map((day, i) => (
            <DayColumn key={day.id} day={day} index={i + 1} isInView={isGridInView} />
          ))}
        </div>

        {/* ── Mobile vertical ── */}
        <div ref={mobileRef} className="lg:hidden relative">
          <div className="absolute left-[17px] top-0 bottom-0 w-[2px] overflow-hidden">
            <motion.div
              variants={lineGrow}
              initial="hidden"
              animate={isMobileInView ? "visible" : "hidden"}
              className="w-full h-full origin-top"
              style={{
                background:
                  "linear-gradient(180deg, #dc2626 0%, #d97706 30%, #0078d4 50%, #00297a 65%, #107c10 82%, #0891b2 100%)",
              }}
            />
          </div>
          <div className="space-y-2">
            {sprintDays.map((day, i) => (
              <DayRow key={day.id} day={day} index={i} isInView={isMobileInView} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
