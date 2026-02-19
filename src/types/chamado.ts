export type StatusChamado = 'Aberto' | 'Em andamento' | 'Resolvido' | 'Cancelado';
export type PrioridadeChamado = 'Crítica' | 'Alta' | 'Média' | 'Baixa';
export type AreaChamado = 'Refrigeração' | 'Energia' | 'Ar-condicionado' | 'Água';

export interface Chamado {
  id: number;
  titulo: string;
  area: AreaChamado;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  equipamento: string;
  instalacao: string;
  abertura: string; // ISO Date string
  ultimaAtualizacao: string; // ISO Date string
  descricao: string;
  responsavel: string | null;
}

// Interface para a resposta da nossa API simulada (com paginação)
export interface ChamadosResponse {
  data: Chamado[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}