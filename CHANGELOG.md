# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## ✨ Versão 1.2.1 - Abril 2026

### Adicionado
- **Área Administrativa**: Implementação de sistema de gestão de documentos na rota `/admin`.
- **Autenticação Supabase**: Proteção do acesso administrativo via Supabase Auth (Email/Senha).
- **Dashboard Mestre**: Interface para listagem, busca, edição e exclusão de todos os markdowns do banco de dados.
- **Edição Direta**: Integração entre o dashboard e o editor principal permitindo abrir documentos existentes pelo `document_id`.
- **Modo Escuro no Admin**: Adição de suporte a temas claro/escuro no Painel Mestre para consistência visual.
- **Atalhos de Teclado**: Implementação de atalhos de produtividade (`Ctrl+B`, `Ctrl+I`, `Ctrl+K`) no editor.
- **Explorador de Arquivos Local**: Nova barra lateral para gerenciar arquivos `.md` diretamente do disco local usando a File System Access API, com suporte a salvamento manual e automático.

### Corrigido
- **Content Security Policy (CSP)**: Ajustada para permitir scripts e conexões da Cloudflare Insights.
- **TypeScript Build**: Correção de erros de tipagem na File System Access API (`values`, `showDirectoryPicker`) através da inclusão explícita dos tipos WICG no `vite-env.d.ts`.
- **Links de Visualização**: Correção na geração de URLs no admin para considerar o `BASE_URL`, resolvendo links quebrados em subpastas.

## ✨ Versão 1.1.3 - Abril 2026

### Corrigido
- **Supabase Context**: Ajuste no nome da tabela de `documents` para `document` para alinhar com o esquema do banco de dados self-hosted, resolvendo o erro 404 nas requisições.

## ✨ Versão 1.1.2 - Abril 2026

### Alterado
- **Ambiente**: Atualização do requisito mínimo do Node.js para `>= 20.0.0` (Ambiente local atualizado para v22.21.0).
- **Core**: Atualização do motor de build para Vite 6.
- **PWA**: Atualização do `vite-plugin-pwa` para v1.2.0 para compatibilidade com Vite 6.
- **CI/CD**: Sincronização da versão do Node.js para v22 no GitHub Actions para resolver erro de rede (`crypto is not defined`) causado por dependências atualizadas.

### Segurança
- **Dependências**: Correção de vulnerabilidades críticas no `serialize-javascript` através de `overrides` no `package.json`.

## ✨ Versão 1.1.1 - Abril 2026

### Corrigido
- **Supabase Insert**: Correção na criação de novos documentos. Removida a dependência do RPC `save_document` que estava falhando em gerar `id` e os timestamps (`created_at`, `updated_at`). Agora o frontend injeta explicitamente o UUID e as datas usando o método `.insert()` padrão da tabela `document`.

## ✨ Versão 1.1.0 (Diamond) - Abril 2026

### Adicionado
- **Suporte PWA**: Aplicativo agora é instalável e possui suporte offline básico via `vite-plugin-pwa`.
- **Sistema de Templates**: Modal com modelos prontos (README, Todo, Reunião, Docs) para criação rápida.
- **Métricas em Tempo Real**: Novo layout de rodapé exibindo contagem de palavras, caracteres e tempo de leitura.
- **Download no Leitor**: Botão "Baixar .md" no header da página de leitura de documentos compartilhados.
- **Segurança Blindada**: Implementação de Content Security Policy (CSP), Referrer Policy e X-Content-Type-Options.
- **Resiliência de Dados**: Tratamento de erros (`try/catch`) no acesso ao `localStorage`.
- **Higiene de Logs**: Supressão de mensagens de console em ambiente de produção.

### Corrigido
- **Supabase Self-Hosted**: Migração do cliente Supabase para instância própria em `markdown.viniciusdocanto.com.br`.
- **CSP**: Content Security Policy atualizado para liberar conexões ao domínio self-hosted.
- **RPC Params**: Correção nos nomes dos parâmetros do RPC `save_document` (removido prefixo `p_` para compatibilidade com a função no servidor).
- **Preconnect**: Hints de `preconnect` e `dns-prefetch` atualizados para o novo domínio.
- **Ícones PWA**: Adição dos ícones 192px e 512px faltantes para conformidade com o manifest.
- **Roteamento de Subdiretório**: Correção de links rígidos para usar `BASE_URL` do Vite.
- **Segurança**: Restrição de acesso a documentos privados no leitor compartilhado.
- **Estabilidade**: Proteção contra falhas no `localStorage` em navegadores com restrições de privacidade.
- **Placeholders de Imagem**: Substituição de links `via.placeholder.com` (depreciados) por `placehold.co` no guia de Markdown e README.
- **Limpeza de Repositório**: Purgação total de arquivos residuais e diretórios não utilizados.

## ✨ Versão 1.0.0 (Gold) - Março 2026

## [0.2.0] - 2026-03-25

### Adicionado
- **Arquitetura Serverless**: Migração total para Supabase (eliminando backend Node.js legado).
- **Real-Time Preview**: Renderização instantânea com `marked`.
- **Sincronização de Scroll**: Implementação de scroll vinculado entre editor e preview.
- **Exportação PDF**: Funcionalidade de download de documentos via `html2pdf.js`.
- **Compartilhamento**: Sistema de rota `/view/:id` para visualização de documentos.
- **UI/UX**: Modo Dark, botões "Scroll to Top", notificações Toast e cabeçalho premium.
- **Exportação**: Converter Markdown para PDF com um clique.
- **Guia Integrado**: Documentação rápida de sintaxe Markdown disponível no editor.
- **Segurança**: Políticas RLS (Supabase) e Content Security Policy (CSP) configuradas para produção.
- **CI/CD**: Deploy automatizado via GitHub Actions para Hostinger (FTP).

### Alterado
- **Performance**: Otimização de renderização, carregamento de fontes e implementação de políticas de cache eficientes no `.htaccess` (1 ano para assets versionados).
- **Tipagem**: Migração completa para TypeScript estrito com `vite-env.d.ts`.

### Removido
- Pasta `backend` legada (Express/MongoDB).
- Arquivos redundantes de Docker.
- Dependências não utilizadas (`zustand`).

---
"Build small, scale fast."
