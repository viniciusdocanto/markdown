import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { ArrowUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import 'highlight.js/styles/github-dark.css';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Configurar marked para usar highlight.js e IDs em headings
const renderer = new marked.Renderer();

renderer.heading = (text, level) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

marked.setOptions({
  renderer,
  highlight: function(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
} as any);

interface PreviewProps {
  markdown: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  previewRef?: React.RefObject<HTMLDivElement>;
  fullPageScroll?: boolean;
}

export default function Preview({ markdown, onScroll, previewRef, fullPageScroll = false }: PreviewProps) {
  const html = DOMPurify.sanitize(marked.parse(markdown) as string);

  const handleAnchorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    const href = anchor?.getAttribute('href');

    if (anchor && href && href.startsWith('#')) {
      e.preventDefault();
      const id = decodeURIComponent(href.slice(1));
      const element = (fullPageScroll ? document : previewRef?.current)?.querySelector(`[id="${id}"]`);
      if (element) {
        if (fullPageScroll) {
          window.scrollTo({ top: (element as HTMLElement).offsetTop - 80, behavior: 'smooth' });
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const scrollToTop = () => {
    if (fullPageScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      previewRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn("relative font-sans", !fullPageScroll && "h-full")}>
      <div 
        ref={previewRef}
        onScroll={!fullPageScroll ? onScroll : undefined}
        onClick={handleAnchorClick}
        className={cn(
          "bg-white dark:bg-slate-900 p-8 prose dark:prose-invert prose-slate max-w-none scroll-smooth",
          fullPageScroll ? "h-auto" : "h-full overflow-y-auto"
        )}>
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-500 hover:text-indigo-500 z-[60]"
        title="Scroll para o topo"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
