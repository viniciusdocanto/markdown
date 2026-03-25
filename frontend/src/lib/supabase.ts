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
  // Check if document exists first
  const { data: existing } = await supabase
    .from('documents')
    .select('document_id')
    .eq('document_id', doc.document_id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('documents')
      .update({
        ...doc,
        updated_at: new Date().toISOString(),
      })
      .eq('document_id', doc.document_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        ...doc,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
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
    .select('*')
    .eq('document_id', documentId)
    .maybeSingle();


  if (error) throw error;
  if (!data) throw new Error('Documento não encontrado');
  return data;
};
