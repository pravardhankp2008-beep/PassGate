import React, { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'none';
  header?: ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = 'none',
  header,
  headerAction,
  footer
}) => {
  const glowStyles = {
    none: 'border-white/90 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)]',
    cyan: 'border-cyan-400/40 shadow-[0_12px_32px_-4px_rgba(0,194,232,0.18),0_4px_12px_0_rgba(0,194,232,0.08)]',
    purple: 'border-purple-400/40 shadow-[0_12px_32px_-4px_rgba(139,82,236,0.18),0_4px_12px_0_rgba(139,82,236,0.08)]',
    amber: 'border-amber-400/40 shadow-[0_12px_32px_-4px_rgba(245,158,11,0.18),0_4px_12px_0_rgba(245,158,11,0.08)]',
    emerald: 'border-teal-400/40 shadow-[0_12px_32px_-4px_rgba(0,200,175,0.18),0_4px_12px_0_rgba(0,200,175,0.08)]'
  };

  return (
    <div
      className={`bg-white/75 backdrop-blur-xl rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden text-[#191a2b] ${glowStyles[glow]} ${className}`}
    >
      {(header || headerAction) && (
        <div className="px-5 py-4 border-b border-indigo-100/80 flex items-center justify-between gap-4 bg-white/50 backdrop-blur-md">
          <div className="font-bold text-[#0d0e1e] flex items-center gap-2">{header}</div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className="p-5 flex-1">{children}</div>

      {footer && (
        <div className="px-5 py-3 border-t border-indigo-100/70 bg-white/40 text-xs text-[#5a647e]">
          {footer}
        </div>
      )}
    </div>
  );
};
