import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface GuideItem {
  title: string;
  markdown: string;
  preview: string;
}

const GUIDE_ITEMS: GuideItem[] = [
  {
    title: 'Cabeçalhos',
    markdown: '# H1\n## H2\n### H3',
    preview: '<h1>H1</h1><h2>H2</h2><h3>H3</h3>'
  },
  {
    title: 'Ênfase',
    markdown: '*Itálico*\n**Negrito**\n~~Tachado~~',
    preview: '<em>Itálico</em><br><strong>Negrito</strong><br><del>Tachado</del>'
  },
  {
    title: 'Listas',
    markdown: '- Item 1\n- Item 2\n  1. Subitem A\n  2. Subitem B',
    preview: '<ul><li>Item 1</li><li>Item 2<ol><li>Subitem A</li><li>Subitem B</li></ol></li></ul>'
  },
  {
    title: 'Links e Imagens',
    markdown: '[Google](https://google.com)\n![Alt text](https://via.placeholder.com/50)',
    preview: '<a href="#" class="text-indigo-600">Google</a><br><img src="https://via.placeholder.com/50" alt="Alt text" class="rounded mt-2" />'
  },
  {
    title: 'Código',
    markdown: 'Inline `code` \n\n```js\nconsole.log("Olá");\n```',
    preview: 'Inline <code>code</code><pre class="bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 text-xs"><code>console.log("Olá");</code></pre>'
  },
  {
    title: 'Citações e Tabelas',
    markdown: '> Citação\n\n| A | B |\n|---|---|\n| 1 | 2 |',
    preview: '<blockquote class="border-l-4 border-slate-300 pl-4 italic">Citação</blockquote><table class="w-full mt-2 text-sm border-collapse border border-slate-200"><thead><tr><th class="border border-slate-200 p-1">A</th><th class="border border-slate-200 p-1">B</th></tr></thead><tbody><tr><td class="border border-slate-200 p-1">1</td><td class="border border-slate-200 p-1">2</td></tr></tbody></table>'
  }
];

interface MarkdownGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarkdownGuide({ isOpen, onClose }: MarkdownGuideProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 scale-100 animate-in fade-in zoom-in">
        <header className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Guia de Markdown</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aprenda a formatar seus documentos com facilidade</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDE_ITEMS.map((item, index) => (
            <div key={index} className="flex flex-col border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-800/30">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.title}</span>
                <button 
                  onClick={() => handleCopy(item.markdown, index)}
                  className="text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-1 text-xs"
                >
                  {copiedIndex === index ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copiedIndex === index ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4 divide-x divide-slate-100 dark:divide-slate-800">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Código</span>
                  <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-transparent whitespace-pre-wrap">
                    {item.markdown}
                  </pre>
                </div>
                <div className="space-y-2 pl-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Resultado</span>
                  <div className="text-sm text-slate-800 dark:text-slate-200 prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.preview }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dica: Você também pode usar atalhos de teclado comuns como Ctrl+B para Negrito em muitos editores.
          </p>
        </footer>
      </div>
    </div>
  );
}
