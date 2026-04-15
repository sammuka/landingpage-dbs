// ─── Companies Data ───────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  role: string;
  logoDark: string;
  logoLight: string;
  description: string;
  website?: string;
}

export const companies: Company[] = [
  {
    id: "sistran",
    name: "Sistran",
    role: "Empresa implementadora",
    logoDark: "/logo-sistran.png",
    logoLight: "/logo-sistran.png",
    description: "Parceira tecnológica responsável pela análise, arquitetura e implementação da transformação do DBS.",
    website: "https://www.sistran.com.br",
  },
  {
    id: "lumina",
    name: "Lumina AI",
    role: "Aceleração com IA",
    logoDark: "/logo-lumina-branca.png",
    logoLight: "/logo-lumina-azul.png",
    description: "Plataforma de IA aplicada que acelerou o processo de análise, documentação e geração de código da migração.",
    website: "https://www.lumina.ai.br",
  },
];

export const client = {
  name: "Assurant Brasil",
  segment: "Seguradora multinacional",
  system: "DBS — Delphos Billing System",
  description: "Sistema de cobrança de prêmios de seguro via cartão de crédito (gateway Cielo/Braspag), operando cobrança recorrente e avulsa.",
};

export const projectMeta = {
  startDate: "31 Mar 2026",
  endDate: "10 Abr 2026",
  team: "Sistran + Lumina AI",
};
