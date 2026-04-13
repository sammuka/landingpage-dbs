"use client";

import {
  integrationRows,
  soapExampleRequest,
  restExampleRequest,
} from "@/lib/data/comparisons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Inline syntax highlight for the SOAP XML snippet.
 * Returns an array of JSX spans so we avoid dangerouslySetInnerHTML.
 */
function SoapCodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <pre className="code-block overflow-x-auto text-[12px] leading-[1.65]">
      {lines.map((line, i) => {
        // Very lightweight token colouring — tag names, attributes, text nodes.
        const rendered = tokeniseSoapLine(line);
        return (
          <span key={i} className="block">
            {rendered}
          </span>
        );
      })}
    </pre>
  );
}

function tokeniseSoapLine(line: string): React.ReactNode[] {
  // Patterns (order matters)
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // Match XML tags with optional namespace prefix
  const tagPattern =
    /(<\/?)([a-zA-Z][\w:-]*)([^>]*)(\/?>)|(\s[\w:-]+=)"([^"]*)"|(>[^<]+<)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(line)) !== null) {
    // Push plain text before this match
    if (match.index > last) {
      tokens.push(
        <span key={key++} className="text-slate-300 dark:text-slate-300">
          {line.slice(last, match.index)}
        </span>
      );
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      // Opening/closing tag
      tokens.push(
        <span key={key++}>
          <span className="text-blue-400">{match[1]}</span>
          <span className="text-cyan-300">{match[2]}</span>
          {match[3] && (
            <span className="text-slate-400">{match[3]}</span>
          )}
          <span className="text-blue-400">{match[4]}</span>
        </span>
      );
    } else if (match[5] !== undefined) {
      // Attribute
      tokens.push(
        <span key={key++}>
          <span className="text-yellow-300">{match[5]}</span>
          <span className="text-green-300">&quot;{match[6]}&quot;</span>
        </span>
      );
    } else if (match[7] !== undefined) {
      // Text node between tags
      tokens.push(
        <span key={key++} className="text-slate-200">
          {match[7]}
        </span>
      );
    }

    last = match.index + match[0].length;
  }

  // Remainder
  if (last < line.length) {
    tokens.push(
      <span key={key++} className="text-slate-300">
        {line.slice(last)}
      </span>
    );
  }

  return tokens.length > 0 ? tokens : [<span key={0} className="text-slate-300">{remaining}</span>];
}

function RestCodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <pre className="code-block overflow-x-auto text-[12px] leading-[1.65]">
      {lines.map((line, i) => (
        <span key={i} className="block">
          {tokeniseRestLine(line, i)}
        </span>
      ))}
    </pre>
  );
}

function tokeniseRestLine(line: string, lineIndex: number): React.ReactNode {
  // First line — HTTP verb + path
  if (lineIndex === 0) {
    const m = line.match(/^(POST|GET|PUT|PATCH|DELETE)\s(.+)(\s+HTTP\/[\d.]+)$/);
    if (m) {
      return (
        <>
          <span className="font-bold text-emerald-400">{m[1]}</span>
          <span className="text-slate-200"> {m[2]}</span>
          <span className="text-slate-400">{m[3]}</span>
        </>
      );
    }
  }

  // Header lines (before the blank line)
  const headerMatch = line.match(/^([\w-]+):\s(.+)$/);
  if (headerMatch) {
    return (
      <>
        <span className="text-sky-400">{headerMatch[1]}</span>
        <span className="text-slate-400">: </span>
        <span className="text-amber-300">{headerMatch[2]}</span>
      </>
    );
  }

  // JSON keys
  const jsonKeyMatch = line.match(/^(\s*)"([\w]+)":\s(.*)$/);
  if (jsonKeyMatch) {
    const valueRaw = jsonKeyMatch[3];
    // String value
    const strVal = valueRaw.match(/^"([^"]*)"(,?)$/);
    if (strVal) {
      return (
        <>
          <span className="text-slate-400">{jsonKeyMatch[1]}</span>
          <span className="text-sky-300">&quot;{jsonKeyMatch[2]}&quot;</span>
          <span className="text-slate-400">: </span>
          <span className="text-green-300">&quot;{strVal[1]}&quot;</span>
          <span className="text-slate-400">{strVal[2]}</span>
        </>
      );
    }
    // Numeric / boolean / opening brace
    return (
      <>
        <span className="text-slate-400">{jsonKeyMatch[1]}</span>
        <span className="text-sky-300">&quot;{jsonKeyMatch[2]}&quot;</span>
        <span className="text-slate-400">: </span>
        <span className="text-orange-300">{valueRaw}</span>
      </>
    );
  }

  return <span className="text-slate-300">{line}</span>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IntegrationModel() {
  return (
    <section id="integration">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>Modelo de Integração</SectionLabel>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            De SOAP/XML/WS-Security para REST/JSON/JWT
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            O contrato de integração foi reescrito do zero — substituindo ~300 stubs WSDL
            por uma API REST documentada via OpenAPI 3.1.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mb-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm dark:border-white/[0.07] dark:bg-[#0d1526]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 dark:bg-white/[0.03]">
                <TableHead className="w-[22%] py-3 pl-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Aspecto
                </TableHead>
                <TableHead className="w-[39%] py-3 text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
                  Legado (SOAP)
                </TableHead>
                <TableHead className="w-[39%] py-3 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-[var(--color-green-ok-l)]">
                  Novo (REST)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrationRows.map((row, idx) => (
                <TableRow
                  key={row.aspect}
                  className={
                    idx % 2 === 0
                      ? "bg-transparent"
                      : "bg-muted/30 dark:bg-white/[0.02]"
                  }
                >
                  <TableCell className="py-3 pl-5 text-sm font-medium text-foreground">
                    {row.aspect}
                  </TableCell>
                  <TableCell className="py-3 text-sm">
                    <span className="inline-block rounded bg-red-50 px-2 py-0.5 font-mono-tech text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400">
                      {row.legacy}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-sm">
                    <span className="inline-block rounded bg-green-50 px-2 py-0.5 font-mono-tech text-xs text-green-700 dark:bg-green-950/40 dark:text-[var(--color-green-ok-l)]">
                      {row.modern}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Code comparison */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SOAP panel */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-amber-800/40 bg-[#1a1200] shadow-md dark:border-amber-800/30 dark:bg-[#100d00]">
            {/* Panel header */}
            <div className="flex items-center gap-3 border-b border-amber-800/30 bg-amber-950/60 px-4 py-2.5 dark:bg-amber-950/40">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-red-500/80" />
                <span className="size-3 rounded-full bg-amber-500/80" />
                <span className="size-3 rounded-full bg-green-600/60" />
              </div>
              <span className="font-mono-tech text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                Antes — SOAP Request
              </span>
              <span className="ml-auto rounded bg-amber-900/60 px-2 py-0.5 font-mono-tech text-[10px] font-medium text-amber-300 ring-1 ring-amber-700/40">
                SOAP 1.1
              </span>
            </div>
            {/* Code */}
            <div className="flex-1 p-4">
              <SoapCodeBlock code={soapExampleRequest} />
            </div>
          </div>

          {/* REST panel */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-blue-700/40 bg-[#00091a] shadow-md dark:border-blue-700/30 dark:bg-[#00091a]">
            {/* Panel header */}
            <div className="flex items-center gap-3 border-b border-blue-700/30 bg-blue-950/60 px-4 py-2.5 dark:bg-blue-950/40">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-red-500/80" />
                <span className="size-3 rounded-full bg-amber-500/80" />
                <span className="size-3 rounded-full bg-green-600/60" />
              </div>
              <span className="font-mono-tech text-[11px] font-semibold uppercase tracking-widest text-blue-400">
                Depois — REST Request
              </span>
              <span className="ml-auto rounded bg-blue-900/60 px-2 py-0.5 font-mono-tech text-[10px] font-medium text-blue-300 ring-1 ring-blue-700/40">
                REST / JSON
              </span>
            </div>
            {/* Code */}
            <div className="flex-1 p-4">
              <RestCodeBlock code={restExampleRequest} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
