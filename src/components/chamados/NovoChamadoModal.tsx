import React from 'react';
import { Modal, Form, Input, Select, Button, message, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useCreateChamado, CreateChamadoDTO } from '@/hooks/useCreateChamado';

// 1. Definimos o Schema de Validação com o Zod
const schema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  area: z.enum(['Refrigeração', 'Energia', 'Ar-condicionado', 'Água'], { 
    message: 'Selecione uma área' 
  }),
  prioridade: z.enum(['Crítica', 'Alta', 'Média', 'Baixa'], { 
    message: 'Selecione a prioridade' 
  }),
  equipamento: z.string().min(3, 'Informe o equipamento afetado'),
  descricao: z.string().min(10, 'Forneça uma descrição mais detalhada'),
});

interface NovoChamadoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NovoChamadoModal({ open, onClose }: NovoChamadoModalProps) {
  const { mutateAsync, isPending } = useCreateChamado();
  const [messageApi, contextHolder] = message.useMessage();

  // 2. Iniciamos o React Hook Form conectado ao Zod
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateChamadoDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: '',
      equipamento: '',
      descricao: '',
    }
  });

  // 3. Função de submissão
  const onSubmit = async (data: CreateChamadoDTO) => {
    try {
      await mutateAsync(data);
      messageApi.success('Chamado aberto com sucesso!');
      reset(); // Limpa o formulário
      onClose(); // Fecha o modal
    } catch (error) {
      messageApi.error('Falha ao abrir o chamado.');
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Abrir Novo Chamado"
        open={open}
        onCancel={onClose}
        footer={null} // Vamos usar o botão de submit do próprio form
        destroyOnHidden// Garante que o estado seja limpo ao fechar
        style={{top: 20 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '8px'
          }
        }}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
          
          <Form.Item 
            label="Título" 
            validateStatus={errors.titulo ? 'error' : ''} 
            help={errors.titulo?.message}
          >
            <Controller
              name="titulo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Ex: Vazamento no balcão" />}
            />
          </Form.Item>

          <Row gutter={16}>
            {/* xs=24 (Ocupa a linha toda no mobile), sm=12 (Ocupa metade na tela média/grande) */}
            <Col xs={24} sm={12}>
              <Form.Item 
                label="Área" 
                validateStatus={errors.area ? 'error' : ''} 
                help={errors.area?.message}
              >
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Selecione">
                      <Select.Option value="Refrigeração">Refrigeração</Select.Option>
                      <Select.Option value="Energia">Energia</Select.Option>
                      <Select.Option value="Ar-condicionado">Ar-condicionado</Select.Option>
                      <Select.Option value="Água">Água</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item 
                label="Prioridade" 
                validateStatus={errors.prioridade ? 'error' : ''} 
                help={errors.prioridade?.message}
              >
                <Controller
                  name="prioridade"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Selecione">
                      <Select.Option value="Crítica">Crítica</Select.Option>
                      <Select.Option value="Alta">Alta</Select.Option>
                      <Select.Option value="Média">Média</Select.Option>
                      <Select.Option value="Baixa">Baixa</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label="Equipamento" 
            validateStatus={errors.equipamento ? 'error' : ''} 
            help={errors.equipamento?.message}
          >
            <Controller
              name="equipamento"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Ex: Balcão Frios 02" />}
            />
          </Form.Item>

          <Form.Item 
            label="Descrição Detalhada" 
            validateStatus={errors.descricao ? 'error' : ''} 
            help={errors.descricao?.message}
          >
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => <Input.TextArea {...field} rows={4} placeholder="Descreva o que está acontecendo..." />}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 32 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Salvar Chamado
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}