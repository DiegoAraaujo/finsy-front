# Finsy · Next.js

Controle financeiro pessoal com visão mensal automática, categorias permanentes, receitas, despesas, previsões, repetição mensal e orçamentos opcionais.

A área Planejamento adiciona comparação de meses, cartões/faturas, vencimentos e revisão de extratos CSV/OFX. Movimentações aceitam parcelamento do valor total e cancelamento dos próximos lançamentos de uma série. Configurações reúne sessões, antecedência de lembretes, exportação completa, ajuda e exclusão da conta. O primeiro acesso apresenta passos opcionais, sem exigir salário.

Recuperação de senha está em `/forgot-password` e `/reset-password`. O token do link usa fragmento e é retirado da URL ao abrir a tela. Sessões antigas precisam de novo login após a migração: o refresh passa a cookie HttpOnly, com rotação e revogação no backend. Consulte [operação](../finsy-back/OPERACAO.md) para e-mail, HTTPS, domínios e dependências da hospedagem.

## Desenvolvimento

1. Use Node.js 22.13 ou superior e execute `npm.cmd ci`.
2. Copie `.env.example` para `.env` e ajuste `API_BASE_URL` para a API local, incluindo `/api` (padrão: `http://localhost:3000/api`). Essa variável é exclusiva do servidor; não use prefixo `NEXT_PUBLIC_` para segredos.
3. Prepare o backend seguindo `../finsy-back/REFORMULACAO.md` e aplique as migrações no banco local.
4. Execute `npm.cmd run dev` e abra **http://localhost:3001**. O backend continua na porta 3000.

O frontend usa o App Router do Next.js, com rotas reais em `src/app`. O navegador chama `/api` na mesma origem; os rewrites do Next encaminham para o backend. Isso mantém o cookie HttpOnly no domínio do frontend e evita depender de cookies de terceiros. Configure `APP_URL` no backend com a origem do frontend. Ao mudar `API_BASE_URL`, reinicie o desenvolvimento ou gere um novo build de produção.

O antigo `VITE_BASE_URL` foi substituído por `API_BASE_URL`. Vite, React Router, `index.html` e o rewrite de SPA foram removidos. Na hospedagem, escolha o preset **Next.js**, sem configurar saída `dist` nem redirecionar tudo para `index.html`.

Produção: `npm.cmd run build` e `npm.cmd run start`. Para rodar o build local junto ao backend, use `npm.cmd run start -- --port 3001`. Na hospedagem, o Next usa a porta definida pelo ambiente.

## Verificação

- `npm run build`: build Next.js, verificação de tipos e prerenderização das páginas públicas de carregamento. Dados financeiros continuam protegidos e só são buscados após recuperar a sessão no navegador.
- `npm run typecheck`: gera os tipos de rotas do Next e verifica o TypeScript sem compilar o aplicativo.
- `npm run lint`: verificação estática.
- `npx playwright install chromium` e `npm run test:e2e`: fluxos em desktop e celular com API simulada e dados fictícios. A configuração dos testes aponta exclusivamente para `/api` no servidor local.

Para reutilizar uma instalação de Chromium, defina `FINSY_CHROMIUM_PATH` com o caminho do executável. As capturas de tela ficam em `test-results`, ignorado pelo Git.

## Organização

Os componentes de UI reutilizáveis ficam em `src/components/ui`, seguindo a organização do shadcn. Essa pasta separa os elementos visuais compartilhados das páginas e dos componentes de negócio. O alias `@/` aponta para `src/` no TypeScript e no Next.js; assim, `@/components/ui/dots-ring` importa o mesmo componente em qualquer tela.

O projeto usa React, TypeScript e Tailwind CSS 4 via PostCSS. `components.json` registra a estrutura shadcn com RSC habilitado e `src/lib/utils.ts` fornece `cn`. O antigo `finance.css` foi eliminado: os componentes usam classes Tailwind, com receitas reutilizadas em `src/components/ui/finance-styles.ts`. As classes semânticas restantes identificam estados/elementos em seletores Tailwind e testes; não existe um stylesheet associado a elas.

`src/app/globals.css` contém apenas a importação do Tailwind, tokens, keyframes do drawer e o utilitário de scrollbar. O Montserrat é servido localmente com `next/font/local`. A identidade azul, os círculos decorativos, os estados de foco, os breakpoints e a preferência de movimento reduzido foram preservados.

O indicador `DotsRing` usa `framer-motion`, tem tamanho padrão de 48 px e versão compacta para botões. Mantém o azul do Finsy, herda a cor nos botões e respeita a preferência de movimento reduzido. O exemplo isolado está em `src/components/ui/demo.tsx`.

- `src/app`: layouts, páginas, metadata e providers. Grupos `(auth)` e `(private)` organizam as rotas sem mudar suas URLs.
- `src/screens/finance`: resumo, listas e formulários do novo fluxo.
- `src/screens/planning`: cartões, faturas, comparação, vencimentos e importação.
- `src/services/finance.ts`: contratos e chamadas da API financeira, exportação CSV.
- `src/components/AppLayout.tsx`: navegação desktop e celular.
- `src/components/ui/finance-styles.ts`: receitas Tailwind compartilhadas.
- `test/finance.spec.ts`: cenários de navegador.
- `test/saas.spec.ts`: cartões, comparação, importação, primeiro acesso, sessões e recuperação de senha em desktop e celular.
- `test/session.spec.ts`: token em memória, restauração ao recarregar, navegação Next, renovação e limpeza no logout.

## Sessão em memória

O access token fica no estado React do `UserContextProvider` e em uma referência do mesmo provider, consultada pelo Axios. Nenhum token é gravado em localStorage ou sessionStorage. No primeiro acesso após a atualização, o provider apenas remove as chaves antigas desses storages; bloqueá-los não impede o uso do app.

Ao recarregar/fechar a página, o token em memória desaparece. O cookie HttpOnly de renovação permite buscar um novo access token, sem expô-lo ao JavaScript. Requisições simultâneas compartilham a renovação. Logout revoga a sessão no servidor e limpa o estado; o token não é serializado no HTML e nunca é vinculado ao contexto de renderização do servidor. Isso reduz persistência/exposição em storage, mas não torna o aplicativo imune a XSS enquanto está aberto.

As telas, hooks e serviços do fluxo antigo que não eram mais utilizados foram removidos. A nova API deve ser publicada junto do frontend. Consulte `../finsy-back/REFORMULACAO.md` para regras de importação, limites atuais e preparação de produção.

Relatórios de teste, logs, builds, dependências, arquivos `.env` e backups são locais e ficam fora do Git. Os arquivos `.env.example`, testes automatizados e migrações devem acompanhar o código no repositório.
