"use client";

import {
  Server,
  Database,
  Shield,
  Activity,
  GitBranch,
  Globe,
} from "lucide-react";
import { InfraCard } from "./InfraCard";
import type { InfraCategoryGroup } from "@/lib/data/infrastructure";
import { motion } from "framer-motion";

// ─── Icon resolver ────────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  server: Server,
  database: Database,
  shield: Shield,
  activity: Activity,
  "git-branch": GitBranch,
  globe: Globe,
};

// ─── Accent color classes per category ────────────────────────────

const colorClasses: Record<
  string,
  { icon: string; line: string; label: string }
> = {
  blue: {
    icon: "text-blue-500 dark:text-blue-400",
    line: "from-blue-500/40 dark:from-blue-400/30",
    label: "text-blue-600 dark:text-blue-400",
  },
  slate: {
    icon: "text-slate-500 dark:text-slate-400",
    line: "from-slate-500/40 dark:from-slate-400/30",
    label: "text-slate-600 dark:text-slate-400",
  },
  green: {
    icon: "text-green-600 dark:text-green-400",
    line: "from-green-500/40 dark:from-green-400/30",
    label: "text-green-600 dark:text-green-400",
  },
  purple: {
    icon: "text-purple-500 dark:text-purple-400",
    line: "from-purple-500/40 dark:from-purple-400/30",
    label: "text-purple-600 dark:text-purple-400",
  },
  amber: {
    icon: "text-amber-500 dark:text-amber-400",
    line: "from-amber-500/40 dark:from-amber-400/30",
    label: "text-amber-600 dark:text-amber-400",
  },
  neutral: {
    icon: "text-slate-500 dark:text-slate-400",
    line: "from-slate-500/30 dark:from-slate-400/20",
    label: "text-slate-600 dark:text-slate-400",
  },
};

// ─── Animation variants ───────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────

interface CategoryGroupProps {
  group: InfraCategoryGroup;
}

export function CategoryGroup({ group }: CategoryGroupProps) {
  const Icon = iconMap[group.lucideIcon] ?? Server;
  const colors = colorClasses[group.color] ?? colorClasses.blue;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
    >
      {/* ── Category Header ── */}
      <motion.div
        variants={headerVariants}
        className="flex items-center gap-3 mb-4"
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card dark:bg-[#0d1526] ${colors.icon}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <h3
          className={`font-display text-lg font-semibold ${colors.label}`}
        >
          {group.label}
        </h3>
        <div
          className={`flex-1 h-px bg-gradient-to-r ${colors.line} to-transparent`}
        />
      </motion.div>

      {/* ── Cards Grid ── */}
      <motion.div
        variants={containerVariants}
        className={[
          "grid gap-4",
          group.services.length >= 3
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2",
        ].join(" ")}
      >
        {group.services.map((service) => (
          <InfraCard key={service.id} service={service} />
        ))}
      </motion.div>
    </motion.div>
  );
}
