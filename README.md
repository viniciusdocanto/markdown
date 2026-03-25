# 📝 Markdown Editor - Serverless

Uma aplicação moderna e performática para edição de Markdown com preview em tempo real, construída com foco em UX e facilidade de deploy.

![Markdown Editor](https://placehold.co/1200x600/?text=Markdown+Editor)

## 🚀 Funcionalidades

- **Preview em Tempo Real**: Visualize suas edições instantaneamente com destaque de sintaxe profissional (`highlight.js`).
- **Sincronização de Scroll**: Navegação espelhada entre o editor e a área de preview.
- **Persistência em Nuvem (Serverless)**: Salvamento automático via Supabase, sem necessidade de backend próprio.
- **Compartilhamento Único**: Gere links públicos para visualização de documentos.
- **Exportação para PDF**: Gere documentos PDF formatados diretamente do navegador.
- **Design Adaptativo**: Suporte completo a Modo Escuro e interfaces responsivas.
- **Histórico Local**: Proteção extra com cache das últimas 5 versões editadas.

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite.
- **Estilização**: Tailwind CSS (com @tailwindcss/typography).
- **Backend as a Service**: Supabase (PostgreSQL).
- **Utilitários**: Marked, DOMPurify, Lucide-React, html2pdf.js.

## 📦 Configuração Local

1.  **Clone o repositório**:
    ```bash
    git clone <url-do-repositorio>
    cd markdown/frontend
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente**:
    Crie um arquivo `.env` na pasta `frontend` seguindo o `.env.example`:
    ```env
    VITE_SUPABASE_URL=seu_projeto_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anon
    ```

4.  **Configure o Banco**:
    Execute o conteúdo de `supabase_schema.sql` no SQL Editor do seu projeto Supabase.

5. - **UI/UX**: Modo Dark, botões "Scroll to Top", notificações Toast e cabeçalho premium.
- **Identidade**: Adicionado rodapé com links sociais e informações de copyright.
- **Legal**: Adicionada licença MIT.
- **CI/CD**: Workflow de GitHub Actions para deploy via FTP.
    **Inicie o desenvolvimento**:
    ```bash
    npm run dev
    ```

## 🚢 Deploy (GitHub Actions)

O projeto está configurado para deploy automático na **Hostinger (ou qualquer servidor via FTP)**. Configure os seguintes Secrets no seu repositório GitHub:

- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`: Credenciais do seu servidor.
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`: Segredos do Supabase.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---
Desenvolvido por [Vinicius do Canto](https://docanto.net).
