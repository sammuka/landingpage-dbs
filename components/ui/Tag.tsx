interface TagProps {
  children: React.ReactNode;
  variant?: "crit" | "fix" | "neutral" | "amber" | "blue";
  className?: string;
}

export function Tag({ children, variant = "neutral", className = "" }: TagProps) {
  const variantClass = {
    crit: "tag-crit",
    fix: "tag-fix",
    neutral: "tag-neutral",
    amber: "tag-amber",
    blue: "tag-blue",
  }[variant];

  return (
    <span className={`${variantClass} ${className}`}>
      {children}
    </span>
  );
}
