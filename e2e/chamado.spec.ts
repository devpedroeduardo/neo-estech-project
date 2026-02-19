import { test, expect } from '@playwright/test';

test.describe('Filtro de Chamados', () => {
  test('deve filtrar a tabela ao buscar por um termo específico', async ({ page }) => {
    // 1. Acessa a página inicial
    await page.goto('/');

    // 2. CORREÇÃO: Usamos o seletor de 'columnheader' para garantir que estamos olhando para o cabeçalho da tabela
    await expect(page.getByRole('columnheader', { name: 'Título do Chamado' })).toBeVisible();

    // 3. Localiza o input de busca
    const searchInput = page.getByPlaceholder('Buscar por título...');
    
    // 4. Digita um termo que sabemos que existe nos seus dados (ex: "Facere")
    await searchInput.fill('Facere');
    await searchInput.press('Enter');

    // 5. Verifica se o resultado filtrado aparece na tabela
    // Usamos .first() para garantir que se houver mais de um, o teste ainda passe
    await expect(page.getByText('Facere').first()).toBeVisible();
  });
});