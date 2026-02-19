import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Direciona o Playwright apenas para os testes de ponta-a-ponta
  testDir: './e2e',
  fullyParallel: true,
  // Impede que falhas em um teste parem toda a execução
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // URL base onde o seu Next.js roda
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Configuração Sênior: O Playwright sobe o servidor sozinho para testar
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});