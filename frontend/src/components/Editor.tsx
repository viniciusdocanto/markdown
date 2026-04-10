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
    </div>
  );
}
