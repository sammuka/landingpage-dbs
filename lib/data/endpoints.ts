// ─── Endpoints Data — SOAP → REST Mapping ────────────────────────

export interface EndpointMapping {
  soapOperation: string;
  soapAction: string;
  restMethod: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  restPath: string;
  description: string;
  status: "active" | "sunset-planned";
}

export interface SoapService {
  name: string;
  namespace: string;
  wsdlPath: string;
  description: string;
  operations: EndpointMapping[];
}

// ─── Mapeamento das 7 operações SOAP para REST ────────────────────
export const soapToRestMappings: EndpointMapping[] = [
  {
    soapOperation: "AutorizarPagamento",
    soapAction: "urn:AutorizarPagamento",
    restMethod: "POST",
    restPath: "/api/v1/payments",
    description: "Autoriza pagamento via cartão de crédito com tokenização obrigatória",
    status: "active",
  },
  {
    soapOperation: "CapturarPagamento",
    soapAction: "urn:CapturarPagamento",
    restMethod: "POST",
    restPath: "/api/v1/payments/{id}/capture",
    description: "Captura pagamento previamente autorizado (dual-capture mode)",
    status: "active",
  },
  {
    soapOperation: "CancelarPagamento",
    soapAction: "urn:CancelarPagamento",
    restMethod: "DELETE",
    restPath: "/api/v1/payments/{id}",
    description: "Cancela ou estorna pagamento",
    status: "active",
  },
  {
    soapOperation: "ConsultarPagamento",
    soapAction: "urn:ConsultarPagamento",
    restMethod: "GET",
    restPath: "/api/v1/payments/{id}",
    description: "Consulta status e detalhes de pagamento por ID",
    status: "active",
  },
  {
    soapOperation: "AgendarRecorrencia",
    soapAction: "urn:AgendarRecorrencia",
    restMethod: "POST",
    restPath: "/api/v1/payments/recurrence",
    description: "Agenda cobrança recorrente com CardToken e data de vencimento",
    status: "active",
  },
  {
    soapOperation: "CancelarRecorrencia",
    soapAction: "urn:CancelarRecorrencia",
    restMethod: "DELETE",
    restPath: "/api/v1/payments/recurrence/{id}",
    description: "Cancela recorrência ativa",
    status: "active",
  },
  {
    soapOperation: "ConsultarFatura",
    soapAction: "urn:ConsultarFatura",
    restMethod: "GET",
    restPath: "/api/v1/admin/payments?customerId={customerId}",
    description: "Consulta histórico de faturas por cliente (movida para Admin API)",
    status: "active",
  },
];

export const sunsetStrategy = {
  timeline: "+12 meses após go-live (Q1 2027)",
  mechanism: "Feature flag por parceiro — desabilita endpoint SOAP individualmente",
  notification: "Email automático 90 e 30 dias antes do sunset por parceiro",
  partners: ["ACSEL", "ELITA", "Sistema legado interno"],
  note: "O SOAP Adapter (CoreWCF) será descomissionado quando o último parceiro migrar para REST. O Application Layer e domain permanecerão inalterados.",
};

// ─── Estratégia Dual Endpoint ─────────────────────────────────────
export const dualEndpointStrategy = {
  soapAdapter: {
    container: "soap-adapter",
    technology: "CoreWCF 1.x / .NET 10 LTS",
    exposure: "Interno (não exposto diretamente pela internet)",
    authentication: "WS-Security (compatibilidade legada)",
    purpose: "Recebe chamadas SOAP de parceiros legados, traduz para MediatR commands",
    sharedLayer: "Application Layer (MediatR handlers) — exata mesma lógica que o REST",
  },
  restApi: {
    container: "dbs-api",
    technology: "ASP.NET Core 10 / Minimal APIs + Controllers",
    exposure: "HTTPS público via Azure Container Apps ingress",
    authentication: "JWT RS256 (Okta) + X-Idempotency-Key header",
    purpose: "API principal para novos parceiros e integrações modernas",
    sharedLayer: "Application Layer (MediatR handlers) — mesma lógica que o SOAP",
  },
};
