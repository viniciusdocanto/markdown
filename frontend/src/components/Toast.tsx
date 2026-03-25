import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ArrowUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border min-w-[300px]",
        type === 'success' && "bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-400",
        type === 'error' && "bg-red-50 border-red-100 text-red-800 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400",
        type === 'info' && "bg-indigo-50 border-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:border-indigo-900 dark:text-indigo-400"
      )}>
        {type === 'success' && <CheckCircle size={20} />}
        {type === 'error' && <AlertCircle size={20} />}
        {type === 'info' && <AlertCircle size={20} className="rotate-180" />}
        
        <p className="flex-1 text-sm font-medium">{message}</p>
        
        <button 
          onClick={onClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
