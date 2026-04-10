import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Document {
  id?: string;
  document_id: string;
  title: string;
  content: string;
  is_public: boolean;
  share_token: string;
  created_at?: string;
  updated_at?: string;
}

export const saveDocument = async (doc: Partial<Document>) => {
  const { data, error } = await supabase.rpc('save_document', {
    p_document_id: doc.document_id,
    p_title: doc.title,
    p_content: doc.content,
    p_is_public: doc.is_public ?? true,
    p_share_token: doc.share_token
  });

  if (error) {
    throw new Error(error.message || 'Erro ao salvar o documento');
  }
  
  return data;
};

export const getDocument = async (documentId: string) => {
  // Validação básica contra injeção e abuso
  if (!/^[a-zA-Z0-9_-]{5,50}$/.test(documentId)) {
    throw new Error('ID de documento inválido');
  }

  const { data, error } = await supabase
    .from('documents')
    .select('id, document_id, title, content, is_public, created_at, updated_at')
    .eq('document_id', documentId)
    .maybeSingle();


  if (error) throw error;
  if (!data) throw new Error('Documento não encontrado');
  return data;
};
