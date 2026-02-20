import React from 'react';
import { Tag } from 'antd';
import { PrioridadeChamado } from '@/types/chamado';

interface PriorityTagProps {
  prioridade: PrioridadeChamado;
}

const prioridadeColor: Record<PrioridadeChamado, string> = {
  'Crítica': 'magenta',
  'Alta': 'red',
  'Média': 'geekblue',
  'Baixa': 'default',
};

export default function PriorityTag({ prioridade }: PriorityTagProps) {
  return (
    <Tag color={prioridadeColor[prioridade]} variant="filled">
      {prioridade.toUpperCase()}
    </Tag>
  );
}