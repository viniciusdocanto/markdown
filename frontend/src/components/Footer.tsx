import { Github, Linkedin, Globe, Clock, FileText, Hash } from 'lucide-react';

interface FooterProps {
  words: number;
  chars: number;
  readTime: number;
}

export default function Footer({ words, chars, readTime }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Linha Superior: Métricas de Texto */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-medium border-b border-slate-100 dark:border-slate-800/50 pb-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400" title="Contagem de Palavras">
            <FileText size={14} className="text-indigo-500" />
            <span>{words} <span className="text-slate-400 font-normal">palavras</span></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400" title="Contagem de Caracteres">
            <Hash size={14} className="text-violet-500" />
            <span>{chars} <span className="text-slate-400 font-normal">caracteres</span></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400" title="Tempo estimado de leitura">
            <Clock size={14} className="text-emerald-500" />
            <span>{readTime} <span className="text-slate-400 font-normal">min de leitura</span></span>
          </div>
        </div>

        {/* Linha Inferior: Copy e Sociais */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-400">
            <span>© {currentYear}</span>
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Markdown</span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1 text-xs">
              Desenvolvido por
              <a
                href="https://docanto.net"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Vinicius do Canto
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/viniciusdocanto/markdown"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="GitHub do Projeto"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/viniciusdocanto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://docanto.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
              title="Website Pessoal"
            >
              <Globe size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
