'use client';

import React, { useState } from 'react';
import { Table, Button, Result, Typography, Input, Select, Row, Col, Card, Flex } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import { SearchOutlined, ClearOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import DrawerDetail from '@/components/chamados/DrawerDetail';
import NovoChamadoModal from '@/components/chamados/NovoChamadoModal';

import { useChamados } from '@/hooks/useChamados';
import { Chamado, StatusChamado, PrioridadeChamado, AreaChamado } from '@/types/chamado';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityTag from '@/components/ui/PriorityTag';

const { Text } = Typography;
const { Option } = Select;

export default function ChamadosTable() {
  // 1. Estados de Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. Estados dos Filtros
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusChamado | ''>('');
  const [prioridade, setPrioridade] = useState<PrioridadeChamado | ''>('');
  const [area, setArea] = useState<AreaChamado | ''>('');

  // 3. Conexão com a API (O React Query reage automaticamente a essas variáveis!)
  const { data, isLoading, isError, refetch, isFetching } = useChamados({
    page,
    limit,
    search,
    status,
    prioridade,
    area,
  });

  // Função para limpar todos os filtros e voltar para a página 1
  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPrioridade('');
    setArea('');
    setPage(1);
  };

  if (isError) {
    return (
      <Result
        status="500"
        title="Erro ao carregar os chamados"
        subTitle="Não foi possível conectar ao servidor. Tente novamente."
        extra={<Button type="primary" onClick={() => refetch()}>Tentar Novamente</Button>}
      />
    );
  }

  const columns: TableProps<Chamado>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (text) => <Text strong>#{text}</Text>,
    },
    {
      title: 'Título do Chamado',
      dataIndex: 'titulo',
      key: 'titulo',
      ellipsis: true,
    },
    {
      title: 'Área',
      dataIndex: 'area',
      key: 'area',
      width: 140,
    },
    {
      title: 'Prioridade',
      dataIndex: 'prioridade',
      key: 'prioridade',
      width: 120,
      render: (prioridade) => <PriorityTag prioridade={prioridade} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Abertura',
      dataIndex: 'abertura',
      key: 'abertura',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
   {
      title: 'Ações',
      key: 'acoes',
      width: 120,
      render: (_, record) => (
        <Button 
          type="text" 
          size="small" 
          icon={<EyeOutlined />} 
          style={{ 
            color: '#ec6725', 
            fontWeight: 500, 
            background: '#fff3ed', 
            borderRadius: '6px'
          }}
          onClick={() => {
            setSelectedChamado(record);
            setIsDrawerOpen(true);
          }}
        >
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <Flex vertical gap="middle">
      {/* BARRA DE FILTROS */}
      <Card 
        styles={{ body: { padding: '16px 24px' } }} 
        style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* 1. Busca: Ocupa 6 espaços no Desktop */}
          <Col xs={24} md={12} lg={6}>
            <Input.Search
              placeholder="Buscar por título..."
              allowClear
              onSearch={(value) => {
                setSearch(value);
                setPage(1); 
              }}
              enterButton={<SearchOutlined />}
            />
          </Col>
          
          {/* 2. Status: Ocupa 4 espaços no Desktop */}
          <Col xs={12} md={6} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Status"
              value={status || undefined}
              onChange={(val) => { setStatus(val); setPage(1); }}
              allowClear
            >
              <Option value="Aberto">Aberto</Option>
              <Option value="Em andamento">Em andamento</Option>
              <Option value="Resolvido">Resolvido</Option>
              <Option value="Cancelado">Cancelado</Option>
            </Select>
          </Col>

          {/* 3. Prioridade: Ocupa 4 espaços no Desktop */}
          <Col xs={12} md={6} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Prioridade"
              value={prioridade || undefined}
              onChange={(val) => { setPrioridade(val); setPage(1); }}
              allowClear
            >
              <Option value="Crítica">Crítica</Option>
              <Option value="Alta">Alta</Option>
              <Option value="Média">Média</Option>
              <Option value="Baixa">Baixa</Option>
            </Select>
          </Col>

          {/* 4. Área: Separada na sua própria coluna de 4 espaços */}
          <Col xs={24} md={12} lg={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Área"
              value={area || undefined}
              onChange={(val) => { setArea(val); setPage(1); }}
              allowClear
            >
              <Option value="Refrigeração">Refrigeração</Option>
              <Option value="Energia">Energia</Option>
              <Option value="Ar-condicionado">Ar-condicionado</Option>
              <Option value="Água">Água</Option>
            </Select>
          </Col>

          {/* 5. Botões: Na última coluna ocupando os 6 espaços restantes (6+4+4+4+6 = 24) */}
          <Col xs={24} md={12} lg={6}>
            {/* Flex para alinhar os botões à direita com um espaçamento perfeito */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                Limpar
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                Novo Chamado
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* TABELA DE DADOS */}
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #f0f0f0' }}>
        <Table
          columns={columns}
          dataSource={data?.data}
          rowKey="id"
          loading={isLoading || isFetching} 
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.meta.total || 0,
            showSizeChanger: true,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setLimit(newPageSize);
            },
          }}
          scroll={{ x: 800 }} 
        />
      </div>
      {/* DRAWER DE DETALHES */}
      {selectedChamado && (
        <DrawerDetail 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          chamado={selectedChamado} 
      />
      )}
      {/* MODAL DE NOVO CHAMADO */}
      <NovoChamadoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Flex>
  );
}