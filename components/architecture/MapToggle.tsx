"use client";

interface MapToggleProps {
  active: "legacy" | "cloud";
  onChange: (view: "legacy" | "cloud") => void;
}

export function MapToggle({ active, onChange }: MapToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => onChange("legacy")}
        className={`px-5 py-2 text-sm font-mono-tech transition-all ${
          active === "legacy"
            ? "bg-amber-900/60 text-amber-200 border-r border-amber-700/50"
            : "bg-transparent text-muted-foreground hover:text-foreground border-r border-border"
        }`}
      >
        ⚠ ANTES — Monolito Java EE
      </button>
      <button
        onClick={() => onChange("cloud")}
        className={`px-5 py-2 text-sm font-mono-tech transition-all ${
          active === "cloud"
            ? "bg-blue-900/60 text-blue-200"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        ✓ DEPOIS — Azure Cloud Native
      </button>
    </div>
  );
}
