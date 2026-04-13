"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArchNode } from "./ArchNode";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { ArchNodeData } from "./ArchNode";

const nodeTypes = { arch: ArchNode };

const initialNodes: Node[] = [
  // Módulos principais
  {
    id: "dbs-lib",
    type: "arch",
    position: { x: 350, y: 30 },
    data: {
      label: "dbs-lib",
      sublabel: "142 classes",
      type: "module",
      badge: "Biblioteca",
      badgeVariant: "warn",
      tech: "Java 8 · Eclipse",
      description: "Biblioteca compartilhada. Utilitários, constantes, modelos. Acoplamento circular com dbs e dbspag.",
      issues: ["Acoplamento circular", "Classes com 800+ linhas", "Zero testes"],
    } satisfies ArchNodeData,
  },
  {
    id: "dbs",
    type: "arch",
    position: { x: 350, y: 160 },
    data: {
      label: "dbs",
      sublabel: "289 classes · 62k linhas",
      type: "module",
      badge: "Core",
      badgeVariant: "crit",
      tech: "EJB 3.1 · JBoss",
      description: "Módulo de negócio central. BillingServiceBean com 4.700+ linhas. Sem testes.",
      issues: ["BillingServiceBean 4.700+ linhas", "Transações XA sem compensação", "42 TODO críticos"],
    } satisfies ArchNodeData,
  },
  {
    id: "dbsdb",
    type: "arch",
    position: { x: 140, y: 280 },
    data: {
      label: "dbsdb",
      sublabel: "67 classes",
      type: "module",
      badge: "Data",
      badgeVariant: "crit",
      tech: "JDBC direto",
      description: "Camada de dados. SQL por concatenação de strings. Sem ORM.",
      issues: ["SQL Injection por concatenação", "Pool de conexões não gerenciado"],
    } satisfies ArchNodeData,
  },
  {
    id: "dbs-ws",
    type: "arch",
    position: { x: 560, y: 280 },
    data: {
      label: "dbs-ws",
      sublabel: "198 classes · ~300 stubs",
      type: "module",
      badge: "CVE-2022-46364",
      badgeVariant: "crit",
      tech: "Apache CXF 2.7.17",
      description: "Web Services SOAP. ~300 stubs gerados. Apache CXF 2.7.17 com CVE crítico.",
      issues: ["Apache CXF 2.7.17 EOL", "CVE-2022-46364 SSRF/RCE", "WS-Security com cert auto-assinado"],
    } satisfies ArchNodeData,
  },
  {
    id: "dbsportal",
    type: "arch",
    position: { x: 30, y: 420 },
    data: {
      label: "dbsportal",
      sublabel: "187 classes",
      type: "module",
      badge: "EOL 2013",
      badgeVariant: "crit",
      tech: "Struts 1.3 · JSP",
      description: "Portal de administração. Struts 1.3 (EOL 2013). JSPs com lógica de negócio.",
      issues: ["Struts 1.3 EOL", "CVE-2023-34396 RCE", "Sessão HTTP sem expiração"],
    } satisfies ArchNodeData,
  },
  {
    id: "dbspag",
    type: "arch",
    position: { x: 350, y: 420 },
    data: {
      label: "dbspag",
      sublabel: "198 classes · 44k linhas",
      type: "module",
      badge: "Pagamentos",
      badgeVariant: "crit",
      tech: "EJB · JBoss",
      description: "Módulo de pagamentos. AES-CBC com IV zeros. Dados de cartão em cache sem TTL.",
      issues: ["AES-CBC IV zeros", "PAN em log texto plano", "Cache sem TTL"],
    } satisfies ArchNodeData,
  },
  {
    id: "dbstimer",
    type: "arch",
    position: { x: 640, y: 420 },
    data: {
      label: "dbstimer",
      sublabel: "52 classes",
      type: "module",
      badge: "Timer",
      badgeVariant: "warn",
      tech: "EJB Timer · JBoss",
      description: "Jobs batch via EJB Timer Service. Sem persistência — perde jobs no restart.",
      issues: ["EJB Timer sem persistência", "Sem retry / dead-letter"],
    } satisfies ArchNodeData,
  },
  // Infra
  {
    id: "oracle",
    type: "arch",
    position: { x: 140, y: 560 },
    data: {
      label: "Oracle 19c/21c",
      sublabel: "On-premises",
      type: "database",
      badge: "Database",
      badgeVariant: "neutral",
      tech: "Oracle 19c/21c",
      description: "Banco de dados Oracle 19c/21c on-premises. Schema sem versionamento.",
    } satisfies ArchNodeData,
  },
  {
    id: "jboss",
    type: "arch",
    position: { x: 350, y: 560 },
    data: {
      label: "JBoss EAP 7.4",
      sublabel: "App Server",
      type: "external",
      badge: "EOL 2026",
      badgeVariant: "warn",
      tech: "JBoss EAP 7.4",
      description: "Application Server JBoss EAP 7.4. Deploy de EAR com 4–6h de downtime.",
    } satisfies ArchNodeData,
  },
  // Externos
  {
    id: "braspag-soap",
    type: "arch",
    position: { x: 760, y: 160 },
    data: {
      label: "Braspag/Cielo",
      sublabel: "SOAP (legado)",
      type: "external",
      badge: "SOAP",
      badgeVariant: "warn",
      tech: "cieloecommerce.cielo.com.br",
      description: "Gateway de pagamento via SOAP. URLs legadas descontinuadas pela Cielo.",
    } satisfies ArchNodeData,
  },
  {
    id: "acsel",
    type: "arch",
    position: { x: 760, y: 300 },
    data: {
      label: "ACSEL / ELITA",
      sublabel: "Parceiros legados",
      type: "external",
      badge: "SOAP",
      badgeVariant: "neutral",
      tech: "WS-Security XML",
      description: "Sistemas parceiros que consomem os serviços SOAP do DBS.",
    } satisfies ArchNodeData,
  },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "dbs", target: "dbs-lib", style: { stroke: "#d97706", strokeWidth: 2 } },
  { id: "e2", source: "dbsdb", target: "dbs-lib", style: { stroke: "#d97706", strokeWidth: 1.5 } },
  { id: "e3", source: "dbsdb", target: "dbs", style: { stroke: "#d97706", strokeWidth: 1.5 } },
  { id: "e4", source: "dbs-ws", target: "dbs-lib", style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e5", source: "dbs-ws", target: "dbs", style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e6", source: "dbsportal", target: "dbs-lib", style: { stroke: "#d97706", strokeWidth: 1.5 } },
  { id: "e7", source: "dbsportal", target: "dbs", style: { stroke: "#d97706", strokeWidth: 1.5 } },
  { id: "e8", source: "dbsportal", target: "dbsdb", style: { stroke: "#d97706", strokeWidth: 1.5 } },
  { id: "e9", source: "dbspag", target: "dbs-lib", style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e10", source: "dbspag", target: "dbs", style: { stroke: "#ef4444", strokeWidth: 2.5 } },
  { id: "e11", source: "dbspag", target: "dbsdb", style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e12", source: "dbspag", target: "dbs-ws", style: { stroke: "#ef4444", strokeWidth: 2.5 } },
  { id: "e13", source: "dbstimer", target: "dbs", style: { stroke: "#d97706", strokeWidth: 1.5 } },
  { id: "e14", source: "dbstimer", target: "dbspag", style: { stroke: "#d97706", strokeWidth: 1.5 } },
  { id: "e15", source: "dbsdb", target: "oracle", style: { stroke: "#64748b", strokeWidth: 2 } },
  { id: "e16", source: "dbs-ws", target: "braspag-soap", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 } },
  { id: "e17", source: "acsel", target: "dbs-ws", animated: true, style: { stroke: "#64748b", strokeWidth: 1.5 } },
];

interface SelectedNode {
  label: string;
  description?: string;
  tech?: string;
  issues?: string[];
  badge?: string;
}

export function LegacyMap() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as unknown as SelectedNode);
    setSheetOpen(true);
  }, []);

  return (
    <>
      <div
        className="w-full h-[580px] rounded-xl overflow-hidden border border-amber-800/30"
        style={{ background: "#0e0b04" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.4}
          maxZoom={1.5}
          attributionPosition="bottom-left"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(120,100,50,0.2)"
          />
          <Controls
            className="!bg-amber-950/60 !border-amber-800/40 [&>button]:!bg-amber-950/60 [&>button]:!border-amber-800/40 [&>button]:!text-amber-300 [&>button:hover]:!bg-amber-900/60"
          />
          <MiniMap
            className="!bg-amber-950/40 !border-amber-800/40"
            nodeColor="rgba(217,119,6,0.5)"
            maskColor="rgba(14,11,4,0.8)"
          />
        </ReactFlow>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-[#0e0b04] border-amber-800/30 text-amber-100">
          <SheetHeader>
            <SheetTitle className="text-amber-200 font-display">
              {selectedNode?.label}
            </SheetTitle>
            <SheetDescription className="text-amber-400/70">
              {selectedNode?.tech}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {selectedNode?.description && (
              <p className="text-sm text-amber-200/80 leading-relaxed">
                {selectedNode.description}
              </p>
            )}
            {selectedNode?.issues && selectedNode.issues.length > 0 && (
              <div>
                <p className="text-xs font-mono-tech text-amber-500 uppercase tracking-wider mb-2">
                  Problemas identificados
                </p>
                <ul className="space-y-1.5">
                  {selectedNode.issues.map((issue, i) => (
                    <li key={i} className="flex gap-2 text-sm text-amber-200/70">
                      <span className="text-red-400 shrink-0">⚠</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
