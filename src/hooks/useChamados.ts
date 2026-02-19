import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChamadosResponse, StatusChamado, PrioridadeChamado, AreaChamado } from '@/types/chamado';

// Tipagem dos filtros que nossa API aceita
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

// Função isolada que faz o fetch (poderia estar num arquivo de service separado, mas aqui atende bem)
const fetchChamados = async (params: UseChamadosParams): Promise<ChamadosResponse> => {
  // Limpamos propriedades vazias para não sujar a URL (ex: status="")
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
    // A Query Key é a "identidade" do cache. 
    // Passando os params aqui, o React Query sabe que se a página mudar de 1 para 2, 
    // ele deve buscar de novo. Se voltar pra 1, ele pega do cache instantaneamente!
    queryKey: ['chamados', params],
    queryFn: () => fetchChamados(params),
    // keepPreviousData (no React Query v5 chama-se placeholderData: keepPreviousData)
    // Isso evita que a tabela pisque/suma enquanto carrega a próxima página
  });
}