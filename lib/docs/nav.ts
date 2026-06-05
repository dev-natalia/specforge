// Estrutura da navegação lateral da documentação (sidebar como índice).
export interface DocLink {
  href: string;
  label: string;
}

export interface DocGroup {
  title: string;
  links: DocLink[];
}

export const DOCS_NAV: DocGroup[] = [
  {
    title: "Comece aqui",
    links: [
      { href: "/docs", label: "Visão geral" },
      { href: "/docs/principios", label: "Princípios & Constraints" },
      { href: "/docs/fluxo", label: "Fluxo & ciclo de vida" },
    ],
  },
  {
    title: "Passo a passo",
    links: [
      { href: "/docs/uso", label: "Guia de uso" },
      { href: "/docs/casos", label: "Casos de uso" },
    ],
  },
  {
    title: "Conceitos",
    links: [
      { href: "/docs/sdd", label: "Spec-Driven Development" },
      { href: "/docs/harness", label: "Harness Engineering" },
    ],
  },
  {
    title: "Guia dos itens",
    links: [
      { href: "/docs/conhecimento", label: "Conhecimento" },
      { href: "/docs/specs", label: "Specs" },
      { href: "/docs/artefatos", label: "Harness, Adapters & Tasks" },
    ],
  },
  {
    title: "Mão na massa",
    links: [{ href: "/docs/exportar", label: "Exportar & usar" }],
  },
];

// Lista achatada na ordem de leitura (para navegação anterior/próximo).
export const DOCS_ORDER: DocLink[] = DOCS_NAV.flatMap((g) => g.links);
