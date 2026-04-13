// ─── Journey Timeline — 5 Phases ─────────────────────────────────

export interface TimelinePhase {
  id: string;
  number: string;
  title: string;
  period: string;
  color: string;
  colorDark: string;
  details: string[];
  deliverables: string[];
  icon: string;
}

export const timelinePhases: TimelinePhase[] = [
  {
    id: "diagnosis",
    number: "01",
    title: "Diagnóstico",
    period: "Q1 2024",
    color: "#dc2626",
    colorDark: "#f87171",
    details: [
      "Análise de ~1.100 classes Java em 7 módulos Eclipse",
      "Mapeamento de 48 dívidas técnicas e 9 CVEs críticos",
      "Auditoria de dependências EOL (Struts 1.3, CXF 2.7.17)",
      "Avaliação de 0% cobertura de testes",
    ],
    deliverables: [
      "15 documentos AS-IS (docs/as-is/)",
      "Risk Assessment Matrix",
      "Dependency audit report",
    ],
    icon: "search",
  },
  {
    id: "analysis",
    number: "02",
    title: "Análise de Caminhos",
    period: "Q2 2024",
    color: "#d97706",
    colorDark: "#fcd34d",
    details: [
      "Caminho A: Java 25 LTS + Spring Boot 3 + Angular 18 (on-premises)",
      "Caminho B: .NET 9 + Azure Container Apps (cloud-native)",
      "Comparação TCO, time-to-market, risco técnico",
      "Apresentação ao Assurant Brasil para decisão",
    ],
    deliverables: [
      "docs/to-be/001-estrategia-migracao.md",
      "docs/to-be/002-decisoes-arquiteturais.md (Java path)",
      "Risk matrix comparativa",
    ],
    icon: "git-branch",
  },
  {
    id: "adrs",
    number: "03",
    title: "ADRs — 21 Decisões",
    period: "Q3 2024",
    color: "#0078d4",
    colorDark: "#60a5fa",
    details: [
      "ADR-001: .NET 9 + Next.js 16.1.6 como stack principal",
      "ADR-009: Okta OAuth2/OIDC + JWT RS256",
      "ADR-015: Azure Container Apps (não AKS)",
      "ADR-019: SOAP Adapter isolado (Strangler Fig)",
      "ADR-021: Security Hardening — remediação de gaps pré-produção",
    ],
    deliverables: [
      "21 ADRs versionados em docs/adr/",
      "Arquitetura aprovada",
      "Estrutura Clean Architecture definida",
    ],
    icon: "file-text",
  },
  {
    id: "implementation",
    number: "04",
    title: "Implementação",
    period: "Q3 2024 — Q1 2026",
    color: "#107c10",
    colorDark: "#4ade80",
    details: [
      "Clean Architecture em 5 camadas com 163 testes",
      "3 containers Azure (API Unificada, Portal, SOAP Adapter)",
      "6 módulos Bicep IaC + 3 pipelines GitHub Actions",
    ],
    deliverables: [
      "Microsserviço .NET 9 completo",
      "Portal Next.js 16.1.6",
      "Infraestrutura Bicep",
      "Documentação técnica completa",
    ],
    icon: "code-2",
  },
  {
    id: "result",
    number: "05",
    title: "Resultado",
    period: "Q1 2026",
    color: "#0891b2",
    colorDark: "#67e8f9",
    details: [
      "~1.100 classes Java → ~383 tipos C# (Clean Architecture)",
      "0 testes → 163 testes automatizados",
      "9 CVEs críticos → 0 vulnerabilidades críticas",
      "Deploy de 4–6h com downtime → < 5 minutos zero downtime",
    ],
    deliverables: [
      "Sistema em produção",
      "Zero dívidas técnicas críticas",
      "Documentação técnica arquivada",
    ],
    icon: "trophy",
  },
];
