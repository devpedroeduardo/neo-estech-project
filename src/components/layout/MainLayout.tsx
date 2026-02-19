'use client';

import React, { useState } from 'react';
import { Layout, Menu, Grid, Drawer, Button } from 'antd';
import { ToolOutlined, LineChartOutlined, MenuOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const screens = useBreakpoint();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = screens.lg === false;

  const menuItems = [
    { key: '/', icon: <ToolOutlined />, label: 'Visão Técnico' },
    { key: '/dashboard', icon: <LineChartOutlined />, label: 'Visão Gestor' },
  ];

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
    if (isMobile) setDrawerOpen(false); 
  };

  const Logo = () => (
    <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
      <h2 style={{ color: '#ec6725', margin: 0, fontWeight: 'bold' }}>NEO Estech</h2>
    </div>
  );

  // 1. APP SHELL: Altura fixa na tela toda e bloqueia rolagem global
  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      
      {!isMobile && (
        <Sider theme="light" width={240} style={{ borderRight: '1px solid #f0f0f0' }}>
          <Logo />
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>
      )}

      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {isMobile && (
          <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: '18px' }} />}
              onClick={() => setDrawerOpen(true)}
            />
            <h3 style={{ color: '#ec6725', margin: '0 0 0 16px', fontWeight: 'bold' }}>NEO Estech</h3>
          </Header>
        )}

        {/* 3. A MÁGICA DO SCROLL */}
        <Content style={{ 
          flex: 1, 
          padding: isMobile ? 16 : 24, 
          margin: 0, 
          background: '#fafafa', 
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {children}
        </Content>
      </Layout>

      <Drawer
        title={<h3 style={{ color: '#ec6725', margin: 0, fontWeight: 'bold' }}>NEO Estech</h3>}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size="default"
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Drawer>
      
    </Layout>
  );
}