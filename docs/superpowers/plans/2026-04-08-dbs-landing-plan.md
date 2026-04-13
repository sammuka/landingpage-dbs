# DBS Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive Next.js 15 landing page presenting the DBS (Delphos Billing System) technological transformation from Java EE monolith to .NET 9 / Azure cloud-native, targeting solution architects and senior engineers.

**Architecture:** Static Next.js App Router site — all data in `lib/data/*.ts`, sections in `components/sections/`, interactive React Flow architecture maps loaded client-side with `dynamic(ssr:false)`. Tailwind v4 with CSS-based config, dark mode default via `next-themes`.

**Tech Stack:** Next.js 15 · Tailwind CSS v4 · TypeScript strict · React Flow (`@xyflow/react`) · Framer Motion · shadcn/ui · next-themes · Geist Sans · Playfair Display · JetBrains Mono

---

## File Map

### Created
- `app/globals.css` — CSS variables, Tailwind base, dark/light theme tokens
- `app/layout.tsx` — fonts (Playfair Display + JetBrains Mono + Geist), ThemeProvider, metadata
- `app/page.tsx` — composition of all 11 sections
- `next.config.ts` — images config, no standalone
- `vercel.json` — security headers
- `public/icons/azure/*.svg` — Azure icon collection (already copied)
- `public/logo-sistran.png`, `public/logo-lumina-azul.png`, `public/logo-lumina-branca.png` (already copied)

### `lib/data/`
- `legacy.ts` — 7 Eclipse modules, 9 CVEs, 42 debts, AS-IS metrics
- `cloud.ts` — 4 Azure containers, Azure services, 8 ADRs, TO-BE metrics
- `endpoints.ts` — SOAP→REST mapping, 7 operations, sunset strategy
- `devops.ts` — 7 pipeline stages, branch strategy, 12 Bicep modules
- `timeline.ts` — 5 journey phases
- `comparisons.ts` — stack table (20+ rows), security rows, integration rows
- `companies.ts` — Sistran + Lumina data

### `components/ui/`
- `ThemeToggle.tsx` — Sun/Moon toggle using next-themes
- `AzureIcon.tsx` — `<img>` wrapper for `/icons/azure/*.svg`
- `AnimatedCounter.tsx` — Framer Motion counter with useInView
- `SectionLabel.tsx` — eyebrow in JetBrains Mono
- `Tag.tsx` — tag-crit / tag-fix / tag-neutral variants
- `BrowserFrame.tsx` — simulated browser chrome for UI comparison
- `Navbar.tsx` — sticky nav with anchor links + theme toggle

### `components/architecture/`
- `ArchNode.tsx` — custom React Flow node with tooltip
- `LegacyMap.tsx` — AS-IS diagram (amber dark, 7 modules + Oracle)
- `CloudMap.tsx` — TO-BE diagram (dark blue, 4 containers + Azure services)
- `MapToggle.tsx` — ANTES/DEPOIS tab switcher

### `components/sections/`
- `Hero.tsx` — eyebrow, title with strikethrough, 4 animated counters
- `JourneyTimeline.tsx` — 5-phase colored timeline track
- `ArchitectureMaps.tsx` — toggle + lazy-loaded React Flow maps
- `EndpointStrategy.tsx` — SOAP+REST dual strategy with table
- `UIComparison.tsx` — BrowserFrame side-by-side legacy vs modern UI
- `StackComparison.tsx` — full 20+ row tech stack table
- `SecurityVulnerabilities.tsx` — 9 CVEs eliminated
- `IntegrationModel.tsx` — SOAP XML vs REST JSON comparison
- `MetricsAnimated.tsx` — animated counters grid
- `DevOpsPipeline.tsx` — 7-stage pipeline + branch strategy + Bicep
- `ADRCards.tsx` — 8 key Architecture Decision Records
- `Footer.tsx` — logos + links + disclaimer

---

## Task 1: Configure Tailwind v4 + globals.css + layout.tsx

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Write globals.css with CSS variables and theme**

See implementation — full CSS with `@theme`, dark/light tokens, ambient glows.

- [ ] **Step 2: Write layout.tsx with fonts and ThemeProvider**

Install fonts: `next/font/google` (Playfair Display, JetBrains Mono) + `geist` package.

- [ ] **Step 3: Write next.config.ts and vercel.json**

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: compiled successfully

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx next.config.ts vercel.json
git commit -m "feat: configure tailwind v4, dark theme, fonts, layout"
```

---

## Task 2: Data Files — Legacy System

**Files:**
- Create: `lib/data/legacy.ts`

- [ ] **Step 1: Write legacy.ts with all 7 modules, 9 CVEs, metrics**

Real data from AS-IS documentation (dbs-lib, dbs, dbsdb, dbs-ws, dbsportal, dbspag, dbstimer).

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/data/legacy.ts
git commit -m "feat: add legacy system data (modules, CVEs, debts)"
```

---

## Task 3: Data Files — Cloud System, Endpoints, DevOps, Timeline, Comparisons, Companies

**Files:**
- Create: `lib/data/cloud.ts`, `endpoints.ts`, `devops.ts`, `timeline.ts`, `comparisons.ts`, `companies.ts`

- [ ] **Step 1: Write all 6 remaining data files**

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add lib/data/
git commit -m "feat: add all data files (cloud, endpoints, devops, timeline, comparisons, companies)"
```

---

## Task 4: Atom UI Components

**Files:**
- Create: `components/ui/ThemeToggle.tsx`, `AzureIcon.tsx`, `AnimatedCounter.tsx`, `SectionLabel.tsx`, `Tag.tsx`, `BrowserFrame.tsx`
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Write all atom components**

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add components/ui/ components/Navbar.tsx
git commit -m "feat: add atom UI components (ThemeToggle, AzureIcon, AnimatedCounter, etc)"
```

---

## Task 5: React Flow Architecture Nodes + Maps

**Files:**
- Create: `components/architecture/ArchNode.tsx`
- Create: `components/architecture/LegacyMap.tsx`
- Create: `components/architecture/CloudMap.tsx`
- Create: `components/architecture/MapToggle.tsx`

- [ ] **Step 1: Write ArchNode.tsx — custom node with hover tooltip**

- [ ] **Step 2: Write LegacyMap.tsx — AS-IS diagram**

7 Eclipse modules, Oracle 19c, SOAP services. Amber dark background.

- [ ] **Step 3: Write CloudMap.tsx — TO-BE diagram**

4 Azure containers + Azure services. Dark blue. Official SVG icons.

- [ ] **Step 4: Write MapToggle.tsx**

- [ ] **Step 5: TypeScript check**

Run: `npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add components/architecture/
git commit -m "feat: add React Flow architecture maps (legacy + cloud)"
```

---

## Task 6: Hero + JourneyTimeline Sections

**Files:**
- Create: `components/sections/Hero.tsx`
- Create: `components/sections/JourneyTimeline.tsx`

- [ ] **Step 1: Write Hero.tsx**

Eyebrow + Playfair title with red strikethrough + 4 counters + CTA buttons.

- [ ] **Step 2: Write JourneyTimeline.tsx**

5-phase horizontal track with colored dots and details.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx components/sections/JourneyTimeline.tsx
git commit -m "feat: add Hero and JourneyTimeline sections"
```

---

## Task 7: ArchitectureMaps + EndpointStrategy Sections

**Files:**
- Create: `components/sections/ArchitectureMaps.tsx`
- Create: `components/sections/EndpointStrategy.tsx`

- [ ] **Step 1: Write ArchitectureMaps.tsx**

Wraps LegacyMap/CloudMap with MapToggle. `dynamic(ssr:false)`.

- [ ] **Step 2: Write EndpointStrategy.tsx**

SOAP/REST dual diagram, 7-row mapping table, sunset note.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ArchitectureMaps.tsx components/sections/EndpointStrategy.tsx
git commit -m "feat: add ArchitectureMaps and EndpointStrategy sections"
```

---

## Task 8: UIComparison + StackComparison Sections

**Files:**
- Create: `components/sections/UIComparison.tsx`
- Create: `components/sections/StackComparison.tsx`

- [ ] **Step 1: Write UIComparison.tsx**

BrowserFrame side-by-side: Struts 1.3 vs Next.js Portal.

- [ ] **Step 2: Write StackComparison.tsx**

shadcn Table with 20+ rows, highlight key differences.

- [ ] **Step 3: Commit**

```bash
git add components/sections/UIComparison.tsx components/sections/StackComparison.tsx
git commit -m "feat: add UIComparison and StackComparison sections"
```

---

## Task 9: Security + Integration + Metrics Sections

**Files:**
- Create: `components/sections/SecurityVulnerabilities.tsx`
- Create: `components/sections/IntegrationModel.tsx`
- Create: `components/sections/MetricsAnimated.tsx`

- [ ] **Step 1: Write SecurityVulnerabilities.tsx**

9 CVE rows with red warning → green fix format.

- [ ] **Step 2: Write IntegrationModel.tsx**

SOAP XML envelope vs REST JSON side-by-side code blocks.

- [ ] **Step 3: Write MetricsAnimated.tsx**

AnimatedCounter grid, 9 metrics, spring animation on viewport entry.

- [ ] **Step 4: Commit**

```bash
git add components/sections/SecurityVulnerabilities.tsx components/sections/IntegrationModel.tsx components/sections/MetricsAnimated.tsx
git commit -m "feat: add Security, Integration and Metrics sections"
```

---

## Task 10: DevOpsPipeline + ADRCards + Footer Sections

**Files:**
- Create: `components/sections/DevOpsPipeline.tsx`
- Create: `components/sections/ADRCards.tsx`
- Create: `components/sections/Footer.tsx`

- [ ] **Step 1: Write DevOpsPipeline.tsx**

7-stage pipeline with Azure icons, branch strategy cards, 12 Bicep modules.

- [ ] **Step 2: Write ADRCards.tsx**

8 ADR cards with Framer Motion stagger, shadcn Card.

- [ ] **Step 3: Write Footer.tsx**

Sistran + Lumina logos, links, disclaimer.

- [ ] **Step 4: Commit**

```bash
git add components/sections/DevOpsPipeline.tsx components/sections/ADRCards.tsx components/sections/Footer.tsx
git commit -m "feat: add DevOpsPipeline, ADRCards and Footer sections"
```

---

## Task 11: Page Composition + Final Build

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write page.tsx composing all 11 sections in order**

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: compiled successfully, no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose full landing page — all sections assembled"
```

---

## Self-Review

- All 11 spec sections covered: Hero ✓ JourneyTimeline ✓ ArchitectureMaps ✓ EndpointStrategy ✓ UIComparison ✓ StackComparison ✓ SecurityVulnerabilities ✓ IntegrationModel ✓ MetricsAnimated ✓ DevOpsPipeline ✓ ADRCards ✓ Footer ✓
- React Flow maps: dark amber AS-IS + dark blue TO-BE, both with real module/container data
- All data typed with TypeScript strict interfaces
- No placeholders — all data from real documentation
- Vercel-ready: no `output: standalone`, security headers in vercel.json
