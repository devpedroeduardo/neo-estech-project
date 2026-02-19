import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from './StatusBadge';

describe('Componente StatusBadge', () => {
  it('deve renderizar o status "Resolvido" corretamente', () => {
    render(<StatusBadge status="Resolvido" />);
    
    // Verifica se o texto "Resolvido" apareceu na tela
    const badgeElement = screen.getByText('Resolvido');
    expect(badgeElement).toBeInTheDocument();
  });

  it('deve renderizar o status "Aberto" corretamente', () => {
    render(<StatusBadge status="Aberto" />);
    
    const badgeElement = screen.getByText('Aberto');
    expect(badgeElement).toBeInTheDocument();
  });
});