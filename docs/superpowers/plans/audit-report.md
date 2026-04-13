# Relatório de Auditoria — Landing Page DBS

**Data:** 2026-04-12
**Escopo:** Validação de todos os claims da LP contra evidências do AS-IS e REALIZADO
**Fontes:**
- AS-IS: `D:\Projetos\Assurant\DBS\DBS-FontesHistórico\docs\as-is\` (15 documentos)
- AS-IS BD: `D:\Projetos\Assurant\DBS\DBS-FontesHistórico\docs\banco-dados\`
- REALIZADO: `D:\Projetos\Assurant\DBS\Assurant-DBS\` (código-fonte, docs, infra, pipelines)

---

## 1. Resumo Executivo

Foram auditados **todos os claims quantitativos e qualitativos** da landing page. Identificados **20 erros factuais** (12 graves + 8 de precisão) e **4 dados não verificáveis** que foram removidos. Todos os erros foram corrigidos nos arquivos da LP. Os claims corretos foram confirmados contra evidência documental e de código.

---

## 2. Correções Aplicadas

### 2.1 Erros Factuais Graves

| # | Arquivo | Claim Original | Correção | Evidência |
|---|---|---|---|---|
| 1 | `comparisons.ts` | CI/CD legado: "Jenkins (manual, sem IaC)" | "Azure DevOps (apenas Fortify SAST)" | `001-visao-geral.md:156`, `013-dividas-tecnicas.md:405` — `azure-pipelines.yml` contém apenas scan Fortify |
| 2 | `comparisons.ts` | Logging legado: "Log4j 1.2 (EOL 2015)" | "SLF4J + JBoss LogManager" | `001-visao-geral.md:154`, `012-logs-e-auditoria.md:14` — SLF4J com wrapper customizado |
| 3 | `comparisons.ts` | Build legado: "Maven 3 + Ant scripts" | "Eclipse Projects (sem Maven/Gradle)" | `001-visao-geral.md:155,431` — "Sem Maven/Gradle; 7 projetos Eclipse" |
| 4 | `legacy.ts` | AES: "AES-128 CBC com IV fixo zeros" | "AES-256/CBC com IV fixo zeros" | `011-seguranca.md:138-139` — `ALGORITHM_AES256 = "AES/CBC/PKCS5Padding"`, chave 256 bits |
| 5 | `devops.ts`, `cloud.ts`, `comparisons.ts` | Bicep: "12 módulos" | "6 módulos" | `infra/` listing: main.bicep + 5 em modules/ |
| 6 | `devops.ts`, `comparisons.ts` | Pipeline: "7 estágios" | "3 pipelines (ci.yml, cd.yml, infra.yml)" | `.github/workflows/` — 3 arquivos de workflow |
| 7 | `cloud.ts`, `timeline.ts` | Containers: "4 (Payment API, Admin API, Portal, SOAP Adapter)" | "3 (API Unificada, Portal, SOAP Adapter)" | ADR-018 unificou Payment+Admin; `containerApp.bicep` define 2 Container Apps |
| 8 | `cloud.ts`, `comparisons.ts`, `Hero.tsx`, `MetricsAnimated.tsx` | Testes: "191 (87% cobertura)" | "163 testes" | `grep -rc "[Fact]\|[Theory]" tests/` = 163 métodos |
| 9 | `cloud.ts`, `Hero.tsx`, `MetricsAnimated.tsx` | Classes novas: "400 classes C#" | "383 tipos (249 classes + 84 records + 27 interfaces + 23 enums)" | `grep` por declarações de tipo em src/ |
| 10 | `cloud.ts` | ".NET 9 LTS" | ".NET 9 (STS)" | .NET 9 é Standard Term Support, não LTS |
| 11 | `devops.ts`, `comparisons.ts` | Deploy: "Blue-green swap via traffic weights" | "Rolling update via az containerapp update" | `cd.yml` não contém traffic splitting |
| 12 | `legacy.ts`, `timeline.ts` | Docs AS-IS: "13 documentos" | "15 documentos" | `docs/as-is/` contém 15 arquivos (001-015) |

### 2.2 Erros de Precisão

| # | Arquivo | Claim Original | Correção | Evidência |
|---|---|---|---|---|
| 13 | `cloud.ts` | `quartzJobs: 8` | `10` (9 ativos + 1 disabled) | `Infrastructure/Jobs/`: 10 job files + BaseJob |
| 14 | `cloud.ts` | `soapDTOs: 20` | `36` | `Contracts/` contém 36 arquivos .cs |
| 15 | `legacy.ts`, `Hero.tsx`, `MetricsAnimated.tsx` | Legacy classes: 1073 | 1133 (soma dos módulos) | AS-IS: "~1.100 arquivos Java"; soma dos `classes` em `legacyModules` = 1133 |
| 16 | `comparisons.ts` | Oracle "19c" | "19c/21c" | `001-visao-geral.md:151` — "compatível 19c/21c" |
| 17 | `devops.ts` | Staging: payment-api + admin-api separados | API unificada (dbs-api) | ADR-018 |
| 18 | `devops.ts` | Docker badge: "4 imagens" | "3 imagens" | CI builds API + Portal + SOAP Adapter |
| 19 | `devops.ts` | Branch main: "Production (blue-green)" | "Production (rolling update)" | `cd.yml` |
| 20 | `legacy.ts` | Header: "13 documentos" | "15 documentos" | Contagem real |
| 21 | `comparisons.ts` | Quartz "3.x" | "3.13.0" | `.csproj`: `<PackageReference Include="Quartz" Version="3.13.0" />` |
| 22 | `timeline.ts`, `Hero.tsx`, `MetricsAnimated.tsx` | Dívidas técnicas: 42 | 48 (42 + 6 descobertas na auditoria BD) | `013-dividas-tecnicas.md`: 42 originais + 6 [NOVO] |

### 2.3 Dados Removidos (sem evidência)

| # | Arquivo | Dado Removido | Motivo |
|---|---|---|---|
| 23 | `companies.ts` | "mais de 100.000 apólices ativas" | Dado de negócio sem evidência verificável |
| 24 | `Hero.tsx` | Card "87% cobertura" | Sem evidência (necessitaria rodar Coverlet) |
| 25 | `companies.ts`, `timeline.ts`, `Footer.tsx` | "20 sprints · 114 dias úteis" | Dados de gestão sem evidência no código |
| 26 | `legacy.ts` | `lastRefactor: "2019"` | Não encontrado nos documentos AS-IS |
| 27 | `cloud.ts` | `testCoverage: 87` | Sem evidência verificável |

---

## 3. Claims Confirmados como Corretos

| Claim | Valor | Verificação |
|---|---|---|
| CVEs críticos no legado | 9 | `011-seguranca.md` — 9 vulnerabilidades críticas documentadas |
| ADRs | 21 | 21 arquivos ADR-001 a ADR-021 em `docs/adr/` |
| Clean Architecture layers | 5 | Domain, Application, Infrastructure, Contracts, API — confirmado na estrutura do projeto |
| Operações SOAP mapeadas | 7 | `endpoints.ts` e documentação confirmam 7 operações |
| MediatR para CQRS | sim | Presente em 20+ arquivos do REALIZADO |
| Polly v8 resiliência | sim | `Microsoft.Extensions.Http.Resilience` 9.1.0 em `.csproj` |
| OIDC GitHub Actions | sim | `cd.yml` usa `azure/login@v2` com client-id/tenant-id |
| Okta OAuth2/OIDC + JWT RS256 | sim | `Program.cs` configura JwtBearer com Okta |
| CoreWCF SOAP Adapter | 1.8.0 | `SoapAdapter.csproj`: CoreWCF.Http 1.8.0 |
| Next.js + React | 16.1.6 + 19.2.3 | `package.json` |
| EF Core UseAzureSql() | sim | Verificado no código |
| Azure SQL Edge dev | sim | `docker-compose.yml` |
| Tokenização SaveCard=true | sim | Documentação e código |
| Serilog PII masking | sim | `appsettings.json` |
| Security Headers (ADR-021) | sim | `SecurityHeadersMiddleware.cs` |
| Rate Limiting 4 políticas | sim | `Program.cs` |
| Quartz.NET | 3.13.0 | `.csproj` |
| FluentValidation | 11.9.0 | `.csproj` |

---

## 4. Conflitos entre Documentação e Implementação

| Conflito | Detalhe |
|---|---|
| ADR-018 vs LP original | A LP original mostrava Payment API e Admin API como containers separados. ADR-018 os unificou em uma única API. O Bicep (`containerApp.bicep`) reflete a unificação, mas a LP não tinha sido atualizada. **Corrigido.** |
| SOAP Adapter no Bicep | O SOAP Adapter tem Dockerfile e está no docker-compose, mas NÃO tem módulo Bicep dedicado. Não é provisionado automaticamente na infra Azure. A LP contava como container implantado. **Corrigido para refletir que existe como container mas sem IaC.** |
| Pipeline conceptual vs real | A LP descrevia um pipeline ideal de 7 estágios sequenciais que não existe. A realidade são 3 pipelines separados com propósitos distintos. **Corrigido para refletir a estrutura real.** |
| Blue-green deployment | A LP afirmava blue-green com traffic weights. O `cd.yml` faz rolling update simples via `az containerapp update`. **Corrigido.** |

---

## 5. Arquivos Alterados

| Arquivo | Tipo de Alteração |
|---|---|
| `lib/data/legacy.ts` | 7 correções: header 15 docs, AES-256, classes 1133, Oracle 19c/21c, technicalDebts 48, remover lastRefactor |
| `lib/data/cloud.ts` | 14 correções: métricas, azureContainers (4→3), ADRs texto, remover testCoverage, Oracle 19c/21c |
| `lib/data/comparisons.ts` | 10 correções: stack table (logging, build, CI/CD, deploy, IaC, testes, Oracle, Quartz) |
| `lib/data/devops.ts` | Major rewrite: pipeline 7→7 stages reais (3 workflows), bicep 12→6, branch rolling update |
| `lib/data/timeline.ts` | 9 correções: fases 01, 04, 05 (classes, dívidas, docs, testes, containers, Bicep, remover sprints) |
| `lib/data/companies.ts` | 3 correções: remover volume apólices, sprints, workingDays |
| `lib/data/endpoints.ts` | 1 correção: container "payment-api" → "dbs-api" |
| `components/sections/Hero.tsx` | Rewrite 4 metric cards (classes, CVEs, testes, dívidas) + h1 "48 dívidas" |
| `components/sections/MetricsAnimated.tsx` | 7 correções: classes, testes, dívidas, stubs, containers, Bicep |
| `components/sections/DevOpsPipeline.tsx` | 3 correções: headings (3 pipelines, 6 módulos Bicep) |
| `components/sections/Footer.tsx` | 1 correção: remover sprints/dias, usar team name |
| `components/sections/ArchitectureMaps.tsx` | 4 correções: legend stats (classes ~1.100, containers 3, testes 163, Bicep 6) |
| `components/sections/EndpointStrategy.tsx` | 1 correção: Oracle 19c → 19c/21c |
| `components/architecture/CloudMap.tsx` | Major rewrite: unificar Payment+Admin API em "API Unificada", 7 estágios → 3 pipelines, edges, Oracle 19c/21c |
| `components/architecture/LegacyMap.tsx` | 3 correções: "Maven" → "Eclipse", Oracle 19c → 19c/21c |
| `app/layout.tsx` | 1 correção: SEO metadata (42→48 dívidas, 191→163 testes) |

---

## 6. Recomendações

1. **Rodar cobertura de testes**: Executar `dotnet test` com Coverlet para obter o % real de cobertura. Se > 80%, adicionar de volta na LP com evidência.
2. **SOAP Adapter IaC**: Se o SOAP Adapter será implantado em produção, criar módulo Bicep dedicado. Caso contrário, marcar explicitamente como "dev/staging only" na LP.
3. **Atualizar para .NET 10 LTS**: .NET 9 (STS) atinge EOL em Nov 2026. Planejar migração para .NET 10 LTS quando disponível.
4. **Blue-green real**: Se blue-green deployment é desejado, implementar traffic splitting via `az containerapp revision` e atualizar a LP após implementação.
5. **Manter sincronização**: Estabelecer processo para que mudanças no código (novos testes, novos ADRs, novos jobs) sejam refletidas na LP.
