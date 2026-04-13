"use client";

import { stackRows } from "@/lib/data/comparisons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Summary stat card ────────────────────────────────────────────────────────

interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl border border-border bg-card">
      <span className="font-mono-tech text-2xl font-bold text-[var(--color-azure-blue-l)]">
        {value}
      </span>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

// ─── Legacy cell renderer ─────────────────────────────────────────────────────

interface LegacyCellProps {
  text: string;
  status?: "eol" | "warning" | "ok";
}

function LegacyCell({ text, status }: LegacyCellProps) {
  if (status === "eol") {
    return (
      <span className="flex items-center gap-2 flex-wrap">
        <span className="text-red-400/80">{text}</span>
        <Tag variant="crit">EOL</Tag>
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="flex items-center gap-2 flex-wrap">
        <span className="text-amber-400/80">{text}</span>
        <Tag variant="amber">⚠</Tag>
      </span>
    );
  }
  return <span className="text-muted-foreground">{text}</span>;
}

// ─── Section ─────────────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export function StackComparison() {
  return (
    <section id="stack" className="section-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <SectionLabel>Stack Tecnológico</SectionLabel>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Comparativo completo —{" "}
            <span className="text-[var(--color-azure-blue-l)]">20 dimensões</span>
          </h2>
        </motion.div>

        {/* Table card */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-card overflow-hidden shadow-sm mb-10"
        >
          {/* Sticky-header wrapper */}
          <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card shadow-[0_1px_0_0_var(--color-border)]">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="w-[180px] min-w-[140px] font-mono-tech text-[11px] tracking-widest uppercase text-muted-foreground px-4 py-3">
                    Categoria
                  </TableHead>
                  <TableHead className="min-w-[200px] font-mono-tech text-[11px] tracking-widest uppercase text-red-400/70 px-4 py-3">
                    Legado
                  </TableHead>
                  <TableHead className="min-w-[200px] font-mono-tech text-[11px] tracking-widest uppercase text-green-400/70 px-4 py-3">
                    Novo
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stackRows.map((row, idx) => (
                  <TableRow
                    key={row.category}
                    className={cn(
                      "border-b border-border/60 transition-colors",
                      row.highlight
                        ? "bg-blue-950/20 dark:bg-blue-950/20 hover:bg-blue-950/30"
                        : idx % 2 === 0
                        ? "bg-transparent hover:bg-muted/30"
                        : "bg-muted/10 hover:bg-muted/30"
                    )}
                  >
                    {/* Category */}
                    <TableCell className="px-4 py-3">
                      <span
                        className={cn(
                          "font-mono-tech text-xs font-semibold whitespace-nowrap",
                          row.highlight
                            ? "text-[var(--color-azure-blue-l)]"
                            : "text-foreground/80"
                        )}
                      >
                        {row.category}
                      </span>
                    </TableCell>

                    {/* Legacy */}
                    <TableCell className="px-4 py-3 text-sm">
                      <LegacyCell text={row.legacy} status={row.legacyStatus} />
                    </TableCell>

                    {/* Modern */}
                    <TableCell className="px-4 py-3 text-sm">
                      <span
                        className={cn(
                          row.highlight
                            ? "text-green-400 dark:text-green-400 font-medium"
                            : "text-foreground/80"
                        )}
                      >
                        {row.modern}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Summary stats */}
        <motion.div variants={itemVariants}>
          {/* Divider label */}
          <p className="text-center text-xs font-mono-tech text-muted-foreground mb-4 tracking-wider uppercase">
            Resumo da modernização
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard value="20" label="dimensões comparadas" />
            <StatCard value="7" label="componentes EOL eliminados" />
            <StatCard value="100%" label="cloud-native" />
          </div>

          {/* One-liner summary */}
          <p className="mt-6 text-center text-xs font-mono-tech text-muted-foreground/60 tracking-wide">
            20 dimensões comparadas · 7 componentes EOL eliminados · 100% cloud-native
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
