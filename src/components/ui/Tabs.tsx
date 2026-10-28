import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: any) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'pills'
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-indigo-100 space-x-6 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'text-[#00677d] font-bold'
                  : 'text-[#5a647e] hover:text-[#0d0e1e]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-cyan-500/15 text-[#00677d]'
                      : 'bg-indigo-100 text-[#5a647e]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c2e8] shadow-[0_0_8px_rgba(0,194,232,0.6)]" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented Tactile Pills Container
  return (
    <div className={`flex flex-wrap p-1 rounded-full bg-indigo-100/70 border border-indigo-200/60 gap-1 backdrop-blur-md ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
              isActive
                ? 'bg-white text-[#0d0e1e] shadow-[0_4px_12px_rgba(45,49,78,0.08),0_1px_2px_rgba(0,194,232,0.12)] border border-white/90 scale-[1.02]'
                : 'text-[#5a647e] hover:text-[#0d0e1e] hover:bg-white/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive
                    ? 'bg-cyan-500/15 text-[#00677d]'
                    : 'bg-white/60 text-[#5a647e]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
