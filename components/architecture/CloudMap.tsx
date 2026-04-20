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
  // Azure Container Apps Environment (boundary)
  // Containers principais
  {
    id: "dbs-api",
    type: "arch",
    position: { x: 200, y: 160 },
    data: {
      label: "API Unificada",
      sublabel: "0.5 vCPU · 1Gi · 2–10 replicas",
      type: "container",
      badge: "REST :8080",
      badgeVariant: "ok",
      icon: "App-Services.svg",
      tech: ".NET 10 LTS / ASP.NET Core",
      description: "API unificada (ADR-018). Endpoints transacionais (Payment) e administrativos (Admin) no mesmo container. Autorização, captura, cancelamento, configurações, relatórios, reconciliação.",
      issues: [],
    } satisfies ArchNodeData,
  },
  {
    id: "portal",
    type: "arch",
    position: { x: 560, y: 160 },
    data: {
      label: "Portal Next.js",
      sublabel: "0.25 vCPU · 512Mi · 1–3 replicas",
      type: "container",
      badge: "HTTPS :3000",
      badgeVariant: "ok",
      icon: "App-Services.svg",
      tech: "Next.js 16.1.6 / React 19",
      description: "Frontend de administração. DataTable com sort/filter, Drawer lateral, tema dark/light. Substitui dbsportal (Struts 1.3).",
    } satisfies ArchNodeData,
  },
  {
    id: "soap-adapter",
    type: "arch",
    position: { x: 100, y: 320 },
    data: {
      label: "SOAP Adapter",
      sublabel: "0.25 vCPU · 512Mi · 1–3 replicas",
      type: "container",
      badge: "CoreWCF :8081",
      badgeVariant: "neutral",
      icon: "Container-Instances.svg",
      tech: "CoreWCF / .NET 10 LTS",
      description: "Container de compatibilidade SOAP. Recebe WS-Security de ACSEL/ELITA, traduz para MediatR handlers. Sunset planejado +12 meses.",
    } satisfies ArchNodeData,
  },
  // Serviços Azure
  {
    id: "key-vault",
    type: "arch",
    position: { x: 760, y: 80 },
    data: {
      label: "Key Vault",
      sublabel: "Zero secrets no código",
      type: "service",
      badge: "ADR-015",
      badgeVariant: "ok",
      icon: "Key-Vaults.svg",
      tech: "Azure Key Vault",
      description: "Gerenciamento de segredos. Managed Identity garante acesso sem credenciais. Rotação automática de chaves AES/RSA.",
    } satisfies ArchNodeData,
  },
  {
    id: "azure-sql",
    type: "arch",
    position: { x: 760, y: 220 },
    data: {
      label: "Azure SQL",
      sublabel: "Gerenciado · Geo-redundante",
      type: "database",
      badge: "EF Core 10",
      badgeVariant: "neutral",
      icon: "SQL-Database.svg",
      tech: "Azure SQL Database",
      description: "Substitui Oracle 19c/21c on-premises. EF Core 10 com migrations versionadas. Backup geo-redundante automático.",
    } satisfies ArchNodeData,
  },
  {
    id: "acr",
    type: "arch",
    position: { x: 760, y: 360 },
    data: {
      label: "Container Registry",
      sublabel: "Imagens por commit SHA",
      type: "service",
      badge: "ACR",
      badgeVariant: "neutral",
      icon: "Container-Registries.svg",
      tech: "Azure Container Registry",
      description: "Registro privado de imagens Docker. Vulnerability scanning automático. Replicação geográfica.",
    } satisfies ArchNodeData,
  },
  {
    id: "app-insights",
    type: "arch",
    position: { x: 330, y: 460 },
    data: {
      label: "Application Insights",
      sublabel: "APM + Distributed Tracing",
      type: "service",
      badge: "Observability",
      badgeVariant: "neutral",
      icon: "Application-Insights.svg",
      tech: "Azure Monitor",
      description: "Telemetria automática via SDK .NET. Distributed tracing com CorrelationId. Alertas de latência e error rate.",
    } satisfies ArchNodeData,
  },
  {
    id: "managed-identity",
    type: "arch",
    position: { x: 560, y: 460 },
    data: {
      label: "Managed Identity",
      sublabel: "User-Assigned por container",
      type: "service",
      badge: "RBAC",
      badgeVariant: "ok",
      icon: "Identity-Governance.svg",
      tech: "Azure AD",
      description: "Identity para cada container sem credenciais em código. RBAC granular para Key Vault e ACR.",
    } satisfies ArchNodeData,
  },
  // Externos
  {
    id: "okta",
    type: "arch",
    position: { x: -140, y: 80 },
    data: {
      label: "Okta",
      sublabel: "Identity Provider",
      type: "external",
      badge: "ADR-009",
      badgeVariant: "ok",
      tech: "OAuth2 / OIDC / JWT RS256",
      description: "Identity Provider. JWT RS256 assimétrico. Validação via JWKS público. Token 1h + refresh.",
    } satisfies ArchNodeData,
  },
  {
    id: "braspag-rest",
    type: "arch",
    position: { x: -140, y: 220 },
    data: {
      label: "Braspag REST",
      sublabel: "apisandbox.braspag.com.br",
      type: "external",
      badge: "ADR-003",
      badgeVariant: "ok",
      tech: "REST API (Pagador)",
      description: "Gateway de pagamento via REST API. Substituiu ~300 stubs SOAP. Polly v8 para resiliência.",
    } satisfies ArchNodeData,
  },
  {
    id: "acsel-new",
    type: "arch",
    position: { x: -140, y: 360 },
    data: {
      label: "ACSEL / ELITA",
      sublabel: "Via SOAP Adapter",
      type: "external",
      badge: "Sunset +12m",
      badgeVariant: "warn",
      tech: "WS-Security (legado)",
      description: "Parceiros legados que ainda usam SOAP/WS-Security. Transitando para REST via sunset plan.",
    } satisfies ArchNodeData,
  },
  {
    id: "github-actions",
    type: "arch",
    position: { x: 100, y: 460 },
    data: {
      label: "GitHub Actions",
      sublabel: "CI/CD · OIDC",
      type: "external",
      badge: "3 pipelines",
      badgeVariant: "neutral",
      icon: "github-icon.svg",
      tech: "GitHub Actions + OIDC",
      description: "3 pipelines (CI, CD, Infra) com autenticação OIDC para Azure. Zero secrets de deployment.",
    } satisfies ArchNodeData,
  },
];

const initialEdges: Edge[] = [
  // Auth
  { id: "e1", source: "okta", target: "dbs-api", animated: true, label: "JWT RS256", style: { stroke: "#4ade80", strokeWidth: 1.5 } },
  { id: "e3", source: "portal", target: "okta", animated: true, label: "OIDC", style: { stroke: "#4ade80", strokeWidth: 1.5 } },
  // Containers
  { id: "e4", source: "portal", target: "dbs-api", label: "REST", style: { stroke: "#60a5fa", strokeWidth: 2 } },
  { id: "e5", source: "acsel-new", target: "soap-adapter", animated: true, label: "SOAP", style: { stroke: "#fcd34d", strokeWidth: 2 } },
  { id: "e6", source: "soap-adapter", target: "dbs-api", label: "MediatR", style: { stroke: "#60a5fa", strokeWidth: 2 } },
  // Gateway
  { id: "e7", source: "dbs-api", target: "braspag-rest", animated: true, label: "REST + Polly", style: { stroke: "#4ade80", strokeWidth: 2 } },
  // Data
  { id: "e8", source: "dbs-api", target: "azure-sql", style: { stroke: "#94a3b8", strokeWidth: 1.5 } },
  // Secrets
  { id: "e10", source: "dbs-api", target: "key-vault", label: "MI", style: { stroke: "#fcd34d", strokeWidth: 1 } },
  // Observability
  { id: "e12", source: "dbs-api", target: "app-insights", style: { stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4" } },
  // Identity
  { id: "e14", source: "managed-identity", target: "key-vault", style: { stroke: "#4ade80", strokeWidth: 1 } },
  // CI/CD
  { id: "e15", source: "github-actions", target: "acr", animated: true, label: "push image", style: { stroke: "#94a3b8", strokeWidth: 1.5 } },
];

interface SelectedNode {
  label: string;
  description?: string;
  tech?: string;
  issues?: string[];
  badge?: string;
}

export function CloudMap() {
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
        className="w-full h-[580px] rounded-xl overflow-hidden border border-blue-800/30"
        style={{ background: "#060c18" }}
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
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(0,120,212,0.15)"
          />
          <Controls
            className="!bg-blue-950/60 !border-blue-800/40 [&>button]:!bg-blue-950/60 [&>button]:!border-blue-800/40 [&>button]:!text-blue-300 [&>button:hover]:!bg-blue-900/60"
          />
          <MiniMap
            className="!bg-blue-950/40 !border-blue-800/40"
            nodeColor="rgba(0,120,212,0.4)"
            maskColor="rgba(6,12,24,0.8)"
          />
        </ReactFlow>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="border-blue-800/30">
          <SheetHeader>
            <SheetTitle className="font-display">
              {selectedNode?.label}
            </SheetTitle>
            <SheetDescription className="font-mono-tech text-xs">
              {selectedNode?.tech}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {selectedNode?.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedNode.description}
              </p>
            )}
            {selectedNode?.badge && (
              <div className="tag-fix inline-flex">{selectedNode.badge}</div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
