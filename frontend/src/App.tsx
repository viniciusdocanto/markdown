import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import MarkdownGuide from './components/MarkdownGuide';
import Toast, { ToastType } from './components/Toast';
import { FileText } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { saveDocument, getDocument } from './lib/supabase';
import { nanoid } from 'nanoid';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    return localStorage.getItem('markdown-content') || DEFAULT_MARKDOWN;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const [syncScroll, setSyncScroll] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [documentId, setDocumentId] = useState(() => localStorage.getItem('document-id') || nanoid(10));

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    localStorage.setItem('document-id', documentId);
  }, [documentId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('markdown-content', markdown);

      const history = JSON.parse(localStorage.getItem('markdown-history') || '[]');
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
        share_token: nanoid(12)
      });
      const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}view/${documentId}`.replace(/([^:]\/)\/+/g, "$1");
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link de compartilhamento copiado!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro ao salvar no Supabase. Verifique suas chaves!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header
        onNew={handleNew}
        onCopyMarkdown={handleCopyMarkdown}
        onShowGuide={() => setShowGuide(true)}
        onExportPDF={handleExportPDF}
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
      <Footer />
      <MarkdownGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getDocument(id);
        setContent(data.content);
      } catch (err) {
        console.error(err);
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
            href="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Ir para o Editor
          </a>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1">
        <div className="max-w-4xl mx-auto">
          <Preview markdown={content} previewRef={previewRef} fullPageScroll={true} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MainEditor />} />
        <Route path="/view/:id" element={<ViewOnly />} />
      </Routes>
    </BrowserRouter>
  );
}
