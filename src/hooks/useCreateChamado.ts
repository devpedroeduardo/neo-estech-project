import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Chamado } from '@/types/chamado';

// Tipagem do que vamos enviar pro backend
export type CreateChamadoDTO = Pick<Chamado, 'titulo' | 'area' | 'prioridade' | 'equipamento' | 'descricao'>;

export function useCreateChamado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoChamado: CreateChamadoDTO) => {
      const { data } = await axios.post('/api/chamados', novoChamado);
      return data;
    },
    onSuccess: () => {
      // A MÁGICA: Isso avisa o React Query que a lista de chamados está desatualizada.
      // Ele automaticamente faz um novo fetch em background e atualiza a tabela!
      queryClient.invalidateQueries({ queryKey: ['chamados'] });
    },
  });
}