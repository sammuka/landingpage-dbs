"use client";

import { TopologyLayer } from "./TopologyLayer";
import { VerticalArrow } from "./TopologyConnector";
import { topologyLayers } from "@/lib/data/topology";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export function ServiceTopology() {
  return (
    <div className="mb-14">
      {/* Sub-header */}
      <div className="mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Topologia de Serviços
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Fluxo de tráfego da borda ao banco de dados — todos os serviços Azure
          orquestrados via Managed Identity e Bicep IaC.
        </p>
      </div>

      {/* Topology Diagram */}
      <motion.div
        className={[
          "rounded-xl border p-5 sm:p-6",
          "bg-muted/30 dark:bg-[#080e1c]",
          "border-border dark:border-blue-800/20",
        ].join(" ")}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {topologyLayers.map((layer, index) => (
          <div key={layer.id}>
            <TopologyLayer layer={layer} />
            {/* Connector arrow to next layer */}
            {layer.connectionToNext && index < topologyLayers.length - 1 && (
              <VerticalArrow
                label={layer.connectionToNext.label || undefined}
                color={layer.connectionToNext.color}
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
