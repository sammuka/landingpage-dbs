"use client";

import { soapToRestMappings, dualEndpointStrategy, sunsetStrategy } from "@/lib/data/endpoints";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── HTTP method badge ────────────────────────────────────────────────────────

type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-green-100 text-green-700 border-green-300 dark:bg-green-950/60 dark:text-green-400 dark:border-green-800/40",
  POST: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/40",
  PUT: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/40",
  PATCH: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-800/40",
  DELETE: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800/40",
};

function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono-tech font-bold border ${methodColors[method]}`}
    >
      {method}
    </span>
  );
}

// ─── Architecture diagram ─────────────────────────────────────────────────────

function ArchDiagram() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT — Legacy SOAP */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono-tech text-muted-foreground uppercase tracking-widest mb-1">
          ANTES — SOAP único e acoplado
        </p>

        <div className="rounded-xl border border-red-300 bg-red-50 dark:border-red-800/30 dark:bg-red-950/10 p-5 flex flex-col gap-4">
          {/* Parceiros node */}
          <div className="flex items-center justify-center">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-4 py-2 text-sm font-semibold text-slate-200 text-center min-w-[120px]">
              Parceiros
              <div className="text-[10px] text-slate-400 font-mono-tech mt-0.5">ACSEL · ELITA</div>
            </div>
          </div>

          {/* Arrow down */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-4 bg-red-700/60" />
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-700/60" />
            </div>
          </div>

          {/* dbs-ws node */}
          <div className="flex items-center justify-center">
            <div className="rounded-lg border border-red-400 bg-red-100 dark:border-red-700/50 dark:bg-red-950/50 px-4 py-2.5 text-center min-w-[160px]">
              <div className="text-sm font-semibold text-red-700 dark:text-red-200">dbs-ws</div>
              <div className="text-[10px] text-red-500 dark:text-red-400 font-mono-tech mt-0.5">Apache CXF 2.7.17</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Tag variant="crit">~300 stubs</Tag>
              </div>
            </div>
          </div>

          {/* Arrow down */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-4 bg-amber-700/60" />
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-amber-700/60" />
            </div>
          </div>

          {/* Oracle — tudo acoplado */}
          <div className="flex items-center justify-center">
            <div className="rounded-lg border border-amber-400 bg-amber-100 dark:border-amber-700/40 dark:bg-amber-950/30 px-4 py-2 text-sm text-amber-800 dark:text-amber-200 text-center min-w-[200px]">
              <div className="font-semibold">Oracle 19c/21c + EJB + Struts</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-500 font-mono-tech mt-0.5">
                tudo acoplado · sem separação de camadas
              </div>
            </div>
          </div>

          {/* Warning callout */}
          <div className="mt-1 rounded-lg bg-red-100 border border-red-300 dark:bg-red-950/30 dark:border-red-900/40 px-3 py-2 text-xs text-red-700 dark:text-red-300/80">
            <span className="font-mono-tech">CVE-2022-46364</span> SSRF/RCE em produção.
            Sem separação de responsabilidades. BillingServiceBean com 4.700+ linhas.
          </div>
        </div>
      </div>

      {/* RIGHT — Novo dual endpoint */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono-tech text-muted-foreground uppercase tracking-widest mb-1">
          DEPOIS — Dual endpoint isolado
        </p>

        <div className="rounded-xl border border-blue-300 bg-blue-50 dark:border-blue-800/30 dark:bg-blue-950/10 p-5 flex flex-col gap-4">
          {/* Two ingress paths */}
          <div className="grid grid-cols-2 gap-3">
            {/* SOAP Adapter */}
            <div className="rounded-lg border border-amber-400 bg-amber-100 dark:border-amber-700/40 dark:bg-amber-950/25 px-3 py-2.5 text-center">
              <div className="text-xs font-mono-tech text-amber-600 dark:text-amber-400 mb-1">SOAP Adapter</div>
              <div className="text-[11px] text-amber-700 dark:text-amber-200/80 font-semibold">CoreWCF 1.x</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-500/70 font-mono-tech mt-0.5">.NET 10 LTS · :8081</div>
              <div className="mt-1.5 flex justify-center">
                <Tag variant="amber">Sunset +12m</Tag>
              </div>
            </div>

            {/* REST API */}
            <div className="rounded-lg border border-blue-400 bg-blue-100 dark:border-blue-600/40 dark:bg-blue-950/30 px-3 py-2.5 text-center">
              <div className="text-xs font-mono-tech text-blue-600 dark:text-blue-400 mb-1">REST API</div>
              <div className="text-[11px] text-blue-700 dark:text-blue-200/80 font-semibold">ASP.NET Core 10</div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400/70 font-mono-tech mt-0.5">JWT RS256 · :8080</div>
              <div className="mt-1.5 flex justify-center">
                <Tag variant="blue">Novos parceiros</Tag>
              </div>
            </div>
          </div>

          {/* Converging arrows */}
          <div className="flex justify-center items-center gap-8">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-3 bg-amber-600/50" />
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-amber-600/50" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-3 bg-blue-600/50" />
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-600/50" />
            </div>
          </div>

          {/* Shared Application Layer */}
          <div className="rounded-lg border border-green-400 bg-green-100 dark:border-green-700/40 dark:bg-green-950/25 px-4 py-3 text-center">
            <div className="text-sm font-semibold text-green-700 dark:text-green-200">Application Layer</div>
            <div className="text-[10px] text-green-600 dark:text-green-400/80 font-mono-tech mt-0.5">MediatR · Commands · Handlers · Validators</div>
            <div className="flex justify-center mt-2">
              <Tag variant="fix">Shared Application Layer</Tag>
            </div>
          </div>

          {/* Arrow down to Azure SQL */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-4 bg-slate-600/60" />
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-600/60" />
            </div>
          </div>

          {/* Azure SQL */}
          <div className="flex items-center justify-center">
            <div className="rounded-lg border border-slate-400 bg-slate-100 dark:border-slate-600/40 dark:bg-slate-900/50 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 text-center min-w-[160px]">
              <div className="font-semibold">Azure SQL</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-tech mt-0.5">EF Core 10 · migrations versionadas</div>
            </div>
          </div>

          {/* Success callout */}
          <div className="mt-1 rounded-lg bg-green-100 border border-green-300 dark:bg-green-950/30 dark:border-green-900/40 px-3 py-2 text-xs text-green-700 dark:text-green-300/80">
            Lógica de negócio compartilhada entre SOAP e REST. Zero duplicação.
            Domain e Application Layer agnósticos ao protocolo.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sunset strategy card ─────────────────────────────────────────────────────

function SunsetCard() {
  return (
    <div className="rounded-xl border border-amber-800/25 bg-amber-950/10 dark:bg-amber-950/10 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Icon + title */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-amber-900/40 border border-amber-700/40 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m14.95 5.66-.7-.7M6.7 6.7l-.7-.7m12.02 0-.7.7M6.7 17.3l-.7.7M12 7a5 5 0 100 10A5 5 0 0012 7z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
            Plano de Sunset SOAP
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            O SOAP Adapter será descomissionado progressivamente, preservando zero impacto no
            domínio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Timeline */}
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <div className="text-[10px] font-mono-tech text-[var(--color-azure-blue-l)] uppercase tracking-widest mb-1">
                Timeline
              </div>
              <div className="text-sm font-semibold text-foreground">{sunsetStrategy.timeline}</div>
            </div>

            {/* Mechanism */}
            <div className="rounded-lg border border-border bg-background/50 p-3 sm:col-span-1">
              <div className="text-[10px] font-mono-tech text-[var(--color-azure-blue-l)] uppercase tracking-widest mb-1">
                Mecanismo
              </div>
              <div className="text-sm text-foreground">{sunsetStrategy.mechanism}</div>
            </div>

            {/* Notification */}
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <div className="text-[10px] font-mono-tech text-[var(--color-azure-blue-l)] uppercase tracking-widest mb-1">
                Notificação
              </div>
              <div className="text-sm text-foreground">{sunsetStrategy.notification}</div>
            </div>
          </div>

          {/* Partners list */}
          <div className="mt-4">
            <div className="text-[10px] font-mono-tech text-muted-foreground uppercase tracking-widest mb-2">
              Parceiros afetados
            </div>
            <div className="flex flex-wrap gap-2">
              {sunsetStrategy.partners.map((partner) => (
                <Tag key={partner} variant="amber">
                  {partner}
                </Tag>
              ))}
            </div>
          </div>

          {/* Note */}
          <p className="mt-4 text-xs text-muted-foreground/70 italic border-t border-border pt-3">
            {sunsetStrategy.note}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Section component ────────────────────────────────────────────────────────

export function EndpointStrategy() {
  return (
    <section id="endpoints" className="relative">
      <div className="section-container">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <SectionLabel>Estratégia de Endpoints</SectionLabel>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
          <span className="text-[var(--color-amber-warn-l)]">SOAP</span>{" "}
          <span className="text-muted-foreground font-normal">para compatibilidade</span>
          <span className="mx-3 text-muted-foreground/40">·</span>
          <span className="text-[var(--color-azure-blue-l)]">REST</span>{" "}
          <span className="text-muted-foreground font-normal">para evolução</span>
        </h2>

        <p className="text-muted-foreground text-base mb-10 max-w-2xl">
          Dual endpoint strategy: um único Application Layer (MediatR) serve tanto o SOAP Adapter
          de compatibilidade quanto a REST API moderna, sem duplicação de lógica de negócio.
        </p>

        {/* ── Architecture diagram ─────────────────────────────────────────── */}
        <div className="mb-12">
          <ArchDiagram />
        </div>

        {/* ── Tech detail cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {/* SOAP Adapter detail */}
          <div className="rounded-xl border border-amber-800/25 bg-amber-950/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-mono-tech text-amber-400 uppercase tracking-widest">
                {dualEndpointStrategy.soapAdapter.container}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">SOAP Adapter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {dualEndpointStrategy.soapAdapter.purpose}
            </p>
            <dl className="space-y-1.5">
              {(
                [
                  ["Tecnologia", dualEndpointStrategy.soapAdapter.technology],
                  ["Exposição", dualEndpointStrategy.soapAdapter.exposure],
                  ["Autenticação", dualEndpointStrategy.soapAdapter.authentication],
                ] as [string, string][]
              ).map(([key, value]) => (
                <div key={key} className="flex gap-2 text-xs">
                  <dt className="font-mono-tech text-muted-foreground/60 w-24 shrink-0">{key}</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* REST API detail */}
          <div className="rounded-xl border border-blue-800/25 bg-blue-950/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs font-mono-tech text-blue-400 uppercase tracking-widest">
                {dualEndpointStrategy.restApi.container}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">REST API</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {dualEndpointStrategy.restApi.purpose}
            </p>
            <dl className="space-y-1.5">
              {(
                [
                  ["Tecnologia", dualEndpointStrategy.restApi.technology],
                  ["Exposição", dualEndpointStrategy.restApi.exposure],
                  ["Autenticação", dualEndpointStrategy.restApi.authentication],
                ] as [string, string][]
              ).map(([key, value]) => (
                <div key={key} className="flex gap-2 text-xs">
                  <dt className="font-mono-tech text-muted-foreground/60 w-24 shrink-0">{key}</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── Mappings table ────────────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Mapeamento SOAP → REST
            </h3>
            <Tag variant="neutral">{soapToRestMappings.length} operações</Tag>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-mono-tech text-muted-foreground uppercase tracking-wider pl-4">
                    Operação SOAP
                  </TableHead>
                  <TableHead className="text-xs font-mono-tech text-muted-foreground uppercase tracking-wider">
                    Método REST
                  </TableHead>
                  <TableHead className="text-xs font-mono-tech text-muted-foreground uppercase tracking-wider">
                    Path REST
                  </TableHead>
                  <TableHead className="text-xs font-mono-tech text-muted-foreground uppercase tracking-wider pr-4 whitespace-normal">
                    Descrição
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soapToRestMappings.map((mapping, index) => (
                  <TableRow
                    key={mapping.soapOperation}
                    className={`border-border transition-colors ${
                      index % 2 === 0
                        ? "bg-transparent"
                        : "bg-muted/20"
                    } hover:bg-muted/40`}
                  >
                    {/* SOAP operation */}
                    <TableCell className="pl-4">
                      <span className="font-mono-tech text-[13px] text-foreground">
                        {mapping.soapOperation}
                      </span>
                    </TableCell>

                    {/* HTTP method */}
                    <TableCell>
                      <MethodBadge method={mapping.restMethod} />
                    </TableCell>

                    {/* REST path */}
                    <TableCell>
                      <code className="font-mono-tech text-[12px] text-blue-700 dark:text-[var(--color-azure-blue-l)] bg-blue-100 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">
                        {mapping.restPath}
                      </code>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="pr-4 max-w-xs">
                      <span className="text-sm text-muted-foreground whitespace-normal leading-snug">
                        {mapping.description}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Sunset strategy card ──────────────────────────────────────────── */}
        <SunsetCard />
      </div>
    </section>
  );
}
