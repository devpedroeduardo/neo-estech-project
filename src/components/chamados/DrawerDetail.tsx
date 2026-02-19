import React from 'react';
import { Drawer, Descriptions, Timeline, Typography, Divider, Space, Grid } from 'antd';
import type { TimelineItemProps } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { Chamado } from '@/types/chamado';
import StatusBadge from '@/components/ui/StatusBadge';
import PriorityTag from '@/components/ui/PriorityTag';

const { Text, Title } = Typography;

interface DrawerDetailProps {
  open: boolean;
  onClose: () => void;
  chamado: Chamado | null;
}

export default function DrawerDetail({ open, onClose, chamado }: DrawerDetailProps) {
  const screens = Grid.useBreakpoint();
  
  // Consideramos mobile se a tela for menor que 'sm'
  const isMobile = screens.sm === false;
  
  if (!chamado) return null;

  // Lógica Sênior: Montar uma timeline dinâmica baseada nas datas e no status atual
  const timelineItems: TimelineItemProps[] = [
    {
      color: 'blue',
      icon: <ClockCircleOutlined style={{ fontSize: '16px' }} />, // <-- Atualizado de 'dot' para 'icon'
      content: (                                                  // <-- Atualizado de 'children' para 'content'
        <>
          <Text strong>Chamado Aberto</Text>
          <br />
          <Text type="secondary">{dayjs(chamado.abertura).format('DD/MM/YYYY HH:mm')}</Text>
        </>
      ),
    },
  ];

  if (chamado.status === 'Em andamento') {
    timelineItems.push({
      color: 'orange',
      icon: <SyncOutlined spin style={{ fontSize: '16px' }} />, // <-- Atualizado
      content: (                                                // <-- Atualizado
        <>
          <Text strong>Em Atendimento</Text>
          <br />
          <Text type="secondary">Técnico assumiu a ocorrência.</Text>
          <br />
          <Text type="secondary">{dayjs(chamado.ultimaAtualizacao).format('DD/MM/YYYY HH:mm')}</Text>
        </>
      ),
    });
  }

  if (chamado.status === 'Resolvido' || chamado.status === 'Cancelado') {
    timelineItems.push({
      color: chamado.status === 'Resolvido' ? 'green' : 'red',
      icon: chamado.status === 'Resolvido' ? <CheckCircleOutlined style={{ fontSize: '16px' }} /> : undefined, // <-- Atualizado
      content: (                                                                                              // <-- Atualizado
        <>
          <Text strong>{chamado.status === 'Resolvido' ? 'Chamado Resolvido' : 'Chamado Cancelado'}</Text>
          <br />
          <Text type="secondary">{dayjs(chamado.ultimaAtualizacao).format('DD/MM/YYYY HH:mm')}</Text>
        </>
      ),
    });
  }

  return (
    <Drawer
      title={<Text strong style={{ fontSize: 18 }}>Detalhes do Chamado #{chamado.id}</Text>}
      placement="right"
      size={isMobile ? 'default' : 'large'}
      onClose={onClose}
      open={open}
    >
      {/* TROCAMOS O <Space> POR UMA DIV FLEX NATIVA E SEGURA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
        
        {/* CABEÇALHO COM BADGES */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <StatusBadge status={chamado.status} />
          <PriorityTag prioridade={chamado.prioridade} />
        </div>

        <Descriptions title="Informações Gerais" bordered column={1} size="small">
          <Descriptions.Item label="Título"><Text strong>{chamado.titulo}</Text></Descriptions.Item>
          <Descriptions.Item label="Área">{chamado.area}</Descriptions.Item>
          <Descriptions.Item label="Instalação">{chamado.instalacao}</Descriptions.Item>
          <Descriptions.Item label="Equipamento">{chamado.equipamento}</Descriptions.Item>
          <Descriptions.Item label="Responsável">{chamado.responsavel || 'Não atribuído'}</Descriptions.Item>
        </Descriptions>

        <Descriptions title="Descrição" column={1}>
          <Descriptions.Item>
            <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', width: '100%' }}>
              {chamado.descricao}
            </div>
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: '12px 0' }} />

        {/* TIMELINE */}
        <div>
          <Title level={5} style={{ marginBottom: 20 }}>Timeline de Atualizações</Title>
          <Timeline items={timelineItems} />
        </div>
      </div>
    </Drawer>
  );
}