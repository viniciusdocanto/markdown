import { useState, useEffect, useCallback } from 'react';
import { 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Save, 
  RefreshCw,
  X,
  HardDrive
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FileExplorerProps {
  onFileSelect: (content: string, handle: FileSystemFileHandle) => void;
  isOpen: boolean;
  onClose: () => void;
  currentFileHandle: FileSystemFileHandle | null;
  onSave: () => void;
  isAutoSave: boolean;
  onToggleAutoSave: (value: boolean) => void;
}

interface FileItem {
  name: string;
  handle: FileSystemFileHandle;
}

export default function FileExplorer({ 
  onFileSelect, 
  isOpen, 
  onClose, 
  currentFileHandle,
  onSave,
  isAutoSave,
  onToggleAutoSave
}: FileExplorerProps) {
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFiles = useCallback(async (handle: FileSystemDirectoryHandle) => {
    try {
      setLoading(true);
      const items: FileItem[] = [];
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.md')) {
          items.push({ name: entry.name, handle: entry as FileSystemFileHandle });
        }
      }
      setFiles(items.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle);
      await loadFiles(handle);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao abrir diretório:', error);
      }
    }
  };

  const handleFileClick = async (fileHandle: FileSystemFileHandle) => {
    try {
      const file = await fileHandle.getFile();
      const content = await file.text();
      onFileSelect(content, fileHandle);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full animate-in slide-in-from-left duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <HardDrive size={18} className="text-indigo-600" />
          <span>Arquivos Locais</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {!directoryHandle ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-600">
              <FolderOpen size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Nenhuma pasta aberta</p>
              <p className="text-xs text-slate-500">Selecione uma pasta para editar seus arquivos .md</p>
            </div>
            <button
              onClick={handleOpenDirectory}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <FolderOpen size={16} />
              Abrir Pasta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-wider font-semibold">
              <span className="truncate max-w-[150px]">{directoryHandle.name}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleOpenDirectory}
                  className="hover:text-indigo-600 transition-colors"
                  title="Trocar pasta"
                >
                  <FolderOpen size={14} />
                </button>
                <button 
                  onClick={() => loadFiles(directoryHandle)}
                  className="hover:text-indigo-600 transition-colors"
                  title="Atualizar lista"
                >
                  <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => handleFileClick(file.handle)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all group",
                    currentFileHandle?.name === file.name
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <FileText size={16} className={cn(
                    currentFileHandle?.name === file.name ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
              {files.length === 0 && !loading && (
                <p className="text-xs text-slate-500 py-4 text-center italic">Nenhum arquivo .md encontrado.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative inline-flex items-center">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isAutoSave}
                onChange={(e) => onToggleAutoSave(e.target.checked)}
              />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Auto-save</span>
          </label>
          
          <button
            onClick={onSave}
            disabled={!currentFileHandle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Save size={14} />
            Salvar
          </button>
        </div>
        
        {currentFileHandle && (
          <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
            <ChevronRight size={10} />
            Editando: {currentFileHandle.name}
          </div>
        )}
      </div>
    </div>
  );
}
