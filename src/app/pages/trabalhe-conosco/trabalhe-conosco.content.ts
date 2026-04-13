import { SelectOption } from 'src/app/ui/select/select.component';

export type CareerHighlight = {
  slug: string;
  value: string;
  label: string;
};

export type CulturePillar = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type TalentArea = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export type HiringStep = {
  title: string;
  description: string;
};

export type CareerVacancy = {
  id: string;
  title: string;
  team: string;
  location: string;
  model: string;
  level: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const CAREER_HIGHLIGHTS: CareerHighlight[] = [
  {
    slug: 'banco-aberto',
    value: 'Banco aberto',
    label: 'Talentos para produto, operacao e crescimento',
  },
  {
    slug: 'ia-impacto',
    value: 'IA com impacto real',
    label: 'Tecnologia aplicada na rotina das farmacias',
  },
  {
    slug: 'processo-enxuto',
    value: 'Processo enxuto',
    label: 'Candidatura com triagem clara e rapida',
  },
];

export const CULTURE_PILLARS: CulturePillar[] = [
  {
    slug: 'velocidade-criterio',
    eyebrow: 'Velocidade com criterio',
    title: 'Entregamos rapido sem perder o rigor operacional.',
    description:
      'A Zapfarma atua em uma rotina comercial intensa. O time precisa pensar, executar e aprender com agilidade, sem abrir mao de confiabilidade.',
  },
  {
    slug: 'impacto-cliente',
    eyebrow: 'Impacto no cliente',
    title: 'Cada melhoria precisa fazer sentido para a farmacia na ponta.',
    description:
      'Nao estamos construindo software abstrato. A plataforma precisa responder a desafios reais de atendimento, venda e recuperacao de receita.',
  },
  {
    slug: 'autonomia-responsavel',
    eyebrow: 'Autonomia responsavel',
    title: 'Esperamos gente que proponha, decida e sustente o que entrega.',
    description:
      'Temos espaco para iniciativa, ownership e evolucao continua. Ideias sao bem-vindas, mas precisam vir acompanhadas de execucao.',
  },
];

export const CAREER_BENEFITS: string[] = [
  'Ambiente de construcao com proximidade entre produto, negocio e tecnologia',
  'Espaco para crescimento junto com a evolucao comercial da empresa',
  'Contato com automacao, IA aplicada e operacao de alto volume',
  'Banco de talentos ativo para futuras vagas estrategicas',
];

export const TALENT_AREAS: TalentArea[] = [
  {
    slug: 'produto-ux',
    title: 'Produto e UX',
    description:
      'Pesquisa, desenho de fluxos, copy, jornada comercial e experiencia para times internos e clientes.',
    tags: ['UX', 'Produto', 'Research'],
  },
  {
    slug: 'engenharia-ia',
    title: 'Engenharia e IA',
    description:
      'Front-end, integracoes, automacoes, dados, qualidade de software e desenvolvimento de experiencias com IA.',
    tags: ['Angular', 'APIs', 'IA'],
  },
  {
    slug: 'operacoes-suporte',
    title: 'Operacoes e Suporte',
    description:
      'Onboarding, acompanhamento de clientes, estruturacao interna e manutencao da excelencia operacional.',
    tags: ['CS', 'Operacao', 'Suporte'],
  },
  {
    slug: 'comercial-parcerias',
    title: 'Comercial e Parcerias',
    description:
      'Expansao de mercado, relacionamento com drogarias, canais de crescimento e desenvolvimento de novos negocios.',
    tags: ['Vendas', 'Parcerias', 'Growth'],
  },
  {
    slug: 'marketing-conteudo',
    title: 'Marketing e Conteudo',
    description:
      'Posicionamento, campanhas, conteudo, eventos e marca conectados a um produto de alta recorrencia.',
    tags: ['Branding', 'Conteudo', 'Performance'],
  },
  {
    slug: 'financeiro-backoffice',
    title: 'Financeiro e Backoffice',
    description:
      'Estrutura, processos, controles e suporte para a operacao escalar de forma saudavel.',
    tags: ['Financeiro', 'Processos', 'Administrativo'],
  },
];

export const HIRING_STEPS: HiringStep[] = [
  {
    title: 'Cadastro objetivo',
    description:
      'Voce envia seus dados, experiencia, links profissionais e curriculo em um unico formulario.',
  },
  {
    title: 'Triagem orientada por contexto',
    description:
      'Organizamos as candidaturas por area de interesse, senioridade, disponibilidade e aderencia ao momento da empresa.',
  },
  {
    title: 'Contato quando houver fit',
    description:
      'Quando surgir uma vaga compativel, o time usa essa base para iniciar a conversa com mais rapidez.',
  },
];

export const FEATURED_VACANCIES: CareerVacancy[] = [];

export const EXPERIENCE_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'estagio', label: 'Estagio' },
  { value: 'junior', label: 'Junior' },
  { value: 'pleno', label: 'Pleno' },
  { value: 'senior', label: 'Senior' },
  { value: 'lideranca', label: 'Lideranca' },
];

export const STATE_OPTIONS: SelectOption[] = [
  { value: 'AC', label: 'AC' },
  { value: 'AL', label: 'AL' },
  { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' },
  { value: 'BA', label: 'BA' },
  { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' },
  { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' },
  { value: 'MT', label: 'MT' },
  { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' },
  { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' },
  { value: 'PR', label: 'PR' },
  { value: 'PE', label: 'PE' },
  { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' },
  { value: 'RN', label: 'RN' },
  { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' },
  { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' },
  { value: 'SE', label: 'SE' },
  { value: 'TO', label: 'TO' },
];
