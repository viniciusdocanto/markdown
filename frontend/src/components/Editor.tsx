interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  editorRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function Editor({ value, onChange, onScroll, editorRef }: EditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Detecta Ctrl (Windows/Linux) ou Meta (Mac)
    const isMod = e.ctrlKey || e.metaKey;

    if (isMod && (e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      const textarea = editorRef?.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selection = value.substring(start, end);
      
      let before = value.substring(0, start);
      let after = value.substring(end);
      let newText = '';
      let newCursorStart = start;
      let newCursorEnd = end;

      if (e.key.toLowerCase() === 'b') {
        newText = `**${selection || 'texto'}**`;
        newCursorStart += 2;
        newCursorEnd = selection ? end + 2 : start + 7;
      } else if (e.key.toLowerCase() === 'i') {
        newText = `*${selection || 'texto'}*`;
        newCursorStart += 1;
        newCursorEnd = selection ? end + 1 : start + 6;
      } else if (e.key.toLowerCase() === 'k') {
        newText = `[${selection || 'link'}](https://)`;
        newCursorStart = selection ? end + 3 : start + 1;
        newCursorEnd = selection ? end + 11 : start + 5;
      }

      onChange(before + newText + after);

      // Ajusta o cursor no próximo tick da renderização
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorStart, newCursorEnd);
      }, 0);
    }
  };

  return (
    <div className="h-full relative flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 flex flex-col">
        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={onScroll}
          className="flex-1 w-full bg-transparent p-8 resize-none outline-none font-mono text-sm text-slate-700 dark:text-slate-300 leading-relaxed overflow-y-auto"
          placeholder="Comece a digitar seu markdown aqui..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
