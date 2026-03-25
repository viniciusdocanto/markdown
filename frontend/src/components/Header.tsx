import ThemeToggle from './ThemeToggle';
import { FileText, Download, Copy, Share2, Plus, Link, Link2Off, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface HeaderProps {
  onNew: () => void;
  onExportPDF: () => void;
  onCopyMarkdown: () => void;
  onShowGuide: () => void;
  onShare: () => void;
  syncScroll: boolean;
  onToggleSyncScroll: () => void;
}

export default function Header({
  onNew,
  onExportPDF,
  onCopyMarkdown,
  onShowGuide,
  onShare,
  syncScroll,
  onToggleSyncScroll,
}: HeaderProps) {
  return (
    <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <FileText className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Markdown
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          Novo Documento
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={onCopyMarkdown}
            className="p-2 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg tooltip"
            title="Copiar Markdown"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={onShowGuide}
            className="p-2 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Guia de Markdown"
          >
            <Info size={20} className="stroke-[1.5px]" />
          </button>
          <button
            onClick={onExportPDF}
            className="p-2 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Exportar PDF"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onShare}
            className="p-2 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Compartilhar"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={onToggleSyncScroll}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              syncScroll
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                : "text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            title={syncScroll ? "Sincronização Ativada" : "Sincronização Desativada"}
          >
            {syncScroll ? <Link size={20} /> : <Link2Off size={20} />}
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

        <ThemeToggle />
      </div>
    </header>
  );
}
