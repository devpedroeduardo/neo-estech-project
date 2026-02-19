import React from 'react';
import { Tag } from 'antd';
import { 
  ClockCircleOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';
import { StatusChamado } from '@/types/chamado';

interface StatusBadgeProps {
  status: StatusChamado;
}

const statusConfig: Record<StatusChamado, { color: string; icon: React.ReactNode }> = {
  'Aberto': { color: 'blue', icon: <ClockCircleOutlined /> },
  'Em andamento': { color: 'orange', icon: <SyncOutlined spin /> },
  'Resolvido': { color: 'success', icon: <CheckCircleOutlined /> },
  'Cancelado': { color: 'default', icon: <CloseCircleOutlined /> },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['Aberto'];
  
  return (
    <Tag color={config.color} icon={config.icon} style={{ borderRadius: '12px', padding: '0 8px' }}>
      {status}
    </Tag>
  );
}