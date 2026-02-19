# 🛠️ NEO Estech - Plataforma de Gestão de Chamados

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?logo=antdesign&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068b7?logo=zod&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

Módulo front-end para gestão de chamados operacionais corporativos. Desenvolvido como parte do desafio técnico para a vaga de Frontend Developer, com foco em alta performance, componentização escalável e experiência do usuário (UX).

---

## ✨ Funcionalidades Implementadas

* **📊 Tabela de Dados Avançada:** Listagem de chamados com paginação (Server-side simulada), formatação condicional (Badges) e design responsivo.
* **🔍 Filtros Dinâmicos:** Filtro textual por título e filtros categorizados por Status, Prioridade e Área.
* **📝 Criação de Chamados:** Modal com formulário reativo validado via **React Hook Form + Zod**. Integração com **React Query** para *Optimistic Updates* (atualização automática da tabela sem recarregar a página).
* **📱 Detalhes Rápidos:** Drawer lateral deslizante exibindo informações detalhadas e uma *Timeline* dinâmica de status do chamado.
* **📈 Dashboard Gerencial:** Painel de indicadores (KPIs) com gráficos interativos (Pizza e Barras) utilizando a biblioteca **Recharts**.
* **🧪 Qualidade de Código:** Cobertura de testes unitários (Vitest) para componentes de UI e testes de integração Ponta-a-Ponta (Playwright) para fluxos de usuário.

---

## 🚀 Como Executar o Projeto

O projeto utiliza o **Next.js (App Router)** com rotas de API simuladas para o backend.

### Pré-requisitos
* Node.js (v18 ou superior)
* NPM ou Yarn

### Instalação

1. Clone o repositório:
    ```bash
    git clone [https://github.com/devpedroeduardo/neo-estech.git](https://github.com/devpedroeduardo/neo-estech.git)
    cd neo-estech
    ```

2. Instale as dependências (os binários do Playwright serão instalados automaticamente via postinstall):
    ```bash
    npm install
    ```

3. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4. Acesse no navegador: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Como Executar os Testes

O projeto conta com uma suíte de testes configurada para garantir a estabilidade das entregas.

* **Testes Unitários (Vitest):** Testa a renderização e o comportamento isolado dos componentes de UI.
    ```bash
    npm run test
    ```

* **Testes E2E (Playwright):** Levanta uma instância do navegador e testa o fluxo real do usuário (ex: filtragem textual na tabela).
    ```bash
    npm run test:e2e
    ```

* **Executar Toda a Suíte:**
    ```bash
    npm run test:all
    ```

---

## 🧠 Arquitetura e Decisões Técnicas (Respostas Teóricas)

### 1. Cache e Mutação
**Pergunta:** Como você atualizaria a lista de chamados após criar um novo, garantindo feedback imediato e consistência?

**Resposta:** A melhor abordagem é utilizar a estratégia de *Optimistic Update* em conjunto com a invalidação de cache do React Query. No hook de mutação (`useMutation`), eu interceptaria o `onMutate` para cancelar queries ativas e injetar o novo chamado provisoriamente no cache local (`queryClient.setQueryData`), dando feedback instantâneo ao usuário. Em caso de falha (`onError`), a interface sofreria um *rollback* para o estado anterior. Em caso de sucesso, utilizaria o `onSettled` para realizar um `invalidateQueries`, forçando o React Query a buscar a fonte de verdade atualizada no servidor em *background*.

### 2. Performance em Grandes Listas
**Pergunta:** Sua tabela precisa exibir 5.000 chamados de uma vez em um celular Android médio. Como você lidaria com a performance?

**Resposta:** Renderizar 5.000 nós no DOM simultaneamente causaria travamentos severos. As soluções seriam:
1. **Virtualização (Windowing):** Utilizaria bibliotecas como `@tanstack/react-virtual` para renderizar apenas os itens estritamente visíveis na tela (ex: 15 itens), reciclando os nós do DOM conforme o usuário realiza o *scroll*.
2. **Server-Side Pagination/Filtration:** A responsabilidade de trafegar e filtrar 5.000 itens não deve ser do cliente. A API deve entregar os dados paginados (ex: `limit=20&page=1`).
3. **Debounce:** Para filtros de texto locais, aplicaria um *debounce* de 300ms/500ms para evitar que a árvore do React tente se reconciliar a cada tecla digitada pelo usuário.

### 3. Arquitetura de Componentes
**Pergunta:** O componente `<StatusBadge />` começou a receber dezenas de props (isTooltip, hasDropdown, etc) e ficou complexo. Qual padrão arquitetural você usaria para resolver isso?

**Resposta:** O componente está violando o princípio da Responsabilidade Única (SRP). Eu adotaria o padrão de Composição (Composition) aliado ao Polimorfismo. O `<StatusBadge />` deve voltar a ser um componente burro (*dumb component*), responsável apenas por receber um status e renderizar cor/ícone. Para comportamentos complexos, eu criaria componentes *Wrappers* (ex: `<StatusBadgeWithTooltip>`), onde a lógica de interação (Tooltip, Dropdown) encapsula o Badge puro através da propriedade `children`. Isso mantém o código limpo, testável e altamente extensível.

---
*Desenvolvido por Pedro Eduardo*