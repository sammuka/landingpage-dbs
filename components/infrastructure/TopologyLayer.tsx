"use client";

import { TopologyNode } from "./TopologyNode";
import { HorizontalArrow } from "./TopologyConnector";
import type { TopologyLayer as TLayer } from "@/lib/data/topology";
import { motion } from "framer-motion";

// ─── Color classes ────────────────────────────────────────────────

const layerColors: Record<string, { dot: string; label: string; line: string; boundary: string; crossBg: string }> = {
  blue: {
    dot: "bg-blue-500 dark:bg-blue-400",
    label: "text-blue-600 dark:text-blue-400",
    line: "from-blue-500/30 dark:from-blue-400/20",
    boundary: "border-blue-300/50 dark:border-blue-600/30",
    crossBg: "",
  },
  slate: {
    dot: "bg-slate-500 dark:bg-slate-400",
    label: "text-slate-600 dark:text-slate-400",
    line: "from-slate-400/30 dark:from-slate-500/20",
    boundary: "border-slate-300/50 dark:border-slate-600/30",
    crossBg: "",
  },
  green: {
    dot: "bg-green-500 dark:bg-green-400",
    label: "text-green-600 dark:text-green-400",
    line: "from-green-500/30 dark:from-green-400/20",
    boundary: "border-green-300/50 dark:border-green-600/30",
    crossBg: "bg-green-50/50 dark:bg-green-950/10",
  },
  amber: {
    dot: "bg-amber-500 dark:bg-amber-400",
    label: "text-amber-600 dark:text-amber-400",
    line: "from-amber-500/30 dark:from-amber-400/20",
    boundary: "border-amber-300/50 dark:border-amber-600/30",
    crossBg: "",
  },
  purple: {
    dot: "bg-purple-500 dark:bg-purple-400",
    label: "text-purple-600 dark:text-purple-400",
    line: "from-purple-500/30 dark:from-purple-400/20",
    boundary: "border-purple-300/50 dark:border-purple-600/30",
    crossBg: "",
  },
};

const layerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────

interface TopologyLayerProps {
  layer: TLayer;
}

export function TopologyLayer({ layer }: TopologyLayerProps) {
  const colors = layerColors[layer.color] ?? layerColors.slate;
  const isEdge = layer.id === "edge";

  // ── Cross-cutting layer (security) has special visual ──
  if (layer.isCrossCutting) {
    return (
      <motion.div variants={layerVariants}>
        <div className={`rounded-lg px-4 py-4 ${colors.crossBg} border border-dashed ${colors.boundary}`}>
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            <span className={`text-[10px] font-mono-tech tracking-widest uppercase ${colors.label}`}>
              {layer.label}
            </span>
            {layer.sublabel && (
              <span className="text-[10px] font-mono-tech text-muted-foreground/50 hidden sm:inline">
                — {layer.sublabel}
              </span>
            )}
            <div className={`flex-1 h-px bg-gradient-to-r ${colors.line} to-transparent`} />
          </div>

          {/* Nodes */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            {layer.nodes.map((node) => (
              <TopologyNode key={node.id} node={node} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Edge layer has horizontal flow (Internet → Front Door) ──
  if (isEdge) {
    return (
      <motion.div variants={layerVariants}>
        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          <span className={`text-[10px] font-mono-tech tracking-widest uppercase ${colors.label}`}>
            {layer.label}
          </span>
          <div className={`flex-1 h-px bg-gradient-to-r ${colors.line} to-transparent`} />
        </div>

        {/* Horizontal flow: Internet → Arrow → Front Door */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
          <TopologyNode node={layer.nodes[0]} />
          <HorizontalArrow color="slate" />
          <TopologyNode node={layer.nodes[1]} />
        </div>
      </motion.div>
    );
  }

  // ── Standard layer ──
  return (
    <motion.div variants={layerVariants}>
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        <span className={`text-[10px] font-mono-tech tracking-widest uppercase ${colors.label}`}>
          {layer.label}
        </span>
        {layer.sublabel && (
          <span className="text-[10px] font-mono-tech text-muted-foreground/50 hidden sm:inline">
            — {layer.sublabel}
          </span>
        )}
        <div className={`flex-1 h-px bg-gradient-to-r ${colors.line} to-transparent`} />
      </div>

      {/* Boundary wrapper (VNet) or plain nodes */}
      {layer.isBoundary ? (
        <div className={`rounded-lg border border-dashed ${colors.boundary} px-4 py-4`}>
          {layer.boundaryLabel && (
            <div className="text-[9px] font-mono-tech text-muted-foreground/50 uppercase tracking-wider mb-3 text-center">
              {layer.boundaryLabel}
            </div>
          )}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            {layer.nodes.map((node) => (
              <TopologyNode key={node.id} node={node} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          {layer.nodes.map((node) => (
            <TopologyNode key={node.id} node={node} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
