"use client";

import { keyADRs } from "@/lib/data/cloud";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { motion } from "framer-motion";
import { Layers, Building, Zap, Shield, Lock, Cloud, Key, Plug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Icon map ─────────────────────────────────────────────────────

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  building: Building,
  zap: Zap,
  shield: Shield,
  lock: Lock,
  cloud: Cloud,
  key: Key,
  plug: Plug,
};

// ─── Individual ADR Card ──────────────────────────────────────────

interface ADRCardProps {
  adr: (typeof keyADRs)[number];
  index: number;
}

function ADRCard({ adr, index }: ADRCardProps) {
  const IconComponent = iconMap[adr.icon] ?? Layers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col transition-shadow duration-200 hover:shadow-lg hover:shadow-blue-900/20 dark:hover:shadow-blue-900/40">
        {/* Header */}
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            {/* ADR number + icon */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <span className="font-mono-tech text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border">
                {adr.number}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-azure-blue)]/10 dark:bg-[var(--color-azure-blue)]/20 border border-[var(--color-azure-blue)]/20">
                <IconComponent className="h-4 w-4 text-[var(--color-azure-blue-l)]" />
              </div>
            </div>

            {/* Title */}
            <CardTitle className="font-display text-base font-semibold text-foreground leading-snug pt-0.5">
              {adr.title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pt-4 flex-1">
          {/* Context */}
          <div>
            <p className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Contexto
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{adr.context}</p>
          </div>

          {/* Decision */}
          <div>
            <p className="font-mono-tech text-[10px] uppercase tracking-widest text-[var(--color-azure-blue-l)] mb-1">
              Decisão
            </p>
            <p className="text-sm font-semibold text-foreground leading-relaxed">{adr.decision}</p>
          </div>

          {/* Consequences */}
          <div className="mt-auto border-t border-border pt-3 flex flex-col gap-1">
            {adr.consequences.positive.map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs">
                <span className="text-[var(--color-green-ok-l)] shrink-0 mt-px font-bold">✓</span>
                <span className="text-foreground/80 leading-snug">{item}</span>
              </div>
            ))}
            {adr.consequences.negative.map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs">
                <span className="text-muted-foreground shrink-0 mt-px">·</span>
                <span className="text-muted-foreground leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────

export function ADRCards() {
  return (
    <section id="adrs" className="bg-background">
      <div className="section-container">
        {/* Header */}
        <SectionLabel>Decisões Arquiteturais</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
          22 ADRs versionados —{" "}
          <span className="text-[var(--color-azure-blue-l)]">9 decisões</span> mais impactantes
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {keyADRs.map((adr, index) => (
            <ADRCard key={adr.id} adr={adr} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
