import { useMemo, useCallback, memo } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import markdownLang from 'highlight.js/lib/languages/markdown';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';
import 'highlight.js/styles/github-dark.css';

// Registrar apenas linguagens necessárias para reduzir bundle size
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('markdown', markdownLang);

// Configurar marked uma única vez fora do componente
const renderer = new marked.Renderer();
renderer.heading = (text, level) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

marked.use({
  renderer,
  breaks: true,
  gfm: true
});

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
}));

interface PreviewProps {
  markdown: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  previewRef?: React.RefObject<HTMLDivElement>;
  fullPageScroll?: boolean;
}

const Preview = memo(function Preview({ markdown, onScroll, previewRef, fullPageScroll = false }: PreviewProps) {
  const html = useMemo(
    () => DOMPurify.sanitize(marked.parse(markdown) as string),
    [markdown]
  );

  const handleAnchorClick = useCallback((e: React.MouseEvent) => {
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
  }, [fullPageScroll, previewRef]);

  const scrollToTop = useCallback(() => {
    if (fullPageScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      previewRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fullPageScroll, previewRef]);

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
        className="fixed bottom-24 right-6 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-700 hover:text-indigo-500 z-[60]"
        title="Scroll para o topo"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
});

export default Preview;
