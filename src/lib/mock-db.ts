import { fakerPT_BR as faker } from '@faker-js/faker';
import { Chamado, StatusChamado, PrioridadeChamado, AreaChamado } from '../types/chamado';

// Dados estáticos do teste
const SEED_DATA: Chamado[] = [
    {
        id: 1001,
        titulo: "Compressor com temperatura acima do limite",
        area: "Refrigeração",
        prioridade: "Crítica",
        status: "Aberto",
        equipamento: "Compressor Bitzer 4TCS-8.2",
        instalacao: "Loja Centro - SP",
        abertura: "2026-02-10T08:30:00Z",
        ultimaAtualizacao: "2026-02-10T14:22:00Z",
        descricao: "Temperatura do compressor atingiu 92°C...",
        responsavel: "Carlos Silva"
    }
];

// Helper para gerar itens randômicos
const generateMockChamados = (count: number): Chamado[] => {
  const statusOptions: StatusChamado[] = ["Aberto", "Em andamento", "Resolvido", "Cancelado"];
  const prioridadeOptions: PrioridadeChamado[] = ["Crítica", "Alta", "Média", "Baixa"];
  const areaOptions: AreaChamado[] = ["Refrigeração", "Energia", "Ar-condicionado", "Água"];

  return Array.from({ length: count }).map((_, index) => ({
    id: 2000 + index, // IDs gerados começam em 2000 para não conflitar
    titulo: faker.lorem.sentence(4),
    area: faker.helpers.arrayElement(areaOptions),
    prioridade: faker.helpers.arrayElement(prioridadeOptions),
    status: faker.helpers.arrayElement(statusOptions),
    equipamento: `${faker.commerce.productName()} #${faker.number.int({ min: 1, max: 99 })}`,
    instalacao: `Loja ${faker.location.city()} - ${faker.location.state({ abbreviated: true })}`,
    abertura: faker.date.recent({ days: 30 }).toISOString(),
    ultimaAtualizacao: faker.date.recent({ days: 5 }).toISOString(),
    descricao: faker.lorem.paragraph(),
    responsavel: Math.random() > 0.3 ? faker.person.fullName() : null,
  }));
};

// Singleton para manter os dados em memória durante a execução do servidor dev
let cachedData: Chamado[] | null = null;

export const getChamadosDB = () => {
  if (!cachedData) {
    const generated = generateMockChamados(1200); // 1200 itens gerados
    cachedData = [...SEED_DATA, ...generated]; 
  }
  return cachedData;
};

// Função para simular delay de rede (Network Latency)
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));