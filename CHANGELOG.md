# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## ✨ Versão 1.0.0 (Gold) - Março 2026

- **Segurança Blindada**: Implementação de Content Security Policy (CSP), Referrer Policy e X-Content-Type-Options.
- **Resiliência de Dados**: Tratamento de erros (`try/catch`) no acesso ao `localStorage`.
- **Higiene de Logs**: Supressão de mensagens de console em ambiente de produção.
- **UI Finalizada**: Adição de rodapé social, licença MIT e guia interativo de Markdown.
- **Limpeza de Repositório**: Purgação total de arquivos residuais e diretórios não utilizados.

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
- **Performance**: Otimização de renderização e carregamento de fontes.
- **Tipagem**: Migração completa para TypeScript estrito com `vite-env.d.ts`.

### Removido
- Pasta `backend` legada (Express/MongoDB).
- Arquivos redundantes de Docker.
- Dependências não utilizadas (`zustand`).

---
"Build small, scale fast."
