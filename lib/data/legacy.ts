// ─── Legacy System Data (AS-IS) ──────────────────────────────────
// Fonte: DBS-FontesHistórico/docs/as-is/ (16 documentos)

export interface LegacyModule {
  id: string;
  name: string;
  type: "core" | "data" | "web" | "integration" | "job";
  lines: number;
  classes: number;
  description: string;
  issues: string[];
  dependencies: string[];
}

export interface SecurityVulnerability {
  id: string;
  cve?: string;
  title: string;
  severity: "critical" | "high" | "medium";
  file: string;
  description: string;
  fix: string;
}

export interface TechnicalDebt {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  category: "security" | "architecture" | "code" | "dependency" | "testing";
  description: string;
}

// ─── 7 Módulos Eclipse do Monolito ────────────────────────────────
export const legacyModules: LegacyModule[] = [
  {
    id: "dbs-lib",
    name: "dbs-lib",
    type: "core",
    lines: 18400,
    classes: 142,
    description: "Biblioteca compartilhada — utilitários, constantes, modelos de domínio",
    issues: [
      "Acoplamento circular com dbs e dbspag",
      "Classes utilitárias com 800+ linhas",
      "Zero testes unitários",
    ],
    dependencies: [],
  },
  {
    id: "dbs",
    name: "dbs",
    type: "core",
    lines: 62000,
    classes: 289,
    description: "Core de negócio — regras de cobrança, processamento de prêmios de seguro",
    issues: [
      "BillingServiceBean com 4.700+ linhas",
      "Transações XA sem compensação",
      "42 TODO/FIXME críticos no código",
    ],
    dependencies: ["dbs-lib"],
  },
  {
    id: "dbsdb",
    name: "dbsdb",
    type: "data",
    lines: 9200,
    classes: 67,
    description: "Camada de acesso a dados — JDBC direto, stored procedures Oracle",
    issues: [
      "SQL construído por concatenação (SQL injection)",
      "Pool de conexões não gerenciado",
      "Schema sem versionamento",
    ],
    dependencies: ["dbs-lib"],
  },
  {
    id: "dbs-ws",
    name: "dbs-ws",
    type: "integration",
    lines: 28600,
    classes: 198,
    description: "Web Services SOAP — ~300 stubs Apache CXF 2.7.17, interface com Braspag/Cielo",
    issues: [
      "Apache CXF 2.7.17 (EOL 2017) — CVE-2022-46364",
      "WS-Security com certificados auto-assinados",
      "~300 classes stub geradas sem revisão",
    ],
    dependencies: ["dbs-lib", "dbs"],
  },
  {
    id: "dbsportal",
    name: "dbsportal",
    type: "web",
    lines: 31800,
    classes: 187,
    description: "Portal de administração — Struts 1.3 (EOL 2013), JSP, DisplayTag",
    issues: [
      "Struts 1.3 — EOL desde 2013, CVE-2023-34396",
      "JSPs com lógica de negócio embutida",
      "Sessão HTTP sem expiração configurada",
    ],
    dependencies: ["dbs-lib", "dbs", "dbsdb"],
  },
  {
    id: "dbspag",
    name: "dbspag",
    type: "core",
    lines: 44200,
    classes: 198,
    description: "Módulo de pagamentos — orquestração de cobranças, integração Braspag",
    issues: [
      "Chaves AES-256/CBC com IV fixo zeros",
      "Dados de cartão em cache local sem TTL",
      "Acoplamento direto com dbsdb sem abstração",
    ],
    dependencies: ["dbs-lib", "dbs", "dbsdb", "dbs-ws"],
  },
  {
    id: "dbstimer",
    name: "dbstimer",
    type: "job",
    lines: 8900,
    classes: 52,
    description: "Jobs batch — cobrança recorrente via EJB Timer Service JBoss",
    issues: [
      "EJB Timer sem persistência — perde jobs no restart",
      "Sem mecanismo de retry ou dead-letter",
      "Logs apenas em console JBoss",
    ],
    dependencies: ["dbs", "dbspag"],
  },
];

// ─── 9 Vulnerabilidades Críticas ──────────────────────────────────
export const securityVulnerabilities: SecurityVulnerability[] = [
  {
    id: "vuln-01",
    cve: "CVE-2022-46364",
    title: "Apache CXF SSRF / RCE",
    severity: "critical",
    file: "dbs-ws/pom.xml: cxf 2.7.17",
    description: "Apache CXF 2.7.17 (EOL 2017) permite SSRF e potencial RCE via endpoint de metadados WSDL malformado.",
    fix: "Substituído por CoreWCF 1.x (.NET) — container isolado, sem exposição de metadados WSDL não autenticados.",
  },
  {
    id: "vuln-02",
    cve: "CVE-2023-34396",
    title: "Struts 1.3 Path Traversal / RCE",
    severity: "critical",
    file: "dbsportal/pom.xml: struts 1.3.10",
    description: "Struts 1.3 (EOL 2013) tem múltiplas vulnerabilidades de path traversal que permitem execução remota de código.",
    fix: "Portal reescrito em Next.js 16.1.6 com App Router. Sem framework MVC de servidor com histórico de RCE.",
  },
  {
    id: "vuln-03",
    title: "AES-CBC com IV fixo zeros",
    severity: "critical",
    file: "dbspag/src/CryptoUtil.java:47",
    description: "Cifragem AES-256/CBC com IV hardcoded como array de 16 zeros — torna a cifragem determinística e quebrável.",
    fix: "AES-256-GCM com IV aleatório por operação, chave gerenciada pelo Azure Key Vault com rotação automática.",
  },
  {
    id: "vuln-04",
    title: "JWT HS256 com segredo hardcoded",
    severity: "critical",
    file: "dbs/src/AuthFilter.java:23",
    description: "Token JWT usando HMAC-SHA256 com segredo literal no código-fonte. Qualquer acesso ao repositório compromete todos os tokens.",
    fix: "Okta como Identity Provider com JWT RS256 (assimétrico). Chave privada nunca sai do Okta. Verificação via JWKS endpoint.",
  },
  {
    id: "vuln-05",
    title: "MD5 sem salt para senhas",
    severity: "critical",
    file: "dbs/src/UserService.java:89",
    description: "Senhas de usuários armazenadas com hash MD5 sem salt. Vulnerável a ataques de rainbow table.",
    fix: "BCrypt com cost factor 12 via ASP.NET Core Identity. Hash individual por usuário com salt aleatório.",
  },
  {
    id: "vuln-06",
    title: "SQL Injection por concatenação",
    severity: "critical",
    file: "dbsdb/src/QueryBuilder.java:156",
    description: "Múltiplas queries construídas por concatenação de strings sem parametrização. Entrada do usuário direta na query.",
    fix: "EF Core 10 com LINQ — toda query é parametrizada por padrão. Sem SQL raw dinâmico.",
  },
  {
    id: "vuln-07",
    title: "Dados de cartão em log",
    severity: "critical",
    file: "dbspag/src/PaymentLogger.java:34",
    description: "PAN (número completo do cartão) e CVV sendo logados em texto plano no console JBoss.",
    fix: "Regra de mascaramento obrigatória: CardNumber=****1234, CVV=***. Serilog com destructuring policy.",
  },
  {
    id: "vuln-08",
    title: "XXE em parsing SOAP",
    severity: "high",
    file: "dbs-ws/src/SoapParser.java:78",
    description: "Parser XML sem desabilitar external entities. Permite XXE (XML External Entity) em mensagens SOAP.",
    fix: "System.Xml.XmlReaderSettings com DtdProcessing.Prohibit e XmlResolver nulo. CoreWCF aplica por padrão.",
  },
  {
    id: "vuln-09",
    title: "Sessão HTTP sem expiração",
    severity: "high",
    file: "dbsportal/web.xml: session-config ausente",
    description: "Sessões do portal sem timeout configurado. Sessão permanece válida indefinidamente após login.",
    fix: "Okta OIDC com token access de 1 hora + refresh token. Portal Next.js sem estado de sessão server-side.",
  },
];

// ─── Métricas AS-IS ───────────────────────────────────────────────
export const legacyMetrics = {
  totalClasses: 906,
  totalLines: 203100,
  testCount: 0,
  testCoverage: 0,
  criticalCVEs: 9,
  technicalDebts: 48,
  soapStubs: 300,
  javaVersion: "Java 8u271",
  appServer: "JBoss EAP 7.4",
  framework: "Struts 1.3 / Apache CXF 2.7.17",
  database: "Oracle 19c/21c",
  deployTime: "4–6 horas (downtime)",
  eolComponents: ["Struts 1.3 (EOL 2013)", "Apache CXF 2.7.17 (EOL 2017)", "DisplayTag 1.2", "JBoss EAP 7.4 (EOL 2026)"],
};
