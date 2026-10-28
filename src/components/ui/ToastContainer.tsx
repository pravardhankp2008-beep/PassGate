import React from 'react';
import { useApp } from '../../context/useApp';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#006b5d] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-[#00677d] shrink-0" />
        };

        const borders = {
          success: 'border-teal-300/80 bg-teal-50/90 text-[#004e43] shadow-[0_8px_24px_rgba(0,200,175,0.18)]',
          error: 'border-rose-300/80 bg-rose-50/90 text-[#93000a] shadow-[0_8px_24px_rgba(225,29,72,0.15)]',
          warning: 'border-amber-300/80 bg-amber-50/90 text-[#78350f] shadow-[0_8px_24px_rgba(245,158,11,0.18)]',
          info: 'border-cyan-300/80 bg-cyan-50/90 text-[#004b5b] shadow-[0_8px_24px_rgba(0,194,232,0.18)]'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              {toast.title && (
                <div className="font-bold text-[#0d0e1e] mb-0.5">{toast.title}</div>
              )}
              <div className="text-xs leading-relaxed opacity-90">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-black/5 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
