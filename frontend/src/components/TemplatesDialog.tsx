import { X, LayoutTemplate, FileText, CheckCircle2, Users } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'readme',
    title: 'README de Projeto',
    description: 'Estrutura completa para documentar seu repositório GitHub.',
    icon: LayoutTemplate,
    content: `# 🚀 Nome do Projeto\n\nUma breve descrição do que este projeto faz e para quem ele é.\n\n## 🛠️ Tecnologias\n\n- Tecnolgia 1\n- Tecnologia 2\n\n## 📦 Instalação\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## 📄 Licença\n\nDistribuído sob a licença MIT. Veja \`LICENSE\` para mais informações.`
  },
  {
    id: 'todo',
    title: 'Lista de Tarefas',
    description: 'Organize suas atividades diárias com checklists.',
    icon: CheckCircle2,
    content: `# 📅 Tarefas de Hoje\n\n- [ ] 🟢 Tarefa de alta prioridade\n- [ ] 🟡 Tarefa de média prioridade\n- [ ] ⚪ Tarefa de baixa prioridade\n\n## ✅ Concluído\n\n- [x] Exemplo de tarefa feita`
  },
  {
    id: 'meeting',
    title: 'Ata de Reunião',
    description: 'Capture decisões, participantes e próximos passos.',
    icon: Users,
    content: `# 🤝 Reunião: [Assunto]\n\n**Data:** 10 de Abril, 2026\n**Participantes:** Nome 1, Nome 2\n\n## 📝 Notas\n- Ponto principal discutido\n- Observação importante\n\n## 🚀 Próximos Passos\n1. [ ] Responsável: Ação 1\n2. [ ] Responsável: Ação 2`
  },
  {
    id: 'doc',
    title: 'Documentação Técnica',
    description: 'Estrutura para guias rápidos ou documentação de API.',
    icon: FileText,
    content: `# 📖 Documentação: [Recurso]\n\n## Visão Geral\nExplicação sobre o funcionamento do recurso.\n\n## Exemplo de Uso\n\n\`\`\`typescript\nconst example = "Hello World";\nconsole.log(example);\n\`\`\`\n\n## Referência de API\n\n| Parâmetro | Tipo | Descrição |\n| :--- | :--- | :--- |\n| id | string | Identificador único |`
  }
];

interface TemplatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (content: string) => void;
}

export default function TemplatesDialog({ isOpen, onClose, onSelect }: TemplatesDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
        <header className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Templates Premium</h2>
            <p className="text-sm text-slate-700 dark:text-slate-400 mt-1">Selecione uma estrutura pronta para começar rápido</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onSelect(template.content);
                onClose();
              }}
              className="w-full flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group text-left"
            >
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <template.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {template.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-400 mt-1">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <footer className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-700 dark:text-slate-400 uppercase tracking-wider font-medium">
            O conteúdo será inserido no final do seu documento atual
          </p>
        </footer>
      </div>
    </div>
  );
}
