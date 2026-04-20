// ─── Cloud System Data (TO-BE) ────────────────────────────────────
// Fonte: Assurant-DBS/docs/ (ADRs, arquitetura, segurança)

export interface AzureContainer {
  id: string;
  name: string;
  tech: string;
  port: number;
  cpu: string;
  memory: string;
  replicasMin: number;
  replicasMax: number;
  description: string;
  endpoints: string[];
  secrets: string[];
  icon: string;
}

export interface AzureService {
  id: string;
  name: string;
  icon: string;
  category: "security" | "data" | "observability" | "registry" | "network";
  description: string;
  details: string[];
}

export interface ADR {
  id: string;
  number: string;
  title: string;
  context: string;
  decision: string;
  rationale: string;
  consequences: {
    positive: string[];
    negative: string[];
  };
  icon: string;
}

// ─── 3 Containers Azure Container Apps ───────────────────────────
// ADR-018 unificou Payment API + Admin API em uma única API.
export const azureContainers: AzureContainer[] = [
  {
    id: "dbs-api",
    name: "API Unificada",
    tech: ".NET 10 LTS / ASP.NET Core",
    port: 8080,
    cpu: "0.5",
    memory: "1Gi",
    replicasMin: 2,
    replicasMax: 10,
    description: "API unificada (ADR-018) — endpoints transacionais (Payment) e administrativos (Admin) no mesmo container. Autorização, captura, cancelamento, consulta, configurações, relatórios, reconciliação.",
    endpoints: [
      "POST /api/v1/transacoes",
      "PUT /api/v1/transacoes/{id}/capture",
      "PUT /api/v1/transacoes/{id}/cancel",
      "GET /api/v1/transacoes/{id}",
      "GET /api/v1/admin/configuracoes",
      "GET /api/v1/admin/dashboard/metrics",
    ],
    secrets: ["CieloSettings__MerchantId", "CieloSettings__MerchantKey", "Okta__Issuer", "Okta__Audience"],
    icon: "App-Services.svg",
  },
  {
    id: "portal",
    name: "Portal Next.js",
    tech: "Next.js 16.1.6 / React 19",
    port: 3000,
    cpu: "0.25",
    memory: "512Mi",
    replicasMin: 1,
    replicasMax: 3,
    description: "Frontend de administração — substituiu dbsportal (Struts 1.3). DataTable com sort/filter, Drawer lateral, tema dark/light.",
    endpoints: [
      "GET / (dashboard)",
      "GET /payments (listagem)",
      "GET /reports (relatórios)",
      "GET /config (configurações)",
    ],
    secrets: ["NEXTAUTH_SECRET", "OKTA_CLIENT_SECRET"],
    icon: "App-Services.svg",
  },
  {
    id: "soap-adapter",
    name: "SOAP Adapter",
    tech: "CoreWCF / .NET 10 LTS",
    port: 8081,
    cpu: "0.25",
    memory: "512Mi",
    replicasMin: 1,
    replicasMax: 3,
    description: "Container isolado de compatibilidade SOAP. Adapta chamadas WS-Security dos sistemas legados (ACSEL/ELITA) para o Application Layer compartilhado via MediatR.",
    endpoints: [
      "POST /soap/PaymentService.svc (7 operações WSDL)",
    ],
    secrets: [],
    icon: "Container-Instances.svg",
  },
];

// ─── Serviços Azure Auxiliares ────────────────────────────────────
export const azureServices: AzureService[] = [
  {
    id: "key-vault",
    name: "Azure Key Vault",
    icon: "Key-Vaults.svg",
    category: "security",
    description: "Gerenciamento centralizado de segredos",
    details: [
      "Zero secrets hardcoded (ADR-015)",
      "Managed Identity — sem credenciais em código",
      "Rotação automática de chaves AES/RSA",
      "Acesso auditado via Azure Monitor",
    ],
  },
  {
    id: "azure-sql",
    name: "Azure SQL",
    icon: "SQL-Database.svg",
    category: "data",
    description: "Banco relacional gerenciado",
    details: [
      "Substituição do Oracle 19c/21c on-premises",
      "EF Core 10 com UseAzureSql()",
      "EnableRetryOnFailure() para resiliência",
      "Backup geo-redundante automático",
    ],
  },
  {
    id: "acr",
    name: "Container Registry",
    icon: "Container-Registries.svg",
    category: "registry",
    description: "Registro privado de imagens Docker",
    details: [
      "Imagens versionadas por commit SHA",
      "Vulnerability scanning automático",
      "Replicação geográfica",
      "Integrado ao GitHub Actions OIDC",
    ],
  },
  {
    id: "app-insights",
    name: "Application Insights",
    icon: "Application-Insights.svg",
    category: "observability",
    description: "Rastreamento distribuído e APM",
    details: [
      "Telemetria automática via SDK .NET",
      "Distributed tracing (CorrelationId)",
      "Alertas de latência e error rate",
      "Dashboard de saúde em tempo real",
    ],
  },
  {
    id: "monitor",
    name: "Azure Monitor",
    icon: "Monitor.svg",
    category: "observability",
    description: "Logs e métricas centralizados",
    details: [
      "Log Analytics Workspace",
      "Serilog → Azure Monitor sink",
      "Métricas de container (CPU, mem, req/s)",
      "Alertas via Action Groups",
    ],
  },
  {
    id: "managed-identity",
    name: "Managed Identity",
    icon: "Identity-Governance.svg",
    category: "security",
    description: "Identidade sem credenciais",
    details: [
      "User-Assigned Managed Identity por container",
      "Acesso a Key Vault sem secrets no código",
      "RBAC granular por recurso",
      "Auditoria completa no Azure AD",
    ],
  },
  {
    id: "storage",
    name: "Storage Accounts",
    icon: "Storage-Accounts.svg",
    category: "data",
    description: "Armazenamento de blobs e filas",
    details: [
      "Blobs para exports de relatórios",
      "Queues para jobs assíncronos",
      "LRS com geo-replication",
      "Access tiers (hot/cool) por custo",
    ],
  },
];

// ─── 9 ADRs Chave ─────────────────────────────────────────────────
export const keyADRs: ADR[] = [
  {
    id: "adr-001",
    number: "ADR-001",
    title: "Stack Principal: .NET 10 LTS + Next.js 16.1.6",
    context: "Necessidade de substituir Java 8 / JBoss / Struts com suporte ativo, ecossistema cloud-native e maturidade enterprise.",
    decision: "Adotar .NET 10 LTS (suporte até Nov 2028) para backend e Next.js 16.1.6 para frontend.",
    rationale: "Microsoft mantém integração nativa .NET ↔ Azure. Next.js oferece SSR, App Router, Server Components e deploy trivial no Vercel/Azure.",
    consequences: {
      positive: [
        "Suporte LTS até Nov 2028",
        "Integração nativa com Azure SDK",
        "Ecosystem de packages com segurança ativa",
      ],
      negative: ["Reescrita completa — sem reaproveitamento de código Java"],
    },
    icon: "layers",
  },
  {
    id: "adr-002",
    number: "ADR-002",
    title: "Clean Architecture (5 camadas)",
    context: "O monolito tinha dependências circulares entre todos os módulos. Qualquer mudança requeria testar tudo manualmente.",
    decision: "Implementar Clean Architecture: Domain → Application → Infrastructure → Contracts → API.",
    rationale: "Dependências sempre apontam para dentro. Domain e Application sem dependências de framework. Testabilidade isolada por camada.",
    consequences: {
      positive: [
        "197 testes unitários e de integração",
        "Troca de banco/gateway sem tocar Domain",
        "Onboarding mais rápido",
      ],
      negative: ["Mais arquivos e mapeamentos", "Curva de aprendizado inicial"],
    },
    icon: "building",
  },
  {
    id: "adr-003",
    number: "ADR-003",
    title: "Gateway Cielo via REST (Braspag/Pagador)",
    context: "O sistema legado usava ~300 stubs SOAP para se comunicar com a Cielo. A Cielo descontinuou as URLs SOAP legadas (cieloecommerce.cielo.com.br).",
    decision: "Integração via Braspag Pagador REST (apisandbox.braspag.com.br). Sem SOAP outbound.",
    rationale: "REST é o protocolo atual e suportado. ~300 stubs eliminados. Tipagem forte com records C# como DTOs.",
    consequences: {
      positive: [
        "~300 stubs → ~36 DTOs (records C#)",
        "URLs oficiais e suportadas",
        "HttpClient com Polly v8 resilience",
      ],
      negative: ["Mapeamento manual de operações legadas"],
    },
    icon: "zap",
  },
  {
    id: "adr-004",
    number: "ADR-004",
    title: "Tokenização Obrigatória (PCI DSS)",
    context: "O sistema legado persistia dados de cartão em cache local sem TTL e logava PAN em texto plano.",
    decision: "Toda transação usa SaveCard=true. PAN e CVV nunca são persistidos. Apenas CardToken, últimos 4 dígitos e bandeira.",
    rationale: "Compliance PCI DSS mandatório para processador de pagamentos. Cielo gerencia o ciclo de vida do token.",
    consequences: {
      positive: [
        "Compliance PCI DSS",
        "Zero dados sensíveis em banco próprio",
        "Tokenização gerenciada pela Cielo",
      ],
      negative: ["Dependência do sistema de tokenização da Cielo"],
    },
    icon: "shield",
  },
  {
    id: "adr-009",
    number: "ADR-009",
    title: "Okta OAuth2/OIDC + JWT RS256",
    context: "O portal legado tinha sessão HTTP sem timeout e JWT HS256 com segredo hardcoded no código.",
    decision: "Okta como Identity Provider. JWT RS256 (assimétrico) com validação via JWKS público. Token access de 1h + refresh token.",
    rationale: "Chave privada nunca sai do Okta. Verificação local via chave pública. Rotação de chaves transparente.",
    consequences: {
      positive: [
        "Zero secrets de autenticação hardcoded",
        "MFA suportado nativamente",
        "Auditoria centralizada no Okta",
      ],
      negative: ["Dependência de serviço externo (99.99% SLA Okta)"],
    },
    icon: "lock",
  },
  {
    id: "adr-015",
    number: "ADR-015",
    title: "Azure Container Apps (não AKS)",
    context: "Necessidade de orquestração de containers sem o overhead operacional de um cluster Kubernetes gerenciado.",
    decision: "Azure Container Apps com KEDA para auto-scaling baseado em métricas de fila e HTTP.",
    rationale: "Kubernetes gerenciado com abstração de complexidade. Pay-per-use. Sem gerenciamento de nó/cluster.",
    consequences: {
      positive: [
        "Zero gerenciamento de cluster K8s",
        "KEDA scaling automático",
        "Dapr support nativo",
        "Custo pay-per-vCPU-second",
      ],
      negative: ["Menos controle que AKS para cenários avançados"],
    },
    icon: "cloud",
  },
  {
    id: "adr-021",
    number: "ADR-021",
    title: "Security Hardening — Remediação Pré-Produção",
    context: "Auditoria interna revelou 11 gaps entre controles documentados e implementados: SecurityHeaders ausente, Rate Limiting ausente, CORS permissivo, HTTPS redirect faltando, senha em appsettings.",
    decision: "Remediação imediata dos gaps críticos (S-01 a S-09): SecurityHeadersMiddleware, 4 políticas de Rate Limiting, CORS restritivo, HTTPS redirect condicional e fail-fast na inicialização.",
    rationale: "Security headers são baseline OWASP/PCI DSS. Sem rate limit o sistema é vulnerável a DDoS e card testing. CORS permissivo é vetor CSRF. Fail-fast evita operação em estado inseguro.",
    consequences: {
      positive: [
        "Clickjacking, MIME sniffing e protocol downgrade mitigados",
        "Rate limit granular por tipo de endpoint",
        "Conformidade PCI DSS requisitos 6.5.3, 6.5.7, 6.5.9",
      ],
      negative: ["CSP exige atualização ao adicionar novos serviços externos"],
    },
    icon: "shield",
  },
  {
    id: "adr-019",
    number: "ADR-019",
    title: "SOAP Adapter como Microsserviço Isolado",
    context: "Parceiros legados (ACSEL/ELITA) usam SOAP/WS-Security e não podem ser migrados imediatamente para REST.",
    decision: "SOAP Adapter em container separado com CoreWCF. Traduz SOAP→MediatR→Application Layer. Sunset planejado em +12 meses.",
    rationale: "Isolamento de compatibilidade sem contaminar o sistema novo. Aplicação do Strangler Fig Pattern. Feature flag para sunset.",
    consequences: {
      positive: [
        "Parceiros legados continuam funcionando",
        "Sistema novo sem código SOAP",
        "Sunset incremental por parceiro",
      ],
      negative: ["Container adicional para manter", "Dois caminhos de entrada a testar"],
    },
    icon: "plug",
  },
  {
    id: "adr-022",
    number: "ADR-022",
    title: "Migração para .NET 10 LTS",
    context: "O .NET 9 é uma versão STS (Standard Term Support) com suporte até novembro de 2026. Para garantir estabilidade em produção e alinhamento com o ciclo LTS da Microsoft, a migração para .NET 10 LTS é necessária antes do go-live.",
    decision: "Migrar toda a solução de .NET 9 STS para .NET 10 LTS, com suporte até Nov 2028, normalização de dependências entre projetos e zero impacto na lógica de negócio.",
    rationale: ".NET 10 LTS oferece 3 anos de suporte (até Nov 2028), alinhando o ciclo de vida do runtime com o horizonte de operação do sistema. A migração é de baixo risco pois não altera APIs públicas nem lógica de domínio.",
    consequences: {
      positive: [
        "Suporte LTS até Nov 2028 — estabilidade em produção",
        "C# 14 com melhorias de performance e linguagem",
        "Dependências normalizadas entre todos os projetos",
      ],
      negative: ["Requer revalidação de todos os 197 testes após upgrade"],
    },
    icon: "layers",
  },
];

// ─── Métricas TO-BE ───────────────────────────────────────────────
export const cloudMetrics = {
  totalClasses: 383,
  testCount: 197,
  criticalCVEs: 0,
  technicalDebts: 0,
  soapDTOs: 36,
  containers: 3,
  adrs: 22,
  cleanArchLayers: 5,
  quartzJobs: 10,
  bicepModules: 6,
  deployTime: "< 5 minutos (zero downtime)",
  dotnetVersion: ".NET 10 LTS",
  azureRegion: "Brazil South (São Paulo)",
};
