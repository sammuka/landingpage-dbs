"use client";

import { motion } from "framer-motion";

const float = {
  animate: {
    x: [0, 30, 0],
    y: [0, -20, 0],
    scale: [1, 1.05, 1],
  },
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export function Orbs() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden orb-container"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* Azure blue — top right */}
      <motion.div
        className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{ background: "rgba(0,120,212,0.14)" }}
        animate={float.animate}
        transition={float.transition}
      />
      {/* Indigo — middle left */}
      <motion.div
        className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full blur-[130px]"
        style={{ background: "rgba(99,102,241,0.10)" }}
        animate={float.animate}
        transition={{ ...float.transition, delay: 5 }}
      />
      {/* Green — bottom right */}
      <motion.div
        className="absolute -bottom-16 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px]"
        style={{ background: "rgba(16,124,16,0.09)" }}
        animate={float.animate}
        transition={{ ...float.transition, delay: 10 }}
      />
    </div>
  );
}
