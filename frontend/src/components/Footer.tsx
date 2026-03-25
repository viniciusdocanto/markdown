import { Github, Linkedin, Globe, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-400">
          <span>© {currentYear}</span>
          <span className="font-semibold text-slate-900 dark:text-white">Markdown</span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-1">
            Feito por
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
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="GitHub do Projeto"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/viniciusdocanto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            title="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://docanto.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
            title="Website Pessoal"
          >
            <Globe size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
