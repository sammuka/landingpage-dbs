"use client";

import { AzureIcon } from "@/components/ui/AzureIcon";
import type { TopologyNode as TNode, BadgeVariant } from "@/lib/data/topology";

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

interface TopologyNodeProps {
  node: TNode;
}

export function TopologyNode({ node }: TopologyNodeProps) {
  return (
    <div
      className={[
        "relative flex flex-col items-center gap-1.5 rounded-lg border px-3 py-2.5",
        "min-w-[130px] max-w-[180px] w-full sm:w-auto",
        "bg-card text-card-foreground shadow-sm",
        "border-border",
        "dark:border-transparent dark:bg-[#0d1526]",
        "dark:[box-shadow:inset_0_0_0_1px_rgba(96,165,250,0.12),0_1px_2px_rgba(0,0,0,0.3)]",
        "transition-shadow duration-200 hover:shadow-md",
      ].join(" ")}
    >
      <AzureIcon name={node.icon} size={24} />

      <div className="text-center">
        <div className="text-[12px] font-semibold text-foreground leading-tight">
          {node.name}
        </div>
        <div className="text-[10px] font-mono-tech text-muted-foreground leading-tight mt-0.5">
          {node.sublabel}
        </div>
      </div>

      {/* Port + Badge row */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {node.port && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono-tech font-bold border dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700/40 bg-blue-50 text-blue-700 border-blue-200">
            {node.port}
          </span>
        )}
        {node.badge && (
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${badgeClass(node.badgeVariant ?? "neutral")}`}
          >
            {node.badge}
          </span>
        )}
      </div>
    </div>
  );
}
