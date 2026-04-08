# Design Spec — Landing Page DBS Transformation

**Data:** 2026-04-08  
**Projeto:** `dbs-landing/` — Next.js standalone, deploy Vercel  
**Audiência:** Arquitetos de solução, engenheiros sênior, executivos técnicos da Assurant  
**Responsável pela implementação:** Sistran / Lumina AI  

---

## 1. Contexto e Objetivo

Landing page profissional que apresenta a transformação tecnológica completa do DBS (Delphos Billing System) da Assurant Brasil. A página substitui uma apresentação técnica para stakeholders de engenharia — deve ter densidade informacional equivalente a uma apresentação de arquitetura, não a um site de marketing.

A narrativa central é: **dois caminhos analisados, uma decisão implementada** — de um monolito Java EE / JBoss com 42 dívidas técnicas e 9 CVEs críticos para uma arquitetura cloud-native .NET 9 / Azure Container Apps com 191 testes e zero vulnerabilidades críticas.

---

## 2. Direção Estética — Dark Cinematic

### Tema padrão: Dark
- Background: `#060c18` (quase-preto, tom frio)
- Ambient glows: `radial-gradient(rgba(0,120,212,0.18))` top-right + `radial-gradient(rgba(16,124,16,0.12))` bottom-left
- Tipografia título: Georgia, serif — autoridade técnica com apelo editorial
- Tipografia dados/labels: `'Courier New', monospace` — credibilidade técnica
- Tipografia corpo: `'Geist', 'Segoe UI', system-ui` — legibilidade moderna

### Tema Light (via toggle + `prefers-color-scheme`)
- Background: `linear-gradient(135deg, #f0f6ff 0%, #f8fafc 40%, #f0fdf4 100%)`
- Mesmos ambient glows, opacidade reduzida (8–12%)
- Linha gradiente azul→verde no topo do nav
- Todos os tokens de cor têm variante `dark:` via Tailwind v4

### Paleta de tokens CSS
```
--azure-blue:   #0078d4   (primário, ações, links)
--azure-blue-l: #60a5fa   (dark mode, textos sobre escuro)
--green-ok:     #107c10   (sucesso, "implementado")
--green-ok-l:   #4ade80   (dark mode)
--amber-warn:   #d97706   (legado, atenção)
--amber-warn-l: #fcd34d   (dark mode)
--red-crit:     #dc2626   (vulnerabilidades críticas)
--slate-900:    #0f172a   (texto principal light)
--slate-400:    #94a3b8   (texto secundário)
```

### Tipografia — fontes a carregar via `next/font`
- Display/títulos: **Playfair Display** (Google Fonts) — serifada editorial, substitui Georgia
- Código/labels: **JetBrains Mono** — monospace técnica com ligaduras
- Corpo: **Geist Sans** (pacote `geist`, `npm install geist`) — clean, legível, moderna

### Escala de fonte (mínimos)
- `text-xs`: 11px (labels e badges)
- `text-sm`: 13px (body secundário)
- `text-base`: 15px (body principal)
- `text-lg`: 18px (subtítulos de seção)
- `text-2xl+`: títulos de seção

---

## 3. Estrutura do Projeto

```
dbs-landing/
├── app/
│   ├── layout.tsx          — font loading, ThemeProvider, metadata
│   ├── page.tsx            — composição de todas as seções
│   └── globals.css         — CSS variables, Tailwind base
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── JourneyTimeline.tsx
│   │   ├── ArchitectureMaps.tsx    — contém BEFORE + AFTER + toggle
│   │   ├── EndpointStrategy.tsx
│   │   ├── UIComparison.tsx
│   │   ├── StackComparison.tsx
│   │   ├── SecurityVulnerabilities.tsx
│   │   ├── IntegrationModel.tsx
│   │   ├── MetricsAnimated.tsx
│   │   ├── DevOpsPipeline.tsx
│   │   ├── ADRCards.tsx
│   │   └── Footer.tsx
│   ├── architecture/
│   │   ├── LegacyMap.tsx           — diagrama AS-IS (React Flow, ssr:false)
│   │   ├── CloudMap.tsx            — diagrama TO-BE (React Flow, ssr:false)
│   │   ├── ArchNode.tsx            — nó interativo com tooltip/drawer
│   │   └── MapToggle.tsx           — botão ANTES/DEPOIS
│   ├── ui/
│   │   ├── ThemeToggle.tsx
│   │   ├── AzureIcon.tsx           — wrapper para SVGs do benc-uk/icon-collection
│   │   ├── AnimatedCounter.tsx     — Framer Motion counter
│   │   ├── SectionLabel.tsx        — eyebrow em Courier
│   │   ├── Tag.tsx                 — tag-crit / tag-fix / tag-neutral
│   │   ├── BrowserFrame.tsx        — frame simulando navegador (seção UI)
│   │   └── Navbar.tsx
│   └── charts/
│       └── TechDebtChart.tsx       — (opcional) treemap de dívidas técnicas
├── lib/
│   └── data/
│       ├── legacy.ts               — módulos, vulnerabilidades, métricas AS-IS
│       ├── cloud.ts                — containers, ADRs, serviços Azure, métricas TO-BE
│       ├── endpoints.ts            — mapeamento SOAP→REST, sunset strategy
│       ├── devops.ts               — estágios do pipeline, branches, Bicep files
│       ├── timeline.ts             — fases da jornada
│       ├── comparisons.ts          — tabelas stack, segurança, integração
│       └── companies.ts            — Sistran + Lumina logos e dados
├── public/
│   ├── icons/azure/                — SVGs de benc-uk/icon-collection
│   ├── logo-sistran.png
│   ├── logo-lumina-azul.png
│   └── logo-lumina-branca.png
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Seções — Conteúdo e Implementação

### 4.1 Navbar
- Logo Sistran (branca em dark, colorida em light) + Logo Lumina
- Links de âncora para cada seção
- Toggle dark/light (Lucide `Sun`/`Moon`)
- Fundo: `backdrop-blur-md` com opacidade, sticky
- **Biblioteca:** shadcn/ui `NavigationMenu`

### 4.2 Hero
- Eyebrow monospace: "Transformação Tecnológica · 2024–2026"
- Título Georgia/Playfair: "De um monolito com *42 dívidas técnicas* para arquitetura cloud-native"
  - "42 dívidas técnicas" com `line-through` em vermelho
- Subtítulo: contexto DBS, Assurant Brasil
- Grid de 4 métricas animadas (Framer Motion counter ao entrar no viewport):
  - `1.073 → ~400` classes · `0 → 191` testes · `9 → 0` CVEs · `4` containers
- CTA: "Ver Arquitetura" (âncora) + "GitHub →" (link externo)
- Background: ambient glows + noise texture sutil via SVG filter
- **Biblioteca:** Framer Motion para entrada staggered dos elementos

### 4.3 Jornada — Timeline
- 5 fases com trilha colorida horizontal (desktop) / vertical (mobile)
- Cores: vermelho (diagnóstico) → âmbar (análise) → azul (ADRs) → verde (implementação) → azul claro (resultado)
- Cada fase: número, título, 4 linhas de detalhe
- **Biblioteca:** CSS puro + Framer Motion `whileInView`

### 4.4 Mapas Arquiteturais — ANTES e DEPOIS
**O elemento de maior peso visual da página.**

#### Toggle / Scroll comparativo
- Tab switcher "ANTES / DEPOIS" com transição suave (Framer Motion `AnimatePresence`)
- Em desktop ≥1280px: split view lado a lado com scroll sincronizado
- Em tablet/mobile: tabs empilhados

#### Mapa ANTES (AS-IS)
- Implementado com **React Flow** (`dynamic()` com `ssr: false`)
- Fundo âmbar escuro `#0e0b04`, bordas douradas
- Nós: 7 módulos Eclipse (dbs-lib, dbs, dbsdb, dbs-ws, dbsportal, dbspag, dbstimer)
- Nós externos: Oracle 19c, 4 serviços SOAP Braspag, SCA, ACSEL/ELITA
- Edges: linhas vermelhas/âmbar, espessura proporcional ao acoplamento
- Hover/click: Drawer lateral (shadcn/ui `Sheet`) com detalhes do nó:
  - Tecnologia, função, problemas, dívidas técnicas associadas
- Visual transmite **densidade e acoplamento** — edges cruzando, muitas dependências

#### Mapa DEPOIS (TO-BE Cloud)
- Mesma lib React Flow, tema azul/escuro
- Nós com ícones SVG oficiais Azure (benc-uk/icon-collection):
  - Container Apps Environment (wrapper dashed)
  - Payment API, Admin API, Portal Next.js, SOAP Adapter
  - Key Vault, Azure SQL, ACR, App Insights, Monitor, Managed Identity, Storage
- Nós externos: Okta, Braspag REST, ACSEL/ELITA, parceiros
- Hover/click: Drawer com: tecnologia, porta, réplicas min/max, dependências, secrets consumidos
- Visual transmite **organização e separação de responsabilidades**
- **Biblioteca:** React Flow (nós e edges customizados), shadcn/ui Sheet para detalhes

### 4.5 Estratégia de Endpoints — SOAP + REST
- Seção dedicada ao dual-endpoint (conforme solicitado)
- Diagrama visual comparativo: ANTES (SOAP único, acoplado) vs DEPOIS (SOAP Adapter isolado + REST API)
- Destaque ao SOAP Adapter como container separado em CoreWCF
- Nota de sunset planejado com feature flag
- Tabela: 7 operações SOAP → endpoints REST equivalentes
- **Biblioteca:** componentes customizados com Tailwind

### 4.6 Telas Recriadas — UI ANTES vs DEPOIS
- Frame de browser simulado (`BrowserFrame.tsx`)
- **ANTES — dbsportal (Struts 1.3):**
  - Fundo cinza `#f0f0f0`, fonte Times New Roman ou Georgia
  - Tabela DisplayTag com paginação form-submit
  - Dropdowns `<select>` em cascata
  - Botões `input[type=submit]` com borda raised
  - jQuery Dialog para confirmação
  - Paleta anos 2000: azul `#336699`, cinza `#cccccc`
- **DEPOIS — Portal Next.js:**
  - DataTable shadcn/ui com sort/filter
  - Combobox com busca
  - Badge de status colorido (verde/âmbar/vermelho)
  - Drawer lateral com detalhes
  - Tema dark/light
- Lado a lado em `split` com label "Antes / Depois"
- **Biblioteca:** shadcn/ui para a versão nova; CSS inline para simular o legado fielmente

### 4.7 Tabelas de Comparação

#### Stack Tecnológico Completo (20+ linhas)
Tabela responsiva 3 colunas: Categoria | Legado | Novo  
Linhas: Linguagem, Runtime, App Server, Framework Web, ORM, Banco, Auth, Gateway Payment, Jobs, Logging, Resiliência, Build, CI/CD, Deploy, Containers, IaC, Secrets, Frontend, Testes, Cobertura

#### 9 Vulnerabilidades Críticas Eliminadas
Cada linha: ícone ⚠ vermelho | Vulnerabilidade | → | ícone ✓ verde | Solução implementada  
Exemplos:
- AES-CBC IV=zeros → AES-GCM IV aleatório via Key Vault
- JWT HS256 hardcoded → JWT RS256 gerenciado pelo Okta
- MD5 sem salt → BCrypt cost 12

#### Modelo de Integração
Tabela: SOAP/WS-Security XML envelope vs REST/JWT JSON Bearer  
Com exemplo de request side-by-side (XML vs JSON)

**Biblioteca:** shadcn/ui `Table` com Tailwind customizado

### 4.8 Métricas Animadas
Counters com Framer Motion `useInView` + spring animation:
- `1.073` classes Java → `~400` classes C#
- `0` testes → `191` testes (100% passando)
- `42` dívidas técnicas → `0` críticas abertas
- `9` CVEs críticos → `0`
- `~300` stubs SOAP → `~20` DTOs (records)
- `4` containers Azure
- `21` ADRs documentados
- `5` camadas Clean Architecture
- `20` sprints · `114` dias úteis

Grid responsivo: 3 colunas mobile, 5 colunas desktop  
**Biblioteca:** Framer Motion

### 4.9 Esteira DevOps + IaC
- 12 arquivos Bicep listados
- Pipeline de 7 estágios (horizontal desktop, vertical mobile) com ícones oficiais
- Branch strategy: 3 cards (feature/*, develop→staging, main→prod)
- **Biblioteca:** ícones benc-uk/icon-collection como `<img>` ou inline SVG

### 4.10 ADRs — 8 Decisões Chave
Cards selecionados (os mais impactantes):
1. ADR-001 — Stack: .NET 9 + Next.js 16
2. ADR-002 — Clean Architecture (5 camadas)
3. ADR-003 — Cielo REST (não SOAP outbound)
4. ADR-004 — Tokenização obrigatória (PCI DSS)
5. ADR-009 — Okta OAuth2/OIDC + JWT RS256
6. ADR-015 — Azure Container Apps (não AKS)
7. ADR-020 — Managed Identity + Key Vault (zero secrets hardcoded)
8. ADR-018 — SOAP Adapter como microsserviço isolado

Cada card: ícone Lucide, título, contexto (problema), decisão, consequência  
Layout: grid 2 colunas desktop, 1 coluna mobile  
**Biblioteca:** Framer Motion `whileInView` stagger, shadcn/ui Card

### 4.11 Footer
- Logos Sistran + Lumina
- Links: GitHub, documentação, ADRs
- Disclaimer: "Dados extraídos da documentação técnica do projeto DBS"

---

## 5. Escolha de Bibliotecas — Justificativa

| Seção | Biblioteca | Justificativa |
|-------|-----------|---------------|
| Diagramas interativos | **React Flow** | Grafo SVG com nós/edges customizáveis, drag, pan/zoom, ideal para arquitetura. `dynamic()` ssr:false evita SSR issues com DOM APIs |
| Animações e counters | **Framer Motion** | `useInView`, `AnimatePresence`, spring physics — animações suaves com controle declarativo |
| Componentes UI | **shadcn/ui** | Componentes acessíveis (Radix UI), sem runtime CSS-in-JS, customizáveis via Tailwind. Sheet, Table, Badge, Card, NavigationMenu |
| Ícones | **Lucide React** + SVGs benc-uk/icon-collection | Lucide para UI genérica; ícones Azure oficiais para os diagramas |
| Theme toggle | **next-themes** | Integração nativa com Tailwind `dark:` classes, sem flash de tema |
| Fontes | **next/font** | Google Fonts com subset, zero layout shift, self-hosted em produção |

---

## 6. Dados — Arquivos `lib/data/`

Todos os dados são extraídos da documentação e tipados com TypeScript estrito (sem `any`).

### `legacy.ts`
```typescript
export interface LegacyModule { id, name, type, lines, description, issues: string[] }
export interface SecurityVulnerability { id, title, severity, file, description, fix }
export interface TechnicalDebt { id, title, severity, category, description }
// Arrays: modules[], vulnerabilities[], debts[], metrics
```

### `cloud.ts`
```typescript
export interface AzureContainer { id, name, tech, cpu, memory, replicasMin, replicasMax, description, endpoints: string[], secrets: string[] }
export interface AzureService { id, name, icon, description, details: string[] }
export interface ADR { id, title, context, decision, rationale, consequences: { positive: string[], negative: string[] } }
// Arrays: containers[], services[], adrs[], metrics
```

### `endpoints.ts`
```typescript
export interface EndpointMapping { soapOperation, restMethod, restPath, description }
export interface SoapService { name, wsdlUrl, operations: EndpointMapping[] }
// soapServices[], restServices[], sunsetStrategy
```

### `devops.ts`
```typescript
export interface PipelineStage { id, name, icon, steps: string[], badge, badgeType }
export interface BicepModule { filename, description }
export interface Branch { pattern, description, tag, badgeType }
```

### `timeline.ts`
```typescript
export interface TimelinePhase { id, number, title, details: string[], color }
```

### `comparisons.ts`
```typescript
export interface StackRow { category, legacy, modern, highlight?: boolean }
export interface SecurityRow { id, vulnerability, legacyDetail, fix, fixDetail }
export interface IntegrationRow { aspect, legacy, modern }
```

---

## 7. Requisitos Não Funcionais

- **Responsivo:** mobile-first. 320px, 768px, 1440px+. React Flow com pan/zoom em mobile.
- **Performance:** `dynamic()` com `ssr: false` para React Flow. `next/image` para logos. Font display swap. Bundle splitting por seção.
- **Acessibilidade:** semântica HTML correta, `aria-label` em elementos interativos, contraste WCAG AA mínimo.
- **Dark mode:** padrão `dark`. Toggle manual + `prefers-color-scheme`. Sem flash de tema via `next-themes`.
- **Deploy Vercel:** `next.config.ts` sem `output: 'standalone'` (Vercel usa o padrão). `vercel.json` com headers de segurança. `NEXT_PUBLIC_*` vars em `.env.example`.

---

## 8. Configuração Vercel

### `next.config.ts`
```typescript
const nextConfig = {
  images: { remotePatterns: [] },   // apenas imagens locais
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
}
```

### `vercel.json`
```json
{
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-XSS-Protection", "value": "1; mode=block" }
    ]}
  ]
}
```

### `.env.example`
```
# Não há variáveis de ambiente obrigatórias nesta landing page.
# Todos os dados são estáticos em lib/data/.
# NEXT_PUBLIC_SITE_URL=https://dbs.sistran.com.br
```

---

## 9. O que NÃO está no escopo

- Backend / API routes — página 100% estática
- Autenticação
- Analytics (pode ser adicionado com `NEXT_PUBLIC_GA_ID` pós-deploy)
- CMS — conteúdo gerenciado via `lib/data/`
- Testes automatizados (não requeridos nesta entrega)
