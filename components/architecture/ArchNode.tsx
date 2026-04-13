"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface ArchNodeData {
  label: string;
  sublabel?: string;
  icon?: string;
  type?: "module" | "database" | "service" | "external" | "container" | "boundary";
  badge?: string;
  badgeVariant?: "crit" | "warn" | "ok" | "neutral";
  issues?: string[];
  tech?: string;
  description?: string;
  [key: string]: unknown;
}

const badgeColors: Record<string, string> = {
  crit: "bg-red-900/70 text-red-300 border-red-700/50",
  warn: "bg-amber-900/70 text-amber-300 border-amber-700/50",
  ok: "bg-green-900/70 text-green-300 border-green-700/50",
  neutral: "bg-slate-800/70 text-slate-300 border-slate-600/50",
};

const typeStyles: Record<string, string> = {
  module: "bg-amber-950/80 border-amber-700/60 text-amber-100",
  database: "bg-slate-900/90 border-slate-600/60 text-slate-100",
  service: "bg-blue-950/80 border-blue-700/60 text-blue-100",
  external: "bg-slate-950/80 border-slate-700/60 text-slate-300",
  container: "bg-blue-950/80 border-blue-600/60 text-blue-100",
  boundary: "bg-transparent border-dashed border-blue-700/50 text-blue-300",
};

export const ArchNode = memo(({ data }: NodeProps) => {
  const nodeData = data as ArchNodeData;
  const style = typeStyles[nodeData.type ?? "module"];
  const badgeStyle = badgeColors[nodeData.badgeVariant ?? "neutral"];

  return (
    <div
      className={`rounded-lg border px-3 py-2 min-w-[140px] max-w-[200px] ${style} shadow-lg`}
      style={{ fontSize: 13 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} className="!bg-slate-500 !w-2 !h-2" />

      {nodeData.icon && (
        <div className="mb-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/icons/azure/${nodeData.icon}`}
            alt=""
            className="w-6 h-6"
          />
        </div>
      )}

      <div className="font-semibold leading-tight text-[13px]">{nodeData.label}</div>

      {nodeData.sublabel && (
        <div className="text-[11px] opacity-70 mt-0.5 font-mono-tech">{nodeData.sublabel}</div>
      )}

      {nodeData.badge && (
        <div className={`inline-flex mt-1.5 px-1.5 py-0.5 rounded text-[10px] border ${badgeStyle}`}>
          {nodeData.badge}
        </div>
      )}

      {nodeData.tech && (
        <div className="mt-1 text-[11px] opacity-60 font-mono-tech">{nodeData.tech}</div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-slate-500 !w-2 !h-2" />
    </div>
  );
});

ArchNode.displayName = "ArchNode";
