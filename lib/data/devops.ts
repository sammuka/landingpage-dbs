// ─── DevOps Pipeline + IaC Data ───────────────────────────────────

export interface PipelineStage {
  id: string;
  name: string;
  icon: string;
  steps: string[];
  badge: string;
  badgeType: "blue" | "green" | "amber" | "purple" | "neutral";
  trigger?: string;
}

export interface BicepModule {
  filename: string;
  description: string;
  resources: string[];
}

export interface Branch {
  pattern: string;
  description: string;
  tag: string;
  badgeType: "blue" | "green" | "amber";
  triggers: string;
  deploys: string;
}

// ─── 3 Pipelines GitHub Actions (ci.yml, cd.yml, infra.yml) ──────
export const pipelineStages: PipelineStage[] = [
  // ── CI Pipeline (ci.yml) ──
  {
    id: "build-test",
    name: "Build & Test",
    icon: "devops-test.svg",
    steps: [
      "actions/checkout@v4 + .NET 9 SDK",
      "dotnet restore + build (Release)",
      "dotnet test UnitTests (TRX report)",
      "dorny/test-reporter (fail-on-error)",
    ],
    badge: "163 testes",
    badgeType: "green",
    trigger: "push / pull_request",
  },
  {
    id: "docker-validate",
    name: "Docker Validate",
    icon: "docker.svg",
    steps: [
      "docker buildx build API (no push)",
      "docker buildx build Portal (no push)",
      "Valida Dockerfiles + cache layers",
    ],
    badge: "3 imagens",
    badgeType: "blue",
  },
  // ── CD Pipeline (cd.yml) ──
  {
    id: "setup",
    name: "Setup",
    icon: "devops-git-client.svg",
    steps: [
      "Determina environment (dev/prod)",
      "Image tag: SHA (dev) ou semver (prod)",
      "Output: resource_group, acr_name",
    ],
    badge: "auto",
    badgeType: "neutral",
    trigger: "push master / tag v*",
  },
  {
    id: "build-push",
    name: "Build & Push API",
    icon: "docker.svg",
    steps: [
      "Azure OIDC login (Workload Identity)",
      "Create RG + ACR (idempotent)",
      "docker buildx build + push API → ACR",
      "Tag: {acr}.azurecr.io/dbs-api:{tag}",
    ],
    badge: "ACR push",
    badgeType: "blue",
  },
  {
    id: "deploy-infra",
    name: "Deploy Infra",
    icon: "azure-resource-manager.svg",
    steps: [
      "az deployment group create (main.bicep)",
      "Mode: Incremental (idempotent)",
      "Output: apiUrl, portalUrl, acrServer",
    ],
    badge: "6 módulos",
    badgeType: "amber",
  },
  {
    id: "build-deploy-portal",
    name: "Build & Deploy Portal",
    icon: "devops-deploy-cloud.svg",
    steps: [
      "docker buildx build Portal com API URL",
      "Push Portal image → ACR",
      "az containerapp update (portal)",
    ],
    badge: "portal deploy",
    badgeType: "green",
  },
  // ── Infra Pipeline (infra.yml) ──
  {
    id: "infra-only",
    name: "Infra Only",
    icon: "azure-resource-manager.svg",
    steps: [
      "az deployment group what-if (preview)",
      "az deployment group create (Incremental)",
      "Output results → Step Summary",
    ],
    badge: "6 módulos",
    badgeType: "amber",
    trigger: "changes in infra/",
  },
];

// ─── 6 Módulos Bicep IaC ──────────────────────────────────────────
export const bicepModules: BicepModule[] = [
  {
    filename: "main.bicep",
    description: "Módulo raiz — orquestra todos os demais, parâmetros globais",
    resources: ["Resource Group", "Parâmetros (env, imageTag, secrets)", "Orquestração de módulos"],
  },
  {
    filename: "modules/containerApp.bicep",
    description: "Container Apps — API unificada (ADR-018) + Portal Next.js",
    resources: ["Container App (API)", "Container App (Portal)", "Ingress HTTPS", "KEDA Scale Rules", "Managed Identity"],
  },
  {
    filename: "modules/keyVault.bicep",
    description: "Azure Key Vault — segredos e access policies",
    resources: ["Key Vault", "Access Policies", "Diagnostic Settings"],
  },
  {
    filename: "modules/monitoring.bicep",
    description: "Observabilidade — Log Analytics + Application Insights",
    resources: ["Log Analytics Workspace", "Application Insights", "Alert Rules"],
  },
  {
    filename: "modules/sql.bicep",
    description: "Azure SQL Database — TDE, firewall, backups automáticos",
    resources: ["SQL Server", "Database", "Firewall Rules", "Transparent Data Encryption"],
  },
  {
    filename: "modules/storage.bicep",
    description: "Storage Account para blobs de exportação e filas",
    resources: ["Storage Account (LRS)", "Blob Containers", "Queue Services"],
  },
];

// ─── Branch Strategy ──────────────────────────────────────────────
export const branches: Branch[] = [
  {
    pattern: "feature/*",
    description: "Desenvolvimento de features e correções. Nomeadas como feature/DBS-123-descricao.",
    tag: "Desenvolvimento",
    badgeType: "blue",
    triggers: "PR validation (testes + lint)",
    deploys: "Nenhum deploy automático",
  },
  {
    pattern: "develop",
    description: "Branch de integração. Merge via PR com revisão obrigatória. Deploy automático em staging.",
    tag: "Staging",
    badgeType: "amber",
    triggers: "Push para develop",
    deploys: "Staging environment",
  },
  {
    pattern: "main",
    description: "Branch de produção. Apenas merges via PR aprovado + tag de versão semântica (v1.2.3).",
    tag: "Produção",
    badgeType: "green",
    triggers: "Tag v*.*.* em main",
    deploys: "Production (rolling update)",
  },
];

export const deployCommand = `az deployment group create \\
  --resource-group rg-dbs-prod \\
  --template-file infra/main.bicep \\
  --parameters @infra/parameters.prod.json \\
  --confirm-with-what-if`;
