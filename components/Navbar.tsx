"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "#timeline", label: "Jornada" },
  { href: "#architecture", label: "Arquitetura" },
  { href: "#endpoints", label: "Endpoints" },
  { href: "#stack", label: "Stack" },
  { href: "#security", label: "Segurança" },
  { href: "#devops", label: "DevOps" },
  { href: "#adrs", label: "ADRs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : true;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md border-b border-border bg-background/80"
          : "bg-transparent"
      }`}
    >
      {/* Gradient top line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(90deg, #0078d4, #107c10)",
        }}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logos */}
        <div className="flex items-center gap-4">
          <Image
            src="/logo-sistran.png"
            alt="Sistran"
            width={100}
            height={28}
            className={`h-7 w-auto object-contain transition-all duration-200 ${!isDark ? "brightness-50 saturate-150" : ""}`}
            style={!isDark ? { filter: "brightness(0.45) saturate(1.6)" } : {}}
            unoptimized
          />
          <span className="text-muted-foreground/40 text-sm">×</span>
          <Image
            src={isDark ? "/logo-lumina-branca.png" : "/logo-lumina-azul.png"}
            alt="Lumina AI"
            width={90}
            height={24}
            className="h-6 w-auto object-contain transition-all duration-200"
            style={!isDark ? { filter: "brightness(0.5) saturate(1.8)" } : {}}
            unoptimized
          />
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono-tech tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono-tech py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
