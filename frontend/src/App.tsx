import { lazy, Suspense, useState, useCallback, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

// Supressão de logs em produção para segurança
if (import.meta.env.PROD) {
  console.error = () => {};
  console.warn = () => {};
  console.debug = () => {};
}

import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
const MarkdownGuide = lazy(() => import('./components/MarkdownGuide'));
const TemplatesDialog = lazy(() => import('./components/TemplatesDialog'));
const Toast = lazy(() => import('./components/Toast'));
import type { ToastType } from './components/Toast';
import { FileText, Download } from 'lucide-react';
import { cn } from './lib/utils';
import { saveDocument, getDocument, getDocumentForAdmin } from './lib/supabase';
import { nanoid } from 'nanoid';

const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const DEFAULT_MARKDOWN = `# Bem-vindo ao Markdown Premium

Este é um editor de markdown moderno com preview em tempo real.

## Funcionalidades
- **Preview em Tempo Real**: Veja as mudanças enquanto digita.
- **Dark Mode**: Conforto visual para qualquer hora.
- **Exportação PDF**: Leve seus documentos para onde quiser.
- **Syntax Highlighting**: Código bem formatado.

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

> "A escrita é a pintura da voz." — Voltaire

### Tabelas
| Recurso | Status |
| :--- | :--- |
| Editor | ✅ Pronto |
| Preview | ✅ Pronto |
| PDF | ✅ Pronto |

Experimente editar este texto!
`;

function MainEditor() {
  const [markdown, setMarkdown] = useState(() => {
    try {
      return localStorage.getItem('markdown-content') || DEFAULT_MARKDOWN;
    } catch (e) {
      return DEFAULT_MARKDOWN;
    }
  });
  const [isResizing, setIsResizing] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const [syncScroll, setSyncScroll] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [documentId, setDocumentId] = useState(() => {
    try {
      return localStorage.getItem('document-id') || nanoid(10);
    } catch (e) {
      return nanoid(10);
    }
  });
  const [shareToken, setShareToken] = useState(() => {
    try {
      return localStorage.getItem('share-token') || nanoid(12);
    } catch (e) {
      return nanoid(12);
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const { id } = useParams();

  useEffect(() => {
    localStorage.setItem('document-id', documentId);
    localStorage.setItem('share-token', shareToken);
  }, [documentId, shareToken]);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getDocumentForAdmin(id);
        setMarkdown(data.content);
        setDocumentId(data.document_id);
        setShareToken(data.share_token || nanoid(12));
      } catch (err) {
        showToast('Erro ao carregar documento ou sem permissão.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('markdown-content', markdown);

      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('markdown-history') || '[]');
      } catch (e) {
        console.warn('Erro ao carregar histórico local, resetando...', e);
      }
      
      if (markdown && markdown !== history[0]) {
        const newHistory = [markdown, ...history].slice(0, 5);
        localStorage.setItem('markdown-history', JSON.stringify(newHistory));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [markdown]);

  const handleEditorScroll = useCallback(() => {
    if (!syncScroll || isScrolling.current || !editorRef.current || !previewRef.current) return;
    isScrolling.current = true;
    const { scrollTop, scrollHeight, clientHeight } = editorRef.current;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    previewRef.current.scrollTop = scrollPercentage * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
    setTimeout(() => { isScrolling.current = false; }, 50);
  }, [syncScroll]);

  const handlePreviewScroll = useCallback(() => {
    if (!syncScroll || isScrolling.current || !editorRef.current || !previewRef.current) return;
    isScrolling.current = true;
    const { scrollTop, scrollHeight, clientHeight } = previewRef.current;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    editorRef.current.scrollTop = scrollPercentage * (editorRef.current.scrollHeight - editorRef.current.clientHeight);
    setTimeout(() => { isScrolling.current = false; }, 50);
  }, [syncScroll]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newPosition = (e.clientX / containerWidth) * 100;
    if (newPosition > 20 && newPosition < 80) setSplitPosition(newPosition);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => setIsResizing(false), []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleNew = () => {
    if (confirm('Deseja criar um novo documento?')) {
      setMarkdown('');
      setDocumentId(nanoid(10));
      setShareToken(nanoid(12));
    }
  };

  const showToast = (message: string, type: ToastType = 'success') => setToast({ message, type });

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    showToast('Markdown copiado!', 'success');
  };

  const handleExportPDF = () => {
    const element = document.querySelector('.markdown-body');
    if (!element) return;
    showToast('Iniciando exportação PDF...', 'info');
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '800px';
    clone.style.padding = '40px';
    clone.style.background = 'white';
    clone.style.color = 'black';
    clone.classList.add('prose');
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.appendChild(clone);
    document.body.appendChild(container);
    const opt = {
      margin: 0.5,
      filename: 'documento.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
    };
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().set(opt).from(clone).save().then(() => {
        document.body.removeChild(container);
        showToast('PDF exportado com sucesso!', 'success');
      });
    }).catch(() => {
      document.body.removeChild(container);
      showToast('Erro ao exportar PDF.', 'error');
    });
  };

  const handleExportMarkdown = () => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = now.getFullYear().toString() + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + 
                     now.getDate().toString().padStart(2, '0');
      const timeStr = now.getHours().toString().padStart(2, '0') + '.' + 
                     now.getMinutes().toString().padStart(2, '0');
      
      a.href = url;
      a.download = `markdown-export-data-${dateStr}-${timeStr}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Markdown exportado!', 'success');
    } catch (error) {
      showToast('Erro ao exportar Markdown.', 'error');
    }
  };

  const handleShare = async () => {
    try {
      if (!markdown.trim()) {
        showToast('O documento está vazio!', 'error');
        return;
      }
      setIsLoading(true);
      showToast('Salvando na nuvem...', 'info');
      await saveDocument({
        document_id: documentId,
        title: 'Documento Compartilhado',
        content: markdown,
        is_public: true,
        share_token: shareToken
      });
      const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}view/${documentId}`.replace(/([^:]\/)\/+/g, "$1");
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link de compartilhamento copiado!', 'success');
    } catch (error) {
      showToast('Erro ao salvar no Supabase. Verifique suas chaves!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (content: string) => {
    setMarkdown(prev => prev + (prev.trim() ? '\n\n' : '') + content);
    showToast('Template inserido!', 'success');
  };

  // Cálculo de estatísticas
  const chars = markdown.length;
  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(words / 200) || 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header
        onNew={handleNew}
        onCopyMarkdown={handleCopyMarkdown}
        onShowGuide={() => setShowGuide(true)}
        onShowTemplates={() => setShowTemplates(true)}
        onExportPDF={handleExportPDF}
        onExportMarkdown={handleExportMarkdown}
        onShare={handleShare}
        syncScroll={syncScroll}
        onToggleSyncScroll={() => setSyncScroll(!syncScroll)}
      />
      <main ref={containerRef} className="flex-1 flex overflow-hidden relative">
        <div style={{ width: `${splitPosition}%` }} className="h-full border-r border-slate-200 dark:border-slate-800">
          <Editor value={markdown} onChange={setMarkdown} onScroll={handleEditorScroll} editorRef={editorRef} />
        </div>
        <div onMouseDown={() => setIsResizing(true)} className={cn("absolute top-0 bottom-0 w-1 bg-transparent hover:bg-indigo-500/30 cursor-col-resize z-10 transition-colors", isResizing && "bg-indigo-500 w-1")} style={{ left: `calc(${splitPosition}% - 2px)` }} />
        <div style={{ width: `${100 - splitPosition}%` }} className="h-full bg-white dark:bg-slate-900">
          <Preview markdown={markdown} onScroll={handlePreviewScroll} previewRef={previewRef} />
        </div>
      </main>
      <Footer words={words} chars={chars} readTime={readTime} />
      <Suspense fallback={null}>
        <MarkdownGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
        <TemplatesDialog 
          isOpen={showTemplates} 
          onClose={() => setShowTemplates(false)} 
          onSelect={handleSelectTemplate} 
        />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </Suspense>
      {isLoading && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center text-white font-medium">Salvando...</div>}
    </div>
  );
}

function ViewOnly() {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadMarkdown = useCallback(() => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento-${id ?? 'markdown'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, id]);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getDocument(id);
        setContent(data.content);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Carregando...</div>;
  if (error) return <div className="h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white text-red-500">Documento não encontrado ou erro ao carregar.</div>;

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Carregando...</div>}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
        <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FileText className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Leitor</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={import.meta.env.BASE_URL}
              className="text-sm font-medium text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Ir para o Editor
            </a>
            <button
              onClick={handleDownloadMarkdown}
              disabled={loading || !content}
              title="Baixar arquivo Markdown"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              <Download size={15} />
              <span>Baixar .md</span>
            </button>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1">
          <div className="max-w-4xl mx-auto">
            <Preview markdown={content} previewRef={previewRef} fullPageScroll={true} />
          </div>
        </div>
        <Footer 
          words={content.trim() ? content.trim().split(/\s+/).length : 0} 
          chars={content.length} 
          readTime={Math.ceil((content.trim() ? content.trim().split(/\s+/).length : 0) / 200)} 
        />
      </div>
    </Suspense>
  );
}

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MainEditor />} />
        <Route path="/edit/:id" element={<MainEditor />} />
        <Route path="/view/:id" element={<ViewOnly />} />
        <Route path="/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}
