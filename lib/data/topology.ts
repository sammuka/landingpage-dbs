// ─── Azure Service Topology Data ──────────────────────────────────
// Topologia de serviços: fluxo de tráfego edge → compute → data → security

export type BadgeVariant = "blue" | "green" | "amber" | "neutral" | "crit";

export interface TopologyNode {
  id: string;
  name: string;
  sublabel: string;
  icon: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  port?: string;
}

export interface TopologyConnection {
  label: string;
  color: string; // tailwind color key
}

export interface TopologyLayer {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  isBoundary?: boolean;
  boundaryLabel?: string;
  isCrossCutting?: boolean;
  nodes: TopologyNode[];
  connectionToNext?: TopologyConnection;
}

// ─── Layers ───────────────────────────────────────────────────────

export const topologyLayers: TopologyLayer[] = [
  {
    id: "edge",
    label: "Borda",
    color: "slate",
    nodes: [
      {
        id: "internet",
        name: "Internet",
        sublabel: "Clientes · Parceiros · Portal",
        icon: "Network-Security-Groups.svg",
      },
      {
        id: "front-door",
        name: "Azure Front Door",
        sublabel: "WAF · CDN · TLS 1.2+",
        icon: "Load-Balancers.svg",
        badge: "WAF",
        badgeVariant: "blue",
      },
    ],
    connectionToNext: { label: "HTTPS :443", color: "blue" },
  },
  {
    id: "compute",
    label: "Computação",
    sublabel: "Azure Container Apps",
    color: "blue",
    isBoundary: true,
    boundaryLabel: "Container Apps Environment — Managed VNet",
    nodes: [
      {
        id: "api",
        name: "API Unificada",
        sublabel: ".NET 10 LTS · ASP.NET Core",
        icon: "App-Services.svg",
        port: ":8080",
        badge: "2–10 réplicas",
        badgeVariant: "blue",
      },
      {
        id: "portal",
        name: "Portal Next.js",
        sublabel: "Next.js 16 · React 19",
        icon: "App-Services.svg",
        port: ":3000",
        badge: "1–5 réplicas",
        badgeVariant: "blue",
      },
      {
        id: "soap",
        name: "SOAP Adapter",
        sublabel: "CoreWCF · .NET 10 LTS",
        icon: "Container-Instances.svg",
        port: ":8081",
        badge: "Sunset +12m",
        badgeVariant: "amber",
      },
    ],
    connectionToNext: { label: "EF Core · Managed Identity", color: "slate" },
  },
  {
    id: "data",
    label: "Dados",
    color: "slate",
    nodes: [
      {
        id: "sql",
        name: "Azure SQL",
        sublabel: "GP_S_Gen5 · Geo-redundante",
        icon: "SQL-Database.svg",
        badge: "MI Auth",
        badgeVariant: "green",
      },
      {
        id: "blob",
        name: "Blob Storage",
        sublabel: "Exports · Retenção 90d",
        icon: "Storage-Accounts.svg",
        badge: "LRS",
        badgeVariant: "neutral",
      },
    ],
    connectionToNext: { label: "", color: "green" },
  },
  {
    id: "security",
    label: "Plano de Segurança",
    sublabel: "Cross-cutting — todos os serviços",
    color: "green",
    isCrossCutting: true,
    nodes: [
      {
        id: "kv",
        name: "Key Vault",
        sublabel: "6 secrets · Rotação automática",
        icon: "Key-Vaults.svg",
        badge: "ADR-015",
        badgeVariant: "green",
      },
      {
        id: "mi",
        name: "Managed Identity",
        sublabel: "User-Assigned · RBAC",
        icon: "Identity-Governance.svg",
        badge: "4 roles",
        badgeVariant: "blue",
      },
      {
        id: "okta",
        name: "Okta",
        sublabel: "OAuth2/OIDC · JWT RS256",
        icon: "Security-Center.svg",
        badge: "ADR-009",
        badgeVariant: "green",
      },
    ],
    connectionToNext: { label: "REST + Polly v8", color: "amber" },
  },
  {
    id: "external",
    label: "Integrações Externas",
    color: "amber",
    nodes: [
      {
        id: "braspag",
        name: "Braspag / Cielo",
        sublabel: "Pagador REST · Tokenização",
        icon: "Load-Balancers.svg",
        badge: "ADR-003",
        badgeVariant: "green",
      },
      {
        id: "acsel",
        name: "ACSEL / ELITA",
        sublabel: "SOAP via Adapter",
        icon: "Virtual-Networks-(Classic).svg",
        badge: "Sunset +12m",
        badgeVariant: "amber",
      },
    ],
    connectionToNext: { label: "", color: "purple" },
  },
  {
    id: "operations",
    label: "Observabilidade & DevOps",
    color: "purple",
    nodes: [
      {
        id: "insights",
        name: "App Insights",
        sublabel: "APM · Distributed Tracing",
        icon: "Application-Insights.svg",
      },
      {
        id: "logs",
        name: "Log Analytics",
        sublabel: "Serilog JSON · 90d",
        icon: "Monitor.svg",
      },
      {
        id: "gh-actions",
        name: "GitHub Actions",
        sublabel: "3 pipelines · OIDC",
        icon: "github-icon.svg",
      },
      {
        id: "acr",
        name: "Container Registry",
        sublabel: "Imagens por SHA · MI pull",
        icon: "Container-Registries.svg",
      },
    ],
  },
];
