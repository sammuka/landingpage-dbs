// ─── Azure Infrastructure Data ────────────────────────────────────
// Fonte: docs/arquitetura/004-deploy-infraestrutura.md, cloud.ts, ADRs

export type InfraCategory =
  | "compute"
  | "data"
  | "security"
  | "observability"
  | "devops"
  | "external";

export interface InfraSpec {
  label: string;
  value: string;
  highlight?: boolean;
}

export type BadgeVariant = "blue" | "green" | "amber" | "neutral" | "crit";

export interface InfraBadge {
  text: string;
  variant: BadgeVariant;
}

export interface InfraService {
  id: string;
  name: string;
  azureProduct: string;
  icon: string;
  category: InfraCategory;
  description: string;
  specs: InfraSpec[];
  badges: InfraBadge[];
}

export interface InfraCategoryGroup {
  id: InfraCategory;
  label: string;
  lucideIcon: string;
  color: string;
  services: InfraService[];
}

// ─── Serviços Individuais ─────────────────────────────────────────

const computeServices: InfraService[] = [
  {
    id: "dbs-api",
    name: "API Unificada",
    azureProduct: "Azure Container Apps",
    icon: "App-Services.svg",
    category: "compute",
    description:
      "Endpoints transacionais (Payment) e administrativos (Admin) no mesmo container — ADR-018. Quartz.NET para 10 background jobs.",
    specs: [
      { label: "vCPU", value: "0.5" },
      { label: "Memória", value: "1Gi" },
      { label: "Réplicas", value: "2–10", highlight: true },
      { label: "Porta", value: ":8080" },
      { label: "Scaling", value: "50 req/s (HTTP)" },
      { label: "Jobs", value: "10 Quartz.NET" },
    ],
    badges: [
      { text: ".NET 10 LTS", variant: "blue" },
      { text: "ADR-018", variant: "green" },
      { text: "REST :8080", variant: "neutral" },
    ],
  },
  {
    id: "portal",
    name: "Portal Next.js",
    azureProduct: "Azure Container Apps",
    icon: "App-Services.svg",
    category: "compute",
    description:
      "Frontend de administração — substituiu dbsportal (Struts 1.3). SSR, App Router, tema dark/light.",
    specs: [
      { label: "vCPU", value: "0.25" },
      { label: "Memória", value: "512Mi" },
      { label: "Réplicas", value: "1–3" },
      { label: "Porta", value: ":3000" },
      { label: "Scaling", value: "100 req/s (HTTP)" },
      { label: "Output", value: "Standalone" },
    ],
    badges: [
      { text: "Next.js 16", variant: "blue" },
      { text: "React 19", variant: "blue" },
      { text: "HTTPS :3000", variant: "neutral" },
    ],
  },
  {
    id: "soap-adapter",
    name: "SOAP Adapter",
    azureProduct: "Azure Container Apps",
    icon: "Container-Instances.svg",
    category: "compute",
    description:
      "Container isolado de compatibilidade SOAP. Traduz WS-Security (ACSEL/ELITA) para Application Layer via MediatR. Sunset planejado.",
    specs: [
      { label: "vCPU", value: "0.25" },
      { label: "Memória", value: "512Mi" },
      { label: "Réplicas", value: "1–3" },
      { label: "Porta", value: ":8081" },
      { label: "Scaling", value: "30 req/s (HTTP)" },
      { label: "Protocolo", value: "CoreWCF" },
    ],
    badges: [
      { text: ".NET 10 LTS", variant: "blue" },
      { text: "ADR-019", variant: "green" },
      { text: "Sunset +12m", variant: "amber" },
    ],
  },
];

const dataServices: InfraService[] = [
  {
    id: "azure-sql",
    name: "Azure SQL",
    azureProduct: "Azure SQL Database",
    icon: "SQL-Database.svg",
    category: "data",
    description:
      "Banco relacional gerenciado — substituição do Oracle 19c on-premises. Autenticação via Managed Identity, zero connection strings com senha.",
    specs: [
      { label: "Tier", value: "GP_S_Gen5" },
      { label: "vCores", value: "2 (prod)", highlight: true },
      { label: "Backup", value: "Geo-redundante" },
      { label: "Auth", value: "Managed Identity" },
      { label: "ORM", value: "EF Core 10" },
      { label: "Retry", value: "EnableRetryOnFailure" },
    ],
    badges: [
      { text: "ADR-015", variant: "green" },
      { text: "Geo-redundante", variant: "blue" },
    ],
  },
  {
    id: "storage",
    name: "Blob Storage",
    azureProduct: "Azure Storage Accounts",
    icon: "Storage-Accounts.svg",
    category: "data",
    description:
      "Armazenamento de exports para sistemas legados (ELITA/ACSEL). Retenção configurável, acesso via Managed Identity.",
    specs: [
      { label: "Container", value: "exportacoes" },
      { label: "Retenção", value: "90 dias" },
      { label: "Auth", value: "Managed Identity" },
      { label: "Tier", value: "Hot/Cool" },
    ],
    badges: [
      { text: "Blob", variant: "blue" },
      { text: "LRS", variant: "neutral" },
    ],
  },
];

const securityServices: InfraService[] = [
  {
    id: "key-vault",
    name: "Azure Key Vault",
    azureProduct: "Azure Key Vault",
    icon: "Key-Vaults.svg",
    category: "security",
    description:
      "Gerenciamento centralizado de segredos — zero secrets hardcoded. MerchantId, MerchantKey, connection strings, Okta secrets.",
    specs: [
      { label: "Secrets", value: "6 gerenciados", highlight: true },
      { label: "Auth", value: "Managed Identity" },
      { label: "Rotação", value: "Automática" },
      { label: "Auditoria", value: "Azure Monitor" },
    ],
    badges: [
      { text: "ADR-015", variant: "green" },
      { text: "Zero secrets no código", variant: "green" },
    ],
  },
  {
    id: "managed-identity",
    name: "Managed Identity",
    azureProduct: "Azure AD",
    icon: "Identity-Governance.svg",
    category: "security",
    description:
      "User-Assigned Managed Identity por container. RBAC granular — AcrPull, Key Vault Secrets User, SQL roles.",
    specs: [
      { label: "Tipo", value: "User-Assigned" },
      { label: "RBAC", value: "4 roles", highlight: true },
      { label: "Escopo", value: "Por container" },
      { label: "Auditoria", value: "Azure AD" },
    ],
    badges: [
      { text: "RBAC", variant: "blue" },
      { text: "Zero credenciais", variant: "green" },
    ],
  },
  {
    id: "okta",
    name: "Okta",
    azureProduct: "Identity Provider (externo)",
    icon: "Security-Center.svg",
    category: "security",
    description:
      "OAuth2/OIDC com JWT RS256. Client Credentials (B2B) + Authorization Code + PKCE (Portal). MFA nativo.",
    specs: [
      { label: "Protocolo", value: "OAuth2 / OIDC" },
      { label: "Token", value: "JWT RS256" },
      { label: "MFA", value: "Habilitado" },
      { label: "SLA", value: "99.99%" },
    ],
    badges: [
      { text: "ADR-009", variant: "green" },
      { text: "OIDC", variant: "blue" },
    ],
  },
];

const observabilityServices: InfraService[] = [
  {
    id: "app-insights",
    name: "Application Insights",
    azureProduct: "Azure Monitor",
    icon: "Application-Insights.svg",
    category: "observability",
    description:
      "APM + Distributed Tracing. Telemetria automática via SDK .NET, alertas de latência e error rate.",
    specs: [
      { label: "APM", value: "SDK .NET" },
      { label: "Tracing", value: "CorrelationId" },
      { label: "Alertas", value: "Latência + errors" },
      { label: "Dashboard", value: "Tempo real" },
    ],
    badges: [
      { text: "Observability", variant: "blue" },
      { text: "Serilog", variant: "neutral" },
    ],
  },
  {
    id: "log-analytics",
    name: "Log Analytics",
    azureProduct: "Azure Monitor",
    icon: "Monitor.svg",
    category: "observability",
    description:
      "Workspace central de logs e métricas. Serilog structured JSON, masking automático de PAN/CVV/MerchantKey.",
    specs: [
      { label: "Retenção", value: "90 dias (prod)", highlight: true },
      { label: "Formato", value: "JSON estruturado" },
      { label: "Masking", value: "PAN, CVV, Keys" },
      { label: "Métricas", value: "CPU, mem, req/s" },
    ],
    badges: [
      { text: "Serilog", variant: "neutral" },
      { text: "PCI DSS", variant: "green" },
    ],
  },
];

const devopsServices: InfraService[] = [
  {
    id: "github-actions",
    name: "GitHub Actions",
    azureProduct: "GitHub Actions + OIDC",
    icon: "github-icon.svg",
    category: "devops",
    description:
      "CI/CD com 3 pipelines (ci, cd, infra). OIDC federated credentials — zero secrets permanentes no GitHub.",
    specs: [
      { label: "Pipelines", value: "3", highlight: true },
      { label: "Auth", value: "OIDC (WIF)" },
      { label: "Ambientes", value: "Dev → Prod" },
      { label: "Aprovação", value: "Manual (prod)" },
    ],
    badges: [
      { text: "CI/CD", variant: "blue" },
      { text: "OIDC", variant: "green" },
    ],
  },
  {
    id: "acr",
    name: "Container Registry",
    azureProduct: "Azure Container Registry",
    icon: "Container-Registries.svg",
    category: "devops",
    description:
      "Registro privado de imagens Docker. Tags por commit SHA (dev) e semver (prod). Sem admin user — Managed Identity only.",
    specs: [
      { label: "Imagens", value: "Por commit SHA" },
      { label: "Auth", value: "AcrPull (MI)" },
      { label: "Scanning", value: "Vulnerabilidades" },
      { label: "Tag (prod)", value: "Semver v1.x.x" },
    ],
    badges: [
      { text: "ACR", variant: "blue" },
      { text: "Zero admin user", variant: "green" },
    ],
  },
];

const externalServices: InfraService[] = [
  {
    id: "braspag",
    name: "Braspag / Cielo",
    azureProduct: "REST API (Pagador)",
    icon: "Load-Balancers.svg",
    category: "external",
    description:
      "Gateway de pagamentos — autorização, captura, cancelamento, tokenização. Polly v8 para resiliência (retry + circuit breaker).",
    specs: [
      { label: "API", value: "Braspag Pagador" },
      { label: "Protocolo", value: "REST + Polly" },
      { label: "Auth", value: "MerchantId + Key" },
      { label: "Token", value: "SaveCard=true" },
    ],
    badges: [
      { text: "ADR-003", variant: "green" },
      { text: "REST + Polly", variant: "blue" },
    ],
  },
  {
    id: "acsel-elita",
    name: "ACSEL / ELITA",
    azureProduct: "Sistemas legados (SOAP)",
    icon: "Virtual-Networks-(Classic).svg",
    category: "external",
    description:
      "Parceiros legados que consomem via SOAP/WS-Security. Atendidos pelo SOAP Adapter — sunset planejado conforme migração.",
    specs: [
      { label: "Protocolo", value: "SOAP / WS-Security" },
      { label: "Adapter", value: "CoreWCF container" },
      { label: "Sunset", value: "+12 meses" },
      { label: "Migração", value: "Incremental" },
    ],
    badges: [
      { text: "ADR-019", variant: "amber" },
      { text: "WS-Security", variant: "neutral" },
    ],
  },
];

// ─── Categorias Agrupadas ─────────────────────────────────────────

export const infraCategories: InfraCategoryGroup[] = [
  {
    id: "compute",
    label: "Computação",
    lucideIcon: "server",
    color: "blue",
    services: computeServices,
  },
  {
    id: "data",
    label: "Dados",
    lucideIcon: "database",
    color: "slate",
    services: dataServices,
  },
  {
    id: "security",
    label: "Segurança",
    lucideIcon: "shield",
    color: "green",
    services: securityServices,
  },
  {
    id: "observability",
    label: "Observabilidade",
    lucideIcon: "activity",
    color: "purple",
    services: observabilityServices,
  },
  {
    id: "devops",
    label: "DevOps & CI/CD",
    lucideIcon: "git-branch",
    color: "amber",
    services: devopsServices,
  },
  {
    id: "external",
    label: "Integrações Externas",
    lucideIcon: "globe",
    color: "neutral",
    services: externalServices,
  },
];

export const infraTotalServices = infraCategories.reduce(
  (sum, cat) => sum + cat.services.length,
  0,
);
