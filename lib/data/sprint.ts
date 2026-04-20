// ─── Sprint de Discovery & Implementação — 31/03 → 10/04/2026 ──────────────
// Narrativa: documentação AS-IS e TO-BE construída pela equipe (não recebida)
// IA usada como ferramenta de apoio — o trabalho intelectual é da equipe

export type SprintEventCategory =
  | "discovery"    // Engenharia reversa e leitura de fontes
  | "docbuild"     // Construção de documentação pelo time
  | "decision"     // Decisão arquitetural
  | "impl"         // Implementação de código
  | "security"     // Auth/Okta/PCI
  | "infra"        // Docker/Azure/CI
  | "validation";  // Testes/validação

export interface SprintBadge {
  label: string;
  color: string; // hex
}

export interface SprintEvent {
  id: string;
  title: string;
  description: string;
  category: SprintEventCategory;
  badges: SprintBadge[];
  metrics?: string[];      // highlighted numbers/facts
  path?: "A" | "B";        // migration path relevance
}

export interface SprintDay {
  id: string;
  date: string;            // "DD/MM"
  dayLabel: string;        // "Dia 0", "Dia 1" etc.
  dayOfWeek: string;       // "Seg", "Ter" etc.
  color: string;           // hex accent
  headline: string;        // one-line summary
  weight: "normal" | "heavy"; // heavy = discovery days, get more visual space
  events: SprintEvent[];
}

// ─── Badges ─────────────────────────────────────────────────────────────────

export const BADGE_AI: SprintBadge    = { label: "IA assistida", color: "#7c3aed" };
export const BADGE_OKTA: SprintBadge  = { label: "Okta",         color: "#00297a" };
export const BADGE_PCI: SprintBadge   = { label: "PCI DSS",      color: "#dc2626" };
export const BADGE_AZURE: SprintBadge = { label: "Azure",        color: "#0078d4" };
export const BADGE_DOTNET: SprintBadge = { label: ".NET 10 LTS",  color: "#512bd4" };
export const BADGE_ENG: SprintBadge   = { label: "Eng. Reversa", color: "#d97706" };

// ─── Sprint days ─────────────────────────────────────────────────────────────

export const sprintDays: SprintDay[] = [
  // ── FASE 1: DISCOVERY (31/03 – 02/04) ── A fase mais densa ─────────────

  {
    id: "day-0",
    date: "31/03",
    dayLabel: "Dia 0",
    dayOfWeek: "Seg",
    color: "#dc2626",
    headline: "Acesso ao repositório · Início da engenharia reversa",
    weight: "heavy",
    events: [
      {
        id: "ev-repo-access",
        title: "Acesso ao repositório de fontes Azure",
        description:
          "Clonagem do repositório histórico DBS: 7 módulos Eclipse, 906 classes Java, 134.868 linhas de código — sem Maven, sem testes automatizados, sem documentação. Azure Pipelines configurado apenas para scan Fortify. Ponto de partida do processo de compreensão.",
        category: "discovery",
        badges: [BADGE_ENG],
        metrics: ["906 classes Java", "134.868 linhas", "7 módulos Eclipse", "0 testes", "0 documentação"],
      },
      {
        id: "ev-reading",
        title: "Leitura e mapeamento das 906 classes",
        description:
          "A equipe iniciou a leitura sistemática das fontes: EJBs stateless, timers, DAOs, entidades JPA, ações Struts e endpoints SOAP. Sem documentação prévia, cada regra de negócio foi extraída diretamente do código-fonte — incluindo o BillingServiceBean de 4.700 linhas.",
        category: "discovery",
        badges: [BADGE_ENG, BADGE_AI],
        metrics: ["71 EJBs stateless", "7 timers EJB", "56 DAOs", "27 entidades JPA", "4.700 LOC em 1 único bean"],
      },
      {
        id: "ev-asdocs-start",
        title: "Início da construção da documentação AS-IS",
        description:
          "Com o entendimento em construção, a equipe começou a produzir os documentos AS-IS: visão geral do sistema, arquitetura dos 7 módulos, fluxos de negócio e integrações externas (Braspag/Cielo, ACSEL/ELITA, SCA). IA usada como ferramenta de apoio à síntese.",
        category: "docbuild",
        badges: [BADGE_AI],
        metrics: ["docs 001-004 iniciados"],
      },
    ],
  },

  {
    id: "day-1",
    date: "01/04",
    dayLabel: "Dia 1",
    dayOfWeek: "Ter",
    color: "#dc2626",
    headline: "Acesso ao banco de dados · Análise profunda e documentação",
    weight: "heavy",
    events: [
      {
        id: "ev-db-access",
        title: "Acesso ao modelo de dados Oracle",
        description:
          "A equipe recebeu acesso ao schema AIZ_DBS. Análise completa das 27 tabelas, 26 sequências, 1 trigger, 1 função PL/SQL (EXPURGAR_DADOS_DBS com dead code) e 2 views. Identificados 6 campos com senhas em texto plano nas tabelas EMPRESA, PARAMETRO e CHAVE.",
        category: "discovery",
        badges: [BADGE_ENG],
        metrics: ["27 tabelas", "26 sequências", "6 campos com senha em texto plano", "1 bug no PL/SQL"],
      },
      {
        id: "ev-debt-doc",
        title: "Construção do catálogo de dívidas técnicas",
        description:
          "A equipe catalogou e classificou 42 dívidas técnicas extraídas da leitura do código: 9 críticas (AES com IV=0, token trivial, MD5 sem salt, secrets hardcoded, PAN/CVV exposto em toString(), credenciais no banco), 17 altas, 14 médias, 4 baixas.",
        category: "docbuild",
        badges: [BADGE_AI],
        metrics: ["42 dívidas técnicas", "9 críticas", "17 altas", "9 CVEs identificados"],
      },
      {
        id: "ev-security-doc",
        title: "Documentação de segurança e gap de compliance",
        description:
          "Construção dos documentos de segurança (011), logs e auditoria (012) e modelo de dados (005). Mapeamento dos 53 gaps entre o sistema legado e qualquer arquitetura moderna — incluindo SOAP→REST, auth, PCI DSS, observabilidade e zero testes.",
        category: "docbuild",
        badges: [BADGE_AI, BADGE_PCI],
        metrics: ["docs 005, 011, 012 concluídos", "53 gaps mapeados"],
      },
    ],
  },

  {
    id: "day-2",
    date: "02/04",
    dayLabel: "Dia 2",
    dayOfWeek: "Qua",
    color: "#d97706",
    headline: "16 docs AS-IS concluídos · Dois caminhos TO-BE projetados",
    weight: "heavy",
    events: [
      {
        id: "ev-asdocs-complete",
        title: "Conclusão dos 16 documentos AS-IS",
        description:
          "A equipe concluiu a documentação completa do sistema legado: visão geral, arquitetura, fluxos de negócio, integrações, modelo de dados, regras de negócio, interface do usuário, endpoints, processos assíncronos, tratamento de erros, segurança, logs, dívidas técnicas, gap analysis, impacto de banco e métricas de código.",
        category: "docbuild",
        badges: [BADGE_AI],
        metrics: ["16 documentos concluídos", "4.327 linhas só no Caminho A", "gap analysis: 53 gaps"],
      },
      {
        id: "ev-path-a",
        title: "Caminho A projetado: Java 25 LTS + Spring Boot + Angular 18 (on-premises)",
        description:
          "A equipe projetou e documentou em detalhe o caminho de migração on-premises: Java 25 LTS, Spring Boot 3.x, Angular 18+, WildFly standalone — banco Oracle inalterado. Strangler Fig descartado por acoplamento JNDI. Shadow mode definido para coexistência. Documentação: 001-estrategia-migracao.md + 002-decisoes-arquiteturais.md (4.327 linhas).",
        category: "docbuild",
        badges: [],
        path: "A",
        metrics: ["Java 25 LTS", "Spring Boot 3.x", "Angular 18", "Oracle inalterado", "4 fases documentadas", "12 riscos mapeados"],
      },
      {
        id: "ev-path-b",
        title: "Caminho B projetado: .NET 10 LTS + Azure Container Apps + Okta",
        description:
          "A equipe projetou o caminho cloud-native: ASP.NET Core 10, Clean Architecture em 5 camadas, Azure Container Apps, Azure SQL, Okta OAuth2/OIDC. 22 ADRs esboçados cobrindo stack, tokenização, dual-recorrência, dual-idempotência, segurança PCI DSS, jobs Quartz, SOAP Adapter.",
        category: "docbuild",
        badges: [BADGE_DOTNET, BADGE_AZURE, BADGE_AI],
        path: "B",
        metrics: [".NET 10 LTS", "Azure Container Apps", "22 ADRs esboçados", "Clean Architecture 5 camadas"],
      },
    ],
  },

  // ── FASE 2: DECISÃO + IMPLEMENTAÇÃO (04/04) ──────────────────────────────
  // day-3 (03/04 Qui) — sem entrada: dia de consolidação interna, sem evento destacável

  {
    id: "day-4",
    date: "04/04",
    dayLabel: "Dia 4",
    dayOfWeek: "Sáb",
    color: "#0078d4",
    headline: "Decisão: Caminho B · 215 tasks implementadas",
    weight: "normal",
    events: [
      {
        id: "ev-decision",
        title: "Decisão: Caminho B escolhido",
        description:
          "Análise comparativa de TCO, time-to-market, escalabilidade e risco técnico. Cloud-native venceu: zero-downtime deploy, Managed Identity, eliminação de infraestrutura on-premises, Okta centralizado, Cielo.js para PCI DSS. ADR-018: API unificada — Payments + Admin num único host.",
        category: "decision",
        badges: [BADGE_DOTNET, BADGE_AZURE],
        path: "B",
      },
      {
        id: "ev-impl",
        title: "10 fases implementadas com apoio de IA",
        description:
          "Clean Architecture em 5 camadas (Domain → Application → Infrastructure → Contracts → API). 27 controllers, 10 Quartz jobs, DbContext unificado, SOAP Adapter CoreWCF, 58 docs. IA utilizada como par de programação na geração de código, revisão e refatoração.",
        category: "impl",
        badges: [BADGE_DOTNET, BADGE_AI],
        metrics: ["215 tasks", "250 arquivos C#", "58 docs", "27 controllers", "10 Quartz jobs"],
      },
      {
        id: "ev-tests",
        title: "197 testes — 100% passando",
        description:
          "197 testes automatizados (xUnit + FluentAssertions + NSubstitute + Testcontainers/Azure SQL Edge). Cobertura Domain + Application > 80%. Comparado ao legado: 906 classes Java com 0 testes.",
        category: "validation",
        badges: [],
        metrics: ["197 testes", "100% passando", ">80% cobertura", "vs. 0 testes no legado"],
      },
    ],
  },

  // ── FASE 3: SEGURANÇA E INFRA (06/04 – 07/04) ────────────────────────────
  // day-5 (05/04 Dom) — sem entrada: domingo; verificação BIN e ajustes menores sem destaque

  {
    id: "day-6",
    date: "06/04",
    dayLabel: "Dia 6",
    dayOfWeek: "Seg",
    color: "#00297a",
    headline: "Okta: MFA para o portal + App-to-App para sistemas",
    weight: "normal",
    events: [
      {
        id: "ev-okta-b2b",
        title: "Okta App-to-App: OAuth2 Client Credentials",
        description:
          "Sistemas externos autenticam via client_id + client_secret no Okta. JWT RS256 validado por JWKS (sem chave hardcoded, rotação automática). 5 escopos RBAC: payments:write, payments:read, recurrences:write, admin:config, admin:audit. Elimina os tokens MD5 hardcoded do legado.",
        category: "security",
        badges: [BADGE_OKTA, BADGE_PCI],
        metrics: ["JWT RS256", "JWKS automático", "5 escopos RBAC", "vs. MD5 sem salt no legado"],
      },
      {
        id: "ev-okta-mfa",
        title: "Okta MFA: Authorization Code + PKCE para o portal",
        description:
          "Portal Next.js redireciona para login Okta com MFA aplicado pela política corporativa. NextAuth.js gerencia sessão. Access token Bearer nas chamadas Admin API. Zero gerenciamento de senha no DBS — delegado integralmente ao Okta.",
        category: "security",
        badges: [BADGE_OKTA],
        metrics: ["MFA obrigatório", "PKCE", "NextAuth.js", "zero senha no DBS"],
      },
    ],
  },

  {
    id: "day-7",
    date: "07/04",
    dayLabel: "Dia 7",
    dayOfWeek: "Ter",
    color: "#107c10",
    headline: "Docker · Hosted Payment Page · PCI DSS",
    weight: "normal",
    events: [
      {
        id: "ev-docker",
        title: "Docker multi-stage + docker-compose",
        description:
          "4 serviços containerizados: dbs-api (:5000), dbs-portal (:3000), dbs-soap-adapter (:8081), sqlserver (:1433). .NET 10 LTS multi-stage build. Ambiente local reprodutível com um único `docker compose up -d`.",
        category: "infra",
        badges: [BADGE_AZURE],
        metrics: ["4 containers", "docker compose up -d", "ambiente reprodutível"],
      },
      {
        id: "ev-adr020",
        title: "ADR-020: Hosted Payment Page — PAN/CVV zero no backend",
        description:
          "Cielo.js tokeniza o cartão no browser → CardToken enviado ao backend (PAN/CVV nunca chegam ao servidor). JWT RS256 por parceiro (não shared secret). jti previne replay. CSP + rate limit. SAQ A-EP: escopo PCI DSS reduzido.",
        category: "security",
        badges: [BADGE_PCI],
        metrics: ["PAN/CVV zero no backend", "JWT RS256 por parceiro", "SAQ A-EP", "vs. PAN exposto no legado"],
      },
    ],
  },

  // ── FASE 4: VALIDAÇÃO FINAL (10/04) ──────────────────────────────────────
  // day-8 (08/04 Qua), day-9 (09/04 Qui) — sem entradas: refinamentos de testes sem evento destacável

  {
    id: "day-10",
    date: "10/04",
    dayLabel: "Dia 10",
    dayOfWeek: "Sex",
    color: "#0891b2",
    headline: "Testes locais completos · Sistema pronto",
    weight: "normal",
    events: [
      {
        id: "ev-local-tests",
        title: "Testes locais completos",
        description:
          "197 testes passando no ambiente Docker local. 4 coleções Postman validadas: DBS-API, DBS-SOAP-Adapter, DBS-Admin-Full, DBS-Mass-Test. Endpoints Payment + Admin cobertos. SOAP Adapter validado contra o WSDL original.",
        category: "validation",
        badges: [],
        metrics: ["197 testes", "4 coleções Postman", "SOAP + REST validados"],
      },
      {
        id: "ev-ready",
        title: "10 dias: de zero documentação a sistema cloud-native",
        description:
          "Engenharia reversa completa, 16 docs AS-IS construídos, dois caminhos TO-BE projetados, decisão tomada, sistema implementado. De 9 CVEs críticos e 0 testes a 197 testes, Clean Architecture, Okta, PCI DSS e IaC Bicep. Próximo: deploy Azure Container Apps.",
        category: "impl",
        badges: [BADGE_DOTNET, BADGE_AZURE, BADGE_OKTA],
        metrics: ["383 tipos C# (vs. 906 classes Java)", "0 CVEs críticos", "197 testes", "IaC Bicep pronto"],
      },
    ],
  },
];

// ─── Summary counters ────────────────────────────────────────────────────────

export interface SprintSummary {
  totalDays: number;
  startDate: string;
  endDate: string;
  asIsDocsBuilt: number;
  adrsCreated: number;
  csharpFiles: number;
  tests: number;
  tasksExecuted: number;
  pathsDesigned: number;
  technicalDebts: number;
  gapsIdentified: number;
}

export const sprintSummary: SprintSummary = {
  totalDays: 10,
  startDate: "31/03/2026",
  endDate: "10/04/2026",
  asIsDocsBuilt: 16,
  adrsCreated: 22,
  csharpFiles: 250,
  tests: 197,
  tasksExecuted: 215,
  pathsDesigned: 2,
  technicalDebts: 42,
  gapsIdentified: 53,
};
