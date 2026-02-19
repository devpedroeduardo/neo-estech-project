import MainLayout from '@/components/layout/MainLayout';
import ChamadosTable from '@/components/chamados/ChamadosTable';

export default function Home() {
  return (
    <MainLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0, color: '#1f2937' }}>
          Gestão de Chamados
        </h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>
          Acompanhe e gerencie os incidentes operacionais.
        </p>
      </div>

      <ChamadosTable />
      
    </MainLayout>
  );
}