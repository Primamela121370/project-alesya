import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

interface Toast {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      showToast(message: string) {
        const toast = { id: Date.now(), message };
        setToasts((prev) => [...prev, toast]);
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((item) => item.id !== toast.id));
        }, 2400);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[120] space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded border border-[var(--color-border-mid)] bg-[var(--color-card)] px-4 py-3 text-sm shadow">
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
