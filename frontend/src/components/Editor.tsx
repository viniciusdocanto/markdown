import { ArrowUp } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  editorRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function Editor({ value, onChange, onScroll, editorRef }: EditorProps) {
  return (
    <div className="h-full relative flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 flex flex-col">
        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={onScroll}
          className="flex-1 w-full bg-transparent p-8 resize-none outline-none font-mono text-sm text-slate-700 dark:text-slate-300 leading-relaxed overflow-y-auto"
          placeholder="Comece a digitar seu markdown aqui..."
          spellCheck={false}
        />
      </div>
      <div className="h-8 px-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-white dark:bg-slate-900">
        <div className="flex gap-4">
          <span>{value.length} Caracteres</span>
          <span>{value.trim() ? value.trim().split(/\s+/).length : 0} Palavras</span>
        </div>
        <div>Markdown Ready</div>
      </div>
    </div>
  );
}
