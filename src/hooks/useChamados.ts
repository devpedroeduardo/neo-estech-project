import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChamadosResponse, StatusChamado, PrioridadeChamado, AreaChamado } from '@/types/chamado';

// Tipagem dos filtros que a API aceita
export interface UseChamadosParams {
  page: number;
  limit: number;
  search?: string;
  status?: StatusChamado | '';
  prioridade?: PrioridadeChamado | '';
  area?: AreaChamado | '';
  sortBy?: 'abertura' | 'prioridade';
  sortOrder?: 'asc' | 'desc';
}

// Função isolada que faz o fetch dos chamados. Isso é uma boa prática para manter o hook limpo e reutilizar a função em outros lugares, se necessário.
const fetchChamados = async (params: UseChamadosParams): Promise<ChamadosResponse> => {
  // Limpei as propriedades vazias para não sujar a URL
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
  );

  const { data } = await axios.get<ChamadosResponse>('/api/chamados', {
    params: cleanParams,
  });
  
  return data;
};

// O Hook Customizado que o nosso componente vai usar
export function useChamados(params: UseChamadosParams) {
  return useQuery({
    queryKey: ['chamados', params],
    queryFn: () => fetchChamados(params),
  });
}