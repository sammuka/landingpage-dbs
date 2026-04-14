"use client";

import { useState, useEffect, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container } from "@tsparticles/engine";
import { useTheme } from "next-themes";

export function ParticlesBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = useCallback(async (_container?: Container) => {}, []);

  if (!init) return null;

  return (
    <Particles
      key={isDark ? "dark" : "light"}
      id="bg-particles"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      particlesLoaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        fpsLimit: 30,
        particles: {
          number: { value: 55 },
          color: { value: isDark ? "#ffffff" : "#94a3b8" },
          opacity: { value: isDark ? 0.2 : 0.3 },
          links: {
            enable: true,
            distance: 200,
            color: isDark ? "#ffffff" : "#94a3b8",
            opacity: isDark ? 0.1 : 0.15,
          },
          move: {
            enable: true,
            speed: 0.22,
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
