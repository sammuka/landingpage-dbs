"use client";

import Image from "next/image";
import { companies, client, projectMeta } from "@/lib/data/companies";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ─── Logo with theme awareness ────────────────────────────────────

interface ThemedLogoProps {
  company: (typeof companies)[number];
}

function ThemedLogo({ company }: ThemedLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: render placeholder until mounted
  if (!mounted) {
    return (
      <div
        style={{ width: 80, height: 28 }}
        className="rounded bg-muted/40 animate-pulse"
        aria-label={company.name}
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const src = isDark ? company.logoDark : company.logoLight;

  return (
    <Image
      src={src}
      alt={`${company.name} logo`}
      width={80}
      height={28}
      className="object-contain h-7 w-auto transition-all duration-200"
      style={
        isDark
          ? company.logoDark === company.logoLight
            ? { filter: "brightness(0) invert(1)" }
            : {}
          : { filter: "brightness(0.45) saturate(1.6)" }
      }
      unoptimized
    />
  );
}

// ─── Navigation links ─────────────────────────────────────────────

const footerLinks = [
  { label: "GitHub", href: "#" },
  { label: "Documentação", href: "#" },
  { label: "ADRs", href: "#adrs" },
] as const;

// ─── Footer component ─────────────────────────────────────────────

export function Footer() {
  const sistran = companies.find((c) => c.id === "sistran")!;
  const lumina = companies.find((c) => c.id === "lumina")!;

  return (
    <footer
      id="footer"
      className="border-t border-border bg-muted/20 dark:bg-[#060c18]/80"
    >
      {/* Top: gradient divider line */}
      <div className="section-divider" aria-hidden="true" />

      {/* Main content */}
      <div className="section-container py-10 lg:py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

          {/* Left — client info */}
          <div className="flex flex-col gap-2">
            <p className="font-display text-base font-semibold text-foreground">
              {client.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {client.system}
            </p>
            <p className="font-mono-tech text-xs text-muted-foreground/70 mt-1">
              DBS Transformation · {projectMeta.startDate}–{projectMeta.endDate}
            </p>
            <p className="font-mono-tech text-xs text-muted-foreground/60 leading-relaxed max-w-xs">
              {projectMeta.team}
            </p>
          </div>

          {/* Center — logos */}
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground">
              Implementação
            </p>
            <div className="flex items-center gap-3">
              <ThemedLogo company={sistran} />
              <span
                className="text-muted-foreground/50 text-lg font-light select-none"
                aria-hidden="true"
              >
                ×
              </span>
              <ThemedLogo company={lumina} />
            </div>
            <div className="flex gap-3">
              {companies.map((company) => (
                <p key={company.id} className="text-[11px] text-muted-foreground text-center">
                  {company.role}
                </p>
              ))}
            </div>
          </div>

          {/* Right — links */}
          <nav aria-label="Links do rodapé" className="flex flex-col gap-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-[var(--color-azure-blue-l)] transition-colors duration-150 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom strip — disclaimer */}
      <div className="border-t border-border/60 bg-muted/10 dark:bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground/70 text-center sm:text-left">
            Dados extraídos da documentação técnica oficial do projeto DBS. © 2026 Sistran × Lumina AI.
          </p>
          <p className="font-mono-tech text-[10px] text-muted-foreground/50 text-center sm:text-right whitespace-nowrap">
            Powered by Next.js 16.1.6 · Azure Container Apps · .NET 10 LTS
          </p>
        </div>
      </div>
    </footer>
  );
}
