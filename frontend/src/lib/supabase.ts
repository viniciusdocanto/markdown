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
  const now = new Date().toISOString();

  // Verifica se o documento já existe
  const { data: existingDoc } = await supabase
    .from('documents')
    .select('id')
    .eq('document_id', doc.document_id)
    .maybeSingle();

  if (existingDoc) {
    const { data, error } = await supabase
      .from('documents')
      .update({
        title: doc.title,
        content: doc.content,
        is_public: doc.is_public ?? true,
        share_token: doc.share_token,
        updated_at: now
      })
      .eq('document_id', doc.document_id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Erro ao atualizar o documento');
    return data;
  } else {
    // Fallback seguro de UUID caso db não gere
    const generateUUID = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const { data, error } = await supabase
      .from('documents')
      .insert({
        id: generateUUID(),
        document_id: doc.document_id,
        title: doc.title,
        content: doc.content,
        is_public: doc.is_public ?? true,
        share_token: doc.share_token,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) throw new Error(error.message || 'Erro ao criar o documento');
    return data;
  }
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
    .eq('is_public', true)
    .maybeSingle();


  if (error) throw error;
  if (!data) throw new Error('Documento não encontrado');
  return data;
};
