import React from 'react';
import { useApp } from '../../context/useApp';
import type { NavigationTab } from '../../context/context';
import { 
  Zap, 
  Code2, 
  Trophy, 
  Users, 
  Calendar, 
  BarChart2, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userStats, 
    isSimulating, 
    setIsSimulating,
    resetRace,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'arena',
      label: 'Live Arena',
      icon: <Zap className="w-4 h-4" />,
      badge: 'LIVE'
    },
    {
      id: 'problems',
      label: 'Challenges',
      icon: <Code2 className="w-4 h-4" />,
      badge: '5'
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: 'squad',
      label: 'Squad Hub',
      icon: <Users className="w-4 h-4" />,
      badge: 'Rank #2'
    },
    {
      id: 'schedule',
      label: 'Sprint Schedule',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: 'telemetry',
      label: 'Telemetry & Stats',
      icon: <BarChart2 className="w-4 h-4" />
    }
  ];

  const handleNavClick = (id: NavigationTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#0d0e1e]/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white/70 backdrop-blur-xl border-r border-indigo-100/80 flex flex-col justify-between p-4 transition-transform duration-200 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-[#5a647e] uppercase tracking-wider px-3 mb-2 font-mono">
              Arena Navigation
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/12 text-[#00677d] border border-cyan-500/30 shadow-sm'
                      : 'text-[#2d314e] hover:text-[#0d0e1e] hover:bg-white/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#00c2e8]' : 'text-[#6c797e]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        item.badge === 'LIVE'
                          ? 'bg-rose-500/15 text-rose-600 border border-rose-400/30 animate-pulse'
                          : isActive
                          ? 'bg-cyan-500/20 text-[#00677d]'
                          : 'bg-indigo-100/70 text-[#5a647e]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Simulation Control Panel */}
          <div className="p-3.5 bg-white/85 rounded-2xl border border-indigo-100/90 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0d0e1e] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00c2e8]" />
                Live Bot Sim
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  isSimulating
                    ? 'bg-teal-500/15 text-[#006b5d] border-teal-500/30'
                    : 'bg-indigo-50 text-[#6c797e] border-indigo-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSimulating ? 'bg-[#00c8af] animate-ping' : 'bg-slate-400'
                  }`}
                />
                {isSimulating ? 'ONLINE' : 'PAUSED'}
              </span>
            </div>

            <p className="text-[11px] text-[#5a647e] leading-tight">
              AI rivals dynamically type code and progress along the track.
            </p>

            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  isSimulating
                    ? 'bg-amber-50 hover:bg-amber-100 text-[#b45309] border border-amber-300'
                    : 'bg-cyan-50 hover:bg-cyan-100 text-[#00677d] border border-cyan-300'
                }`}
              >
                {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isSimulating ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={resetRace}
                title="Reset simulation grid"
                className="p-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-[#2d314e] hover:text-[#0d0e1e] border border-indigo-200 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Live Stats Mini-card */}
        <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5a647e] font-semibold">Live Telemetry</span>
            <span className="text-[10px] font-mono font-bold text-[#00677d]">SYNCED</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-white/80 p-2 rounded-xl border border-indigo-100/80">
              <div className="text-[10px] text-[#6c797e] font-sans font-bold">SPEED (APM)</div>
              <div className="text-xs font-extrabold text-[#0d0e1e]">{userStats.apm}</div>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-indigo-100/80">
              <div className="text-[10px] text-[#6c797e] font-sans font-bold">ACCURACY</div>
              <div className="text-xs font-extrabold text-[#006b5d]">{userStats.accuracy}%</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
