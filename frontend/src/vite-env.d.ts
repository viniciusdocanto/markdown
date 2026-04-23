/// <reference types="vite/client" />
/// <reference types="@types/wicg-file-system-access" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // adicione outras variáveis conforme necessário...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
