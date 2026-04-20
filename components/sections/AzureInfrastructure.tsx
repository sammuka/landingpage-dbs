"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceTopology } from "@/components/infrastructure/ServiceTopology";
import { CategoryGroup } from "@/components/infrastructure/CategoryGroup";
import {
  infraCategories,
  infraTotalServices,
} from "@/lib/data/infrastructure";
import { motion } from "framer-motion";

// ─── Connector between category groups ────────────────────────────

function InfraConnector() {
  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <div className="flex flex-col items-center gap-0">
        <div className="w-px h-4 border-l border-dashed border-[var(--color-azure-blue-l)]/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-azure-blue-l)]/30" />
        <div className="w-px h-4 border-l border-dashed border-[var(--color-azure-blue-l)]/20" />
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────

export function AzureInfrastructure() {
  return (
    <section id="infrastructure" className="bg-background">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionLabel>Infraestrutura Azure</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Provisionamento cloud-native —{" "}
            <span className="text-[var(--color-azure-blue-l)]">
              {infraTotalServices} serviços Azure
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Toda infraestrutura gerenciada via Bicep (IaC), zero configuração
            manual. Managed Identity em todos os recursos — nenhuma senha ou
            connection string no código.
          </p>
        </motion.div>

        {/* Service Topology Diagram */}
        <ServiceTopology />

        {/* Category Groups with connectors */}
        <div className="flex flex-col gap-0">
          {infraCategories.map((group, index) => (
            <div key={group.id}>
              <CategoryGroup group={group} />
              {index < infraCategories.length - 1 && <InfraConnector />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
