interface BrowserFrameProps {
  title: string;
  url: string;
  children: React.ReactNode;
  className?: string;
  variant?: "legacy" | "modern";
}

export function BrowserFrame({
  title,
  url,
  children,
  className = "",
  variant = "modern",
}: BrowserFrameProps) {
  const isLegacy = variant === "legacy";

  return (
    <div
      className={`rounded-lg overflow-hidden border ${
        isLegacy ? "border-slate-400/30" : "border-border"
      } ${className}`}
    >
      {/* Browser chrome */}
      <div
        className={`flex items-center gap-2 px-3 py-2 ${
          isLegacy
            ? "bg-[#d4d0c8]"
            : "bg-muted border-b border-border"
        }`}
      >
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div
            className={`w-3 h-3 rounded-full ${
              isLegacy ? "bg-[#808080]" : "bg-red-500"
            }`}
          />
          <div
            className={`w-3 h-3 rounded-full ${
              isLegacy ? "bg-[#808080]" : "bg-yellow-500"
            }`}
          />
          <div
            className={`w-3 h-3 rounded-full ${
              isLegacy ? "bg-[#808080]" : "bg-green-500"
            }`}
          />
        </div>
        {/* URL bar */}
        <div
          className={`flex-1 mx-2 px-3 py-1 rounded text-xs font-mono-tech truncate ${
            isLegacy
              ? "bg-white border border-[#999] text-[#333]"
              : "bg-background border border-border text-muted-foreground"
          }`}
        >
          {url}
        </div>
        {/* Title */}
        <span
          className={`text-xs truncate hidden sm:block ${
            isLegacy ? "text-[#333]" : "text-muted-foreground"
          }`}
        >
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="overflow-auto max-h-[420px]">
        {children}
      </div>
    </div>
  );
}
