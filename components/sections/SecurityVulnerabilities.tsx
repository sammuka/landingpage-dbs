"use client";

import { securityRows } from "@/lib/data/comparisons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldX } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function SecurityVulnerabilities() {
  return (
    <section id="security">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>Segurança</SectionLabel>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            9 vulnerabilidades críticas eliminadas
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Cada CVE identificado no sistema legado foi endereçado com uma solução moderna,
            auditável e alinhada às boas práticas de segurança em produção.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {securityRows.map((row) => (
            <motion.div
              key={row.id}
              variants={cardVariants}
              className={[
                "group relative flex flex-col overflow-hidden rounded-xl border",
                "border-border bg-card text-card-foreground",
                "shadow-sm transition-shadow duration-300 hover:shadow-md",
                "dark:border-white/[0.07] dark:bg-[#0d1526]",
              ].join(" ")}
            >
              {/* "Antes" strip — muted in light, vivid in dark */}
              <div className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: "rgba(220,38,38,0.08)",
                  borderBottom: "1px solid rgba(220,38,38,0.15)",
                }}
              >
                <ShieldX
                  className="size-4 shrink-0 text-red-500 dark:text-red-400"
                  aria-hidden="true"
                />
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
                  Antes
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                {/* Vulnerability name */}
                <p className="font-semibold leading-snug text-foreground text-[13px]">
                  {row.vulnerability}
                </p>

                {/* Legacy detail — muted amber in light, vivid in dark */}
                <p className="font-mono-tech text-[11px] leading-relaxed text-amber-700/80 dark:text-amber-400/90">
                  {row.legacyDetail}
                </p>

                {/* Arrow divider */}
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-bold text-blue-500 dark:text-[var(--color-azure-blue-l)]">→</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Fix */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <ShieldCheck
                      className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-[var(--color-green-ok-l)]"
                      aria-hidden="true"
                    />
                    <p className="font-semibold leading-snug text-[13px] text-green-700 dark:text-[var(--color-green-ok-l)]">
                      {row.fix}
                    </p>
                  </div>
                  <p className="pl-6 text-xs leading-relaxed text-muted-foreground">
                    {row.fixDetail}
                  </p>
                </div>

                {/* Badge */}
                <div className="mt-auto pt-2">
                  <span className="tag-fix">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    Eliminado
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
