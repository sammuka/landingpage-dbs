"use client";

import Image from "next/image";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { motion, type Variants } from "framer-motion";

// ─── Legacy JSP mock fiel ao fonte real ──────────────────────────────────────
// Baseado em: dbsportal/WebContent/pesquisa/*.jsp
// Stack: Struts 1.3 · DisplayTag · jQuery UI 1.9 · HTML 4.01 Transitional
// Padrão de layout: .barras.norte / .barras.centro / .BoxModal / .tabelaReadWrite
// Botões: <a href="javascript:..."> com sprite icons Icone22x22
// Grid de resultados: <display:table> (DisplayTag) com decorator

function LegacyUI() {
  return (
    <div
      style={{
        background: "#f0f0f0",
        fontFamily: "Tahoma, Verdana, 'Arial', sans-serif",
        fontSize: "12px",
        color: "#333",
        minHeight: "380px",
      }}
    >
      {/* Barra norte — topo da tela */}
      <div style={{
        background: "linear-gradient(to bottom, #4a7ab5 0%, #2e5a8e 100%)",
        padding: "0",
        borderBottom: "2px solid #1a3a6e",
      }}>
        {/* Header institucional */}
        <table style={{ width: "100%", padding: "4px 8px" }}>
          <tbody>
            <tr>
              <td style={{ color: "#fff", fontWeight: "bold", fontSize: "14px", letterSpacing: "0.5px" }}>
                <span style={{ color: "#ffd700" }}>DBS</span>{" "}
                <span style={{ color: "#cce0ff" }}>— Delphos Billing System</span>
              </td>
              <td style={{ textAlign: "right", color: "#cce0ff", fontSize: "11px" }}>
                Usuário: admin | <a href="#" style={{ color: "#ffd700" }}>Sair</a>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Barra de menu horizontal */}
        <div style={{
          background: "#1e3a6e",
          padding: "3px 8px",
          display: "flex",
          gap: "2px",
        }}>
          {["Pagamentos", "Cobrança", "Conciliação", "Configuração", "Relatórios"].map((item, i) => (
            <span key={item} style={{
              padding: "2px 10px",
              cursor: "pointer",
              background: i === 0 ? "#2e5a8e" : "transparent",
              color: i === 0 ? "#fff" : "#a8c4e8",
              borderRadius: "2px 2px 0 0",
              fontSize: "11px",
              fontWeight: i === 0 ? "bold" : "normal",
            }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ background: "#e0e8f0", padding: "3px 8px", fontSize: "11px", color: "#336699", borderBottom: "1px solid #c0cfe0" }}>
        Pagamentos &rsaquo; Pesquisa de Transações
      </div>

      {/* BoxModal — Pesquisa */}
      <div style={{ padding: "8px", margin: "6px 8px", background: "#fff", border: "1px solid #c0c0c0", boxShadow: "1px 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ background: "#336699", color: "#fff", margin: "-8px -8px 6px -8px", padding: "5px 8px", fontSize: "12px", fontWeight: "bold" }}>
          Pesquisa de Transações de Pagamento
        </h2>

        {/* EOL warning */}
        <div style={{ background: "#fff3cd", border: "1px solid #ffc107", padding: "3px 8px", marginBottom: "6px", fontSize: "11px", color: "#856404" }}>
          ⚠ Struts 1.3 (EOL 2013) · Apache CXF 2.7.17 (EOL 2017) · Java 8u271
        </div>

        {/* Formulário de pesquisa — tabelaReadWrite */}
        <form>
          <table className="tabelaReadWrite" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <tbody>
              <tr>
                <td style={{ background: "#dce6f0", border: "1px solid #b0c4d8", padding: "4px 8px", width: "15%", fontWeight: "bold", color: "#1a3a6e" }}>
                  Nº Pedido:
                </td>
                <td style={{ border: "1px solid #c0c0c0", padding: "3px 6px", background: "#fff" }}>
                  <input type="text" style={{ border: "1px inset #aaa", background: "#fff", width: "120px", padding: "1px 3px", fontSize: "12px" }} />
                </td>
                <td style={{ background: "#dce6f0", border: "1px solid #b0c4d8", padding: "4px 8px", fontWeight: "bold", color: "#1a3a6e", width: "12%" }}>
                  Status:
                </td>
                <td style={{ border: "1px solid #c0c0c0", padding: "3px 6px", background: "#fff" }}>
                  <select style={{ border: "1px solid #aaa", fontSize: "12px", padding: "1px 2px" }}>
                    <option>-- Todos --</option>
                    <option>Autorizado</option>
                    <option>Capturado</option>
                    <option>Recusado</option>
                    <option>Pendente</option>
                  </select>
                </td>
                <td style={{ border: "1px solid #c0c0c0", padding: "3px 8px", background: "#fff" }}>
                  <input type="submit" value="Pesquisar" style={{
                    background: "linear-gradient(to bottom, #f8f8f8, #d8d8d8)",
                    border: "2px solid",
                    borderColor: "#fff #999 #999 #fff",
                    padding: "2px 10px",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "Tahoma, sans-serif",
                  }} />
                </td>
              </tr>
              <tr>
                <td style={{ background: "#dce6f0", border: "1px solid #b0c4d8", padding: "4px 8px", fontWeight: "bold", color: "#1a3a6e" }}>
                  Período De:
                </td>
                <td style={{ border: "1px solid #c0c0c0", padding: "3px 6px", background: "#fff" }}>
                  <input type="text" defaultValue="01/04/2026" style={{ border: "1px inset #aaa", width: "80px", padding: "1px 3px", fontSize: "12px" }} />
                  {/* Simula o ícone do calendário jQuery UI */}
                  <span style={{ cursor: "pointer", marginLeft: "2px", fontSize: "13px" }} title="Selecionar data">📅</span>
                </td>
                <td style={{ background: "#dce6f0", border: "1px solid #b0c4d8", padding: "4px 8px", fontWeight: "bold", color: "#1a3a6e" }}>
                  Até:
                </td>
                <td style={{ border: "1px solid #c0c0c0", padding: "3px 6px", background: "#fff" }}>
                  <input type="text" defaultValue="07/04/2026" style={{ border: "1px inset #aaa", width: "80px", padding: "1px 3px", fontSize: "12px" }} />
                  <span style={{ cursor: "pointer", marginLeft: "2px", fontSize: "13px" }}>📅</span>
                </td>
                <td style={{ border: "1px solid #c0c0c0", background: "#fff" }} />
              </tr>
            </tbody>
          </table>

          {/* Barra de botões — padrão dbsportal */}
          <div style={{ background: "#e8e8e8", border: "1px solid #c0c0c0", borderTop: "none", padding: "4px 8px", display: "flex", justifyContent: "flex-end", gap: "12px", fontSize: "11px" }}>
            <a href="#" style={{ color: "#336699", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ fontSize: "14px" }}>🗑</span> Limpar
            </a>
            <a href="#" style={{ color: "#336699", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ fontSize: "14px" }}>🔍</span> Pesquisar
            </a>
          </div>
        </form>
      </div>

      {/* DisplayTag — tabela de resultados */}
      <div style={{ margin: "0 8px 8px 8px", border: "1px solid #c0c0c0", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#336699", color: "#fff" }}>
              {["Nº Pedido", "Valor", "Cartão", "Status", "Data", "Ação"].map(h => (
                <th key={h} style={{ padding: "4px 8px", textAlign: "left", fontWeight: "bold", fontSize: "11px", borderRight: "1px solid #2a5588" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { pedido: "PED-00841", valor: "R$ 350,00", cartao: "****1234", status: "Autorizado", data: "07/04/2026", statusColor: "#0066cc" },
              { pedido: "PED-00840", valor: "R$ 120,00", cartao: "****5678", status: "Pendente",   data: "07/04/2026", statusColor: "#cc6600" },
              { pedido: "PED-00839", valor: "R$ 980,00", cartao: "****9012", status: "Recusado",   data: "06/04/2026", statusColor: "#cc0000" },
              { pedido: "PED-00838", valor: "R$  45,00", cartao: "****3456", status: "Autorizado", data: "06/04/2026", statusColor: "#0066cc" },
            ].map((row, i) => (
              <tr key={row.pedido} style={{ background: i % 2 === 0 ? "#e8f0f8" : "#ffffff" }}>
                <td style={{ padding: "3px 8px", borderBottom: "1px solid #d0d0d0", color: "#336699", textDecoration: "underline", cursor: "pointer" }}>{row.pedido}</td>
                <td style={{ padding: "3px 8px", borderBottom: "1px solid #d0d0d0" }}>{row.valor}</td>
                <td style={{ padding: "3px 8px", borderBottom: "1px solid #d0d0d0", fontFamily: "monospace" }}>{row.cartao}</td>
                <td style={{ padding: "3px 8px", borderBottom: "1px solid #d0d0d0", color: row.statusColor, fontWeight: "bold" }}>{row.status}</td>
                <td style={{ padding: "3px 8px", borderBottom: "1px solid #d0d0d0" }}>{row.data}</td>
                <td style={{ padding: "3px 8px", borderBottom: "1px solid #d0d0d0", textAlign: "center" }}>
                  <a href="#" style={{ color: "#336699", fontSize: "11px" }}>Detalhar</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Paginação DisplayTag */}
        <div style={{ padding: "4px 8px", fontSize: "11px", color: "#555", borderTop: "1px solid #d0d0d0", background: "#f8f8f8" }}>
          Exibindo registros 1 a 4 de 127.{" "}
          <a href="#" style={{ color: "#336699" }}>Anterior</a> |{" "}
          <a href="#" style={{ color: "#336699", fontWeight: "bold" }}>1</a> |{" "}
          <a href="#" style={{ color: "#336699" }}>2</a> |{" "}
          <a href="#" style={{ color: "#336699" }}>3</a> |{" "}
          <a href="#" style={{ color: "#336699" }}>Próximo</a>
        </div>
      </div>

      {/* Rodapé */}
      <div style={{ background: "#2e5a8e", color: "#a8c4e8", fontSize: "10px", padding: "3px 8px", textAlign: "center" }}>
        Delphos Billing System © 2019 · Versão 3.4.2 · Ambiente: Produção
      </div>
    </div>
  );
}

// ─── Variantes de animação ────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

// ─── Melhorias destacadas ─────────────────────────────────────────────────────
const improvements = [
  { before: "4–6s carregamento (JSP server-side)", after: "< 0.8s (Next.js SSR + RSC)" },
  { before: "jQuery Dialog blocking", after: "Drawer shadcn/ui (não-blocking)" },
  { before: "Form submit + page reload", after: "Client-side filtering em tempo real" },
];

export function UIComparison() {
  return (
    <section id="ui-comparison" className="section-container">
      <SectionLabel>Interface do Usuário</SectionLabel>
      <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
        dbsportal <span className="text-muted-foreground">(Struts 1.3)</span>{" "}
        <span className="text-[var(--color-azure-blue-l)]">→</span>{" "}
        Portal Next.js 16.1.6
      </h2>
      <p className="text-muted-foreground text-sm mb-10 max-w-2xl">
        Mock fiel ao fonte real — padrão <code className="font-mono-tech text-xs bg-muted px-1 py-0.5 rounded">tabelaReadWrite</code>,{" "}
        <code className="font-mono-tech text-xs bg-muted px-1 py-0.5 rounded">display:table</code>{" "}
        (DisplayTag), jQuery UI datepicker, botões sprite Icone22x22. Screenshot do portal atual (e2e).
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* ANTES — JSP Struts */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-2">
            <span className="tag-crit text-[11px]">⚠ ANTES</span>
            <span className="text-xs text-muted-foreground font-mono-tech">dbsportal · Struts 1.3 · Java 8 · JBoss EAP 7.4</span>
          </div>
          <BrowserFrame
            title="dbsportal - Pesquisa de Transações"
            url="http://10.0.1.5:8080/dbsportal/pagamentos/pesquisarTransacao.do"
            variant="legacy"
          >
            <LegacyUI />
          </BrowserFrame>
        </motion.div>

        {/* DEPOIS — Screenshot real do e2e */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-2">
            <span className="tag-fix text-[11px]">✓ DEPOIS</span>
            <span className="text-xs text-muted-foreground font-mono-tech">Next.js 16.1.6 · shadcn/ui · Azure Container Apps</span>
          </div>
          <BrowserFrame
            title="Portal DBS — Pagamentos"
            url="https://portal.dbs.assurant.com.br/payments"
            variant="modern"
          >
            <div className="relative w-full bg-[#0d1526]" style={{ minHeight: 380 }}>
              <Image
                src="/screenshot-portal-pagamentos.png"
                alt="Portal DBS - Lista de Pagamentos"
                width={800}
                height={500}
                className="w-full h-auto object-cover object-top"
                unoptimized
              />
            </div>
          </BrowserFrame>
        </motion.div>
      </motion.div>

      {/* Melhorias */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {improvements.map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="rounded-lg border border-border bg-card p-4"
          >
            <p className="text-xs font-mono-tech text-red-500 dark:text-red-400 line-through mb-1">{item.before}</p>
            <p className="text-sm font-medium text-[var(--color-green-ok-l)]">{item.after}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
