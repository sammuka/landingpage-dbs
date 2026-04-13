// ─── Comparison Tables Data ───────────────────────────────────────

export interface StackRow {
  category: string;
  legacy: string;
  modern: string;
  highlight?: boolean;
  legacyStatus?: "eol" | "warning" | "ok";
}

export interface SecurityRow {
  id: string;
  vulnerability: string;
  legacyDetail: string;
  fix: string;
  fixDetail: string;
}

export interface IntegrationRow {
  aspect: string;
  legacy: string;
  modern: string;
}

// ─── Stack Tecnológico — 20 linhas ────────────────────────────────
export const stackRows: StackRow[] = [
  {
    category: "Linguagem",
    legacy: "Java 8u271",
    modern: ".NET 9 / C# 13",
    highlight: true,
    legacyStatus: "warning",
  },
  {
    category: "Runtime",
    legacy: "JVM (HotSpot 8)",
    modern: ".NET 9 CLR",
    legacyStatus: "warning",
  },
  {
    category: "App Server",
    legacy: "JBoss EAP 7.4",
    modern: "Kestrel (embutido)",
    legacyStatus: "warning",
  },
  {
    category: "Framework Web",
    legacy: "Struts 1.3 (EOL 2013)",
    modern: "ASP.NET Core 9",
    highlight: true,
    legacyStatus: "eol",
  },
  {
    category: "Frontend",
    legacy: "JSP + Struts Tags",
    modern: "Next.js 16.1.6 + React 19",
    highlight: true,
    legacyStatus: "eol",
  },
  {
    category: "ORM / Data",
    legacy: "JDBC direto + Stored Procs",
    modern: "EF Core 9 (Code First)",
    legacyStatus: "warning",
  },
  {
    category: "Banco de Dados",
    legacy: "Oracle 19c/21c (on-premises)",
    modern: "Azure SQL (gerenciado)",
    highlight: true,
  },
  {
    category: "Autenticação",
    legacy: "Sessão HTTP + JWT HS256",
    modern: "Okta OIDC + JWT RS256",
    highlight: true,
    legacyStatus: "eol",
  },
  {
    category: "Gateway de Pagamento",
    legacy: "Apache CXF 2.7.17 SOAP (EOL)",
    modern: "HttpClient + Polly v8 REST",
    highlight: true,
    legacyStatus: "eol",
  },
  {
    category: "Jobs Agendados",
    legacy: "EJB Timer Service (sem persistência)",
    modern: "Quartz.NET 3.13.0 (10 jobs, 9 ativos)",
    legacyStatus: "warning",
  },
  {
    category: "Logging",
    legacy: "SLF4J + JBoss LogManager",
    modern: "Serilog + Azure Monitor",
    legacyStatus: "warning",
  },
  {
    category: "Resiliência",
    legacy: "Sem retry / circuit breaker",
    modern: "Polly v8 via Microsoft.Extensions.Http.Resilience",
    highlight: true,
    legacyStatus: "eol",
  },
  {
    category: "Build",
    legacy: "Eclipse Projects (sem Maven/Gradle)",
    modern: "dotnet CLI + npm",
  },
  {
    category: "CI/CD",
    legacy: "Azure DevOps (apenas Fortify SAST)",
    modern: "GitHub Actions (OIDC, 3 pipelines)",
    highlight: true,
  },
  {
    category: "Deploy",
    legacy: "EAR manual no JBoss (4–6h, downtime)",
    modern: "Rolling update automático (< 5 min, zero downtime)",
    highlight: true,
  },
  {
    category: "Containers",
    legacy: "Sem containerização",
    modern: "Docker + Azure Container Apps",
    highlight: true,
  },
  {
    category: "IaC",
    legacy: "Sem Infrastructure as Code",
    modern: "Bicep (6 módulos versionados)",
    highlight: true,
  },
  {
    category: "Secrets",
    legacy: "Texto plano em .properties (no repositório)",
    modern: "Azure Key Vault + Managed Identity",
    highlight: true,
    legacyStatus: "eol",
  },
  {
    category: "Testes",
    legacy: "0 testes automatizados",
    modern: "163 testes automatizados",
    highlight: true,
    legacyStatus: "eol",
  },
  {
    category: "Arquitetura",
    legacy: "Monolito com dependências circulares",
    modern: "Clean Architecture 5 camadas",
    highlight: true,
    legacyStatus: "eol",
  },
];

// ─── 9 CVEs Eliminados ────────────────────────────────────────────
export const securityRows: SecurityRow[] = [
  {
    id: "sec-01",
    vulnerability: "AES-CBC com IV fixo (zeros)",
    legacyDetail: "CryptoUtil.java:47 — IV hardcoded como 16 zeros",
    fix: "AES-256-GCM com IV aleatório",
    fixDetail: "IV gerado por operação. Chave gerenciada no Azure Key Vault.",
  },
  {
    id: "sec-02",
    vulnerability: "JWT HS256 com segredo hardcoded",
    legacyDetail: "AuthFilter.java:23 — secret literal no código",
    fix: "JWT RS256 via Okta OIDC",
    fixDetail: "Chave privada nunca sai do Okta. Validação local por chave pública JWKS.",
  },
  {
    id: "sec-03",
    vulnerability: "MD5 sem salt para senhas",
    legacyDetail: "UserService.java:89 — MessageDigest.getInstance(\"MD5\")",
    fix: "BCrypt cost 12",
    fixDetail: "ASP.NET Core Identity com salt aleatório por usuário.",
  },
  {
    id: "sec-04",
    vulnerability: "SQL Injection por concatenação",
    legacyDetail: "QueryBuilder.java:156 — \"SELECT * FROM \" + tableName",
    fix: "EF Core 9 LINQ parametrizado",
    fixDetail: "Todas as queries parametrizadas por padrão pelo ORM.",
  },
  {
    id: "sec-05",
    vulnerability: "Apache CXF 2.7.17 SSRF/RCE (CVE-2022-46364)",
    legacyDetail: "dbs-ws/pom.xml — cxf-rt-frontend-jaxws 2.7.17",
    fix: "CoreWCF 1.x em container isolado",
    fixDetail: "SOAP confinado ao SOAP Adapter. Sem WSDL público.",
  },
  {
    id: "sec-06",
    vulnerability: "Struts 1.3 RCE (CVE-2023-34396)",
    legacyDetail: "dbsportal/pom.xml — struts-core 1.3.10 (EOL 2013)",
    fix: "Next.js 16.1.6 + App Router",
    fixDetail: "Sem framework MVC com histórico de RCE no servidor.",
  },
  {
    id: "sec-07",
    vulnerability: "PAN e CVV em logs de texto plano",
    legacyDetail: "PaymentLogger.java:34 — log.info(\"Card: \" + pan)",
    fix: "Mascaramento obrigatório via Serilog",
    fixDetail: "Destructuring policy: CardNumber=****1234, CVV=***.",
  },
  {
    id: "sec-08",
    vulnerability: "XXE em parsing SOAP",
    legacyDetail: "SoapParser.java:78 — DocumentBuilderFactory padrão",
    fix: "XmlReaderSettings com DtdProcessing.Prohibit",
    fixDetail: "CoreWCF aplica bloqueio de XXE por padrão.",
  },
  {
    id: "sec-09",
    vulnerability: "Sessão HTTP sem timeout",
    legacyDetail: "web.xml — sem session-config/session-timeout",
    fix: "Token Okta com expiração 1h + refresh",
    fixDetail: "Portal Next.js stateless. Sem sessão server-side.",
  },
];

// ─── Modelo de Integração ─────────────────────────────────────────
export const integrationRows: IntegrationRow[] = [
  { aspect: "Protocolo", legacy: "SOAP 1.1 / HTTP", modern: "REST / HTTPS" },
  { aspect: "Formato", legacy: "XML (Envelope SOAP)", modern: "JSON" },
  { aspect: "Segurança", legacy: "WS-Security + certificado auto-assinado", modern: "JWT RS256 (Okta) + TLS 1.3" },
  { aspect: "Descrição de contrato", legacy: "WSDL (gerado, ~300 stubs)", modern: "OpenAPI 3.1 (Swagger UI)" },
  { aspect: "Idempotência", legacy: "Sem controle", modern: "MerchantOrderId + X-Idempotency-Key header" },
  { aspect: "Versioning", legacy: "Sem versionamento", modern: "URL path versioning (/api/v1/)" },
  { aspect: "Erros", legacy: "SOAP Fault XML", modern: "RFC 7807 (Problem Details JSON)" },
];

export const soapExampleRequest = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:dbs="http://dbs.assurant.com.br/payment">
  <soapenv:Header>
    <wsse:Security>
      <wsse:UsernameToken>
        <wsse:Username>user</wsse:Username>
        <wsse:Password>pass</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <dbs:AutorizarPagamento>
      <NumeroCartao>4111111111111111</NumeroCartao>
      <Validade>12/2026</Validade>
      <CVV>123</CVV>
      <Valor>15000</Valor>
      <Parcelas>1</Parcelas>
    </dbs:AutorizarPagamento>
  </soapenv:Body>
</soapenv:Envelope>`;

export const restExampleRequest = `POST /api/v1/payments HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...
X-Idempotency-Key: 550e8400-e29b-41d4-a716
Content-Type: application/json

{
  "merchantOrderId": "ORD-2026-00042",
  "customer": {
    "name": "João Silva",
    "identity": "***.***.***-42"
  },
  "payment": {
    "type": "CreditCard",
    "amount": 15000,
    "installments": 1,
    "capture": false,
    "creditCard": {
      "cardNumber": "4111111111111111",
      "holder": "JOAO SILVA",
      "expirationDate": "12/2026",
      "securityCode": "123",
      "saveCard": true
    }
  }
}`;
