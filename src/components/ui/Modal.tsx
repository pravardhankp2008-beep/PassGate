import React, { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  showClose = true
}) => {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0d0e1e]/40 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog (Hydroglass Elevation 3) */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white/94 backdrop-blur-2xl border-1.5 border-white/95 rounded-3xl shadow-[0_20px_48px_-8px_rgba(0,194,232,0.22),0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden z-10 transition-all transform animate-in zoom-in-95 duration-200 text-[#191a2b]`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="px-6 py-4.5 border-b border-indigo-100/80 flex items-center justify-between gap-4 bg-white/60">
            <div className="font-extrabold text-lg text-[#0d0e1e]">{title}</div>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#5a647e] hover:text-[#0d0e1e] hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
