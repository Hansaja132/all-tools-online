import * as React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from './utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback((title: string, description?: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    // Auto dismiss
    setTimeout(() => {
      dismiss(id);
    }, 5000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<{ toasts: ToastMessage[]; dismiss: (id: string) => void }> = ({
  toasts,
  dismiss,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col space-y-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex w-full items-start space-x-3 rounded-xl border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-300',
            {
              'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100': t.type === 'info',
              'border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-950 dark:text-green-100': t.type === 'success',
              'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950 dark:text-red-100': t.type === 'error',
              'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-100': t.type === 'warning',
            }
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {t.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{t.title}</h4>
            {t.description && <p className="mt-1 text-xs opacity-90">{t.description}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="flex-shrink-0 rounded-lg p-0.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
