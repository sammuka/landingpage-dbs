// Vertical and horizontal arrow connectors for topology diagram

const colorMap: Record<string, { line: string; arrow: string; text: string }> = {
  blue: {
    line: "bg-blue-500/30 dark:bg-blue-400/25",
    arrow: "border-t-blue-500/50 dark:border-t-blue-400/40",
    text: "text-blue-600/60 dark:text-blue-400/50",
  },
  green: {
    line: "bg-green-500/30 dark:bg-green-400/25",
    arrow: "border-t-green-500/50 dark:border-t-green-400/40",
    text: "text-green-600/60 dark:text-green-400/50",
  },
  amber: {
    line: "bg-amber-500/30 dark:bg-amber-400/25",
    arrow: "border-t-amber-500/50 dark:border-t-amber-400/40",
    text: "text-amber-600/60 dark:text-amber-400/50",
  },
  slate: {
    line: "bg-slate-400/30 dark:bg-slate-500/25",
    arrow: "border-t-slate-400/50 dark:border-t-slate-500/40",
    text: "text-slate-500/60 dark:text-slate-400/50",
  },
  purple: {
    line: "bg-purple-500/30 dark:bg-purple-400/25",
    arrow: "border-t-purple-500/50 dark:border-t-purple-400/40",
    text: "text-purple-600/60 dark:text-purple-400/50",
  },
};

// ─── Vertical Arrow ───────────────────────────────────────────────

interface VerticalArrowProps {
  label?: string;
  color?: string;
}

export function VerticalArrow({ label, color = "slate" }: VerticalArrowProps) {
  const c = colorMap[color] ?? colorMap.slate;

  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <div className="flex flex-col items-center gap-0">
        <div className={`w-px h-5 ${c.line}`} />
        {label && (
          <span className={`text-[9px] font-mono-tech tracking-wider ${c.text} py-0.5`}>
            {label}
          </span>
        )}
        <div className={`w-px h-3 ${c.line}`} />
        {/* Triangle */}
        <div
          className={`w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent ${c.arrow}`}
        />
      </div>
    </div>
  );
}

// ─── Horizontal Arrow (used inside Edge layer) ────────────────────

export function HorizontalArrow({ color = "slate" }: { color?: string }) {
  const c = colorMap[color] ?? colorMap.slate;

  return (
    <div className="flex items-center gap-0 mx-2 shrink-0" aria-hidden="true">
      <div className={`h-px w-6 sm:w-10 ${c.line}`} />
      <div
        className={`w-0 h-0 border-t-[4px] border-b-[4px] border-l-[5px] border-t-transparent border-b-transparent border-l-slate-400/50 dark:border-l-slate-500/40`}
      />
    </div>
  );
}
