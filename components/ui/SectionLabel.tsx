interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`font-mono-tech text-xs tracking-widest uppercase text-[var(--color-azure-blue-l)] mb-3 ${className}`}
    >
      {children}
    </p>
  );
}
