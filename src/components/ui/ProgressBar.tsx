import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'cyan',
  size = 'md',
  showLabel = false,
  animated = true,
  className = ''
}) => {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const colorStyles = {
    cyan: 'bg-gradient-to-r from-[#00c2e8] to-[#0098b8] shadow-[0_0_12px_rgba(0,194,232,0.5)]',
    purple: 'bg-gradient-to-r from-[#8b52ec] to-[#7135d1] shadow-[0_0_12px_rgba(139,82,236,0.5)]',
    emerald: 'bg-gradient-to-r from-[#00c8af] to-[#009e8b] shadow-[0_0_12px_rgba(0,200,175,0.5)]',
    amber: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    gradient: 'bg-gradient-to-r from-[#00c2e8] via-[#8b52ec] to-[#00c8af] shadow-[0_0_14px_rgba(0,194,232,0.4)]'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
          <span className="text-[#5a647e] font-sans font-semibold">Progress</span>
          <span className="text-[#00677d] font-bold">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-indigo-100/70 rounded-full overflow-hidden p-0.5 border border-indigo-200/50 shadow-inner ${heightStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative ${colorStyles[color]} ${
            animated ? 'after:absolute after:inset-0 after:bg-white/30 after:animate-pulse' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
