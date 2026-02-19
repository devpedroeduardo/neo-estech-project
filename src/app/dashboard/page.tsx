'use client';

import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Typography, Flex, Spin } from 'antd';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

import MainLayout from '@/components/layout/MainLayout';
import { useChamados } from '@/hooks/useChamados';

const { Title, Text } = Typography;

// Cores baseadas na paleta da Estech (Laranja) e cores de feedback
const COLORS = ['#ec6725', '#1890ff', '#52c41a', '#fadb14'];

export default function Dashboard() {
  const { data, isLoading } = useChamados({ page: 1, limit: 2000 });

  const stats = useMemo(() => {
    if (!data?.data) return { total: 0, abertos: 0, resolvidos: 0, porArea: [] };

    const chamados = data.data;
    const total = chamados.length;
    const abertos = chamados.filter(c => c.status === 'Aberto').length;
    const resolvidos = chamados.filter(c => c.status === 'Resolvido').length;

    const areaCount = chamados.reduce((acc, curr) => {
      acc[curr.area] = (acc[curr.area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porArea = Object.entries(areaCount).map(([name, value]) => ({ name, value }));

    return { total, abertos, resolvidos, porArea };
  }, [data]);

  return (
    <MainLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#1f2937' }}>Visão do Gestor</Title>
        <Text type="secondary">Indicadores operacionais e volumetria de chamados.</Text>
      </div>

      {isLoading ? (
        <Flex justify="center" align="center" style={{ height: '50vh' }}>
          {/* CORREÇÃO 1: tip -> description */}
          <Spin size="large" description="Carregando indicadores..." />
        </Flex>
      ) : (
        <Flex vertical gap="large">
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              {/* CORREÇÃO 2: bordered={false} -> variant="borderless" */}
              <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Statistic title="Total de Chamados" value={stats.total} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                {/* CORREÇÃO 3: valueStyle -> styles={{ content: {} }} */}
                <Statistic 
                  title="Chamados Abertos (Risco)" 
                  value={stats.abertos} 
                  styles={{ content: { color: '#cf1322' } }} 
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Statistic 
                  title="Chamados Resolvidos" 
                  value={stats.resolvidos} 
                  styles={{ content: { color: '#3f8600' } }} 
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Distribuição por Área" variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.porArea}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.porArea.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Volume por Área" variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.porArea} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                      <Bar dataKey="value" fill="#ec6725" radius={[4, 4, 0, 0]} /> 
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

        </Flex>
      )}
    </MainLayout>
  );
}