# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2026-03-25

### Adicionado
- **Arquitetura Serverless**: Migração total para Supabase (eliminando backend Node.js legado).
- **Real-Time Preview**: Renderização instantânea com `marked`.
- **Sincronização de Scroll**: Implementação de scroll vinculado entre editor e preview.
- **Exportação PDF**: Funcionalidade de download de documentos via `html2pdf.js`.
- **Compartilhamento**: Sistema de rota `/view/:id` para visualização de documentos.
- **Segurança**: Políticas RLS (Row Level Security) e validação de `documentId`.
- **UI/UX**: Modo Dark, botões "Scroll to Top", notificações Toast e cabeçalho premium.
- **CI/CD**: Workflow de GitHub Actions para deploy via FTP.

### Alterado
- **Performance**: Otimização de renderização e carregamento de fontes.
- **Tipagem**: Migração completa para TypeScript estrito com `vite-env.d.ts`.

### Removido
- Pasta `backend` legada (Express/MongoDB).
- Arquivos redundantes de Docker.
- Dependências não utilizadas (`zustand`).

---
"Build small, scale fast."
