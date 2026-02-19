import { NextResponse } from 'next/server';
import { getChamadosDB, delay } from '@/lib/mock-db';

// Mapeamento de pesos para a ordenação correta das prioridades
// (Se ordenarmos alfabeticamente, "Baixa" viria antes de "Crítica", o que é errado)
const priorityWeight = {
  'Crítica': 4,
  'Alta': 3,
  'Média': 2,
  'Baixa': 1,
};

export async function GET(request: Request) {
  // 1. Simular latência de rede (Crucial para avaliarem se tratamos Loading states)
  await delay(800);

  const { searchParams } = new URL(request.url);

  // 2. Extrair e tipar os parâmetros da URL
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const status = searchParams.get('status');
  const prioridade = searchParams.get('prioridade');
  const area = searchParams.get('area');
  const sortBy = searchParams.get('sortBy') || 'abertura'; // 'abertura' | 'prioridade'
  const sortOrder = searchParams.get('sortOrder') || 'desc'; // 'asc' | 'desc'

  // 3. Obter a "tabela" em memória (Aquele singleton com os 1200 itens)
  let chamados = getChamadosDB();

  // 4. Aplicar Filtros (A ordem importa para performance, mas aqui sendo em memória é tranquilo)
  if (search) {
    chamados = chamados.filter(c => c.titulo.toLowerCase().includes(search));
  }
  if (status) {
    chamados = chamados.filter(c => c.status === status);
  }
  if (prioridade) {
    chamados = chamados.filter(c => c.prioridade === prioridade);
  }
  if (area) {
    chamados = chamados.filter(c => c.area === area);
  }

  // 5. Aplicar Ordenação
  chamados.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'prioridade') {
      comparison = priorityWeight[a.prioridade] - priorityWeight[b.prioridade];
    } else {
      // Default: Ordenação por data de abertura
      comparison = new Date(a.abertura).getTime() - new Date(b.abertura).getTime();
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // 6. Matemática da Paginação
  const total = chamados.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedData = chamados.slice((page - 1) * limit, page * limit);

  // 7. Retornar no formato esperado pelo contrato
  return NextResponse.json({
    data: paginatedData,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}

export async function POST(request: Request) {
  await delay(800); // Simulando delay de rede
  
  try {
    const body = await request.json();
    const chamados = getChamadosDB();

    const novoChamado = {
      // Gera um ID aleatório seguro para o mock
      id: Math.floor(Math.random() * 10000) + 3000, 
      titulo: body.titulo,
      area: body.area,
      prioridade: body.prioridade,
      equipamento: body.equipamento,
      descricao: body.descricao,
      instalacao: 'Loja Padrão - SP', // Valor fixo pro mock
      status: 'Aberto', // Todo chamado novo nasce aberto
      abertura: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
      responsavel: null,
    };

    // Adiciona o novo chamado no início do array em memória
    chamados.unshift(novoChamado as any);

    return NextResponse.json(novoChamado, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar chamado' }, { status: 400 });
  }
}