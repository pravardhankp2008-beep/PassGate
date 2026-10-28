import React from 'react';
import type { Difficulty, Division } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate' | 'default';
  difficulty?: Difficulty;
  division?: Division;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  difficulty,
  division,
  size = 'md',
  dot = false,
  className = ''
}) => {
  // Map difficulty to specific colors
  let colorStyles = 'bg-indigo-50/80 text-[#2d314e] border-indigo-200/60';

  if (difficulty) {
    switch (difficulty) {
      case 'Easy':
        colorStyles = 'bg-teal-500/12 text-[#006b5d] border-teal-500/30';
        break;
      case 'Medium':
        colorStyles = 'bg-amber-500/12 text-[#b45309] border-amber-500/30';
        break;
      case 'Hard':
        colorStyles = 'bg-rose-500/12 text-[#93000a] border-rose-500/30';
        break;
      case 'Legendary':
        colorStyles = 'bg-purple-500/12 text-[#7135d1] border-purple-500/35 shadow-[0_2px_8px_rgba(139,82,236,0.15)]';
        break;
    }
  } else if (division) {
    switch (division) {
      case 'Pro Division':
        colorStyles = 'bg-cyan-500/12 text-[#00677d] border-cyan-500/30';
        break;
      case 'University':
        colorStyles = 'bg-purple-500/12 text-[#7135d1] border-purple-500/30';
        break;
      case 'Rookie':
        colorStyles = 'bg-teal-500/12 text-[#006b5d] border-teal-500/30';
        break;
      default:
        colorStyles = 'bg-indigo-50/80 text-[#2d314e] border-indigo-200/60';
    }
  } else {
    switch (variant) {
      case 'cyan':
        colorStyles = 'bg-cyan-500/12 text-[#00677d] border-cyan-500/30';
        break;
      case 'purple':
        colorStyles = 'bg-purple-500/12 text-[#7135d1] border-purple-500/30';
        break;
      case 'emerald':
        colorStyles = 'bg-teal-500/12 text-[#006b5d] border-teal-500/30';
        break;
      case 'amber':
        colorStyles = 'bg-amber-500/12 text-[#b45309] border-amber-500/30';
        break;
      case 'rose':
        colorStyles = 'bg-rose-500/12 text-[#93000a] border-rose-500/30';
        break;
      case 'slate':
      case 'default':
      default:
        colorStyles = 'bg-indigo-50/80 text-[#2d314e] border-indigo-200/60';
        break;
    }
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5 h-6',
    md: 'text-xs px-3 py-1 gap-1.5 h-7'
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-sm select-none tracking-wide ${sizeStyles[size]} ${colorStyles} ${className}`}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
