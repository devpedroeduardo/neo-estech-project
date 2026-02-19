import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

// Nossos providers importados corretamente (Default Imports)
import StyledComponentsRegistry from '@/lib/antd-registry';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEO - Gestão de Chamados",
  description: "Plataforma de monitoramento operacional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ margin: 0, backgroundColor: '#f9fafb' }}>
        <QueryProvider>
          <StyledComponentsRegistry>
            <ConfigProvider
              locale={ptBR}
              theme={{
                token: { colorPrimary: '#ec6725', borderRadius: 6 },
              }}
            >
              {children}
            </ConfigProvider>
          </StyledComponentsRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}