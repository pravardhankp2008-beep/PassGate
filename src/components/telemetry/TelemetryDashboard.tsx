import React from 'react';
import { useApp } from '../../context/useApp';
import { 
  Activity, 
  Flame, 
  Zap, 
  Code2, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const TelemetryDashboard: React.FC = () => {
  const { userStats } = useApp();

  const languageBreakdown = [
    { name: 'TypeScript', percent: 46, color: 'cyan' as const },
    { name: 'Rust', percent: 28, color: 'purple' as const },
    { name: 'Python', percent: 14, color: 'amber' as const },
    { name: 'C++', percent: 8, color: 'emerald' as const },
    { name: 'Go', percent: 4, color: 'cyan' as const }
  ];

  // 12-week simulated activity heatmap blocks
  const activityDays = Array.from({ length: 56 }, (_, i) => {
    const val = (i * 7 + 3) % 5;
    return val;
  });

  return (
    <div className="space-y-6 text-[#191a2b]">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)]">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-50 text-[#00677d] border border-cyan-300 shadow-sm">
              <Activity className="w-4 h-4 text-[#00c2e8]" />
            </span>
            <span className="text-xs font-mono text-[#00677d] uppercase tracking-wider font-bold">
              Performance Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e1e] font-sans tracking-tight">
            BIOMETRIC &amp; SPRINT TELEMETRY
          </h1>
          <p className="text-sm text-[#5a647e]">
            Real-time telemetry streams, typing velocity, test assertion accuracy, and system efficiency profiling.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5a647e] font-mono font-semibold">
            <span>Actions / Min (APM)</span>
            <Zap className="w-4 h-4 text-[#00c2e8]" />
          </div>
          <div className="text-3xl font-extrabold text-[#00677d] font-sans">
            {userStats.apm}
          </div>
          <div className="text-[11px] text-[#006b5d] font-mono font-bold">
            +14% vs Pro Division Avg
          </div>
        </div>

        <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5a647e] font-mono font-semibold">
            <span>Code Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-[#00c8af]" />
          </div>
          <div className="text-3xl font-extrabold text-[#006b5d] font-sans">
            {userStats.accuracy}%
          </div>
          <div className="text-[11px] text-[#6c797e] font-mono">
            First-try pass rate
          </div>
        </div>

        <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5a647e] font-mono font-semibold">
            <span>Global ELO Rating</span>
            <Award className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-3xl font-extrabold text-[#b45309] font-sans">
            {userStats.eloRating}
          </div>
          <div className="text-[11px] text-[#b45309] font-mono font-bold">
            Top 0.05% Worldwide
          </div>
        </div>

        <div className="p-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-[#5a647e] font-mono font-semibold">
            <span>Sprint Streak</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-sans">
            {userStats.currentStreak} 🔥
          </div>
          <div className="text-[11px] text-[#6c797e] font-mono">
            Longest record: {userStats.longestStreak}
          </div>
        </div>
      </div>

      {/* Middle Section: Language Distribution & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <div className="p-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#0d0e1e] font-sans flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#00c2e8]" />
              <span>Language Distribution</span>
            </h2>
            <span className="text-xs text-[#6c797e] font-mono font-semibold">182 submissions</span>
          </div>

          <div className="space-y-3">
            {languageBreakdown.map((lang) => (
              <div key={lang.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-[#2d314e] font-sans">{lang.name}</span>
                  <span className="text-[#00677d]">{lang.percent}%</span>
                </div>
                <ProgressBar progress={lang.percent} color={lang.color} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Heatmap Grid */}
        <div className="p-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#0d0e1e] font-sans flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00c8af]" />
              <span>Sprint Consistency Matrix</span>
            </h2>
            <span className="text-xs text-[#6c797e] font-mono font-semibold">Past 8 Weeks</span>
          </div>

          <p className="text-xs text-[#5a647e]">
            Sprint submissions density and algorithm challenge completion timestamps.
          </p>

          <div className="grid grid-cols-8 sm:grid-cols-14 gap-1.5 pt-2">
            {activityDays.map((val, idx) => {
              const bgColors = [
                'bg-indigo-50 border-indigo-100',
                'bg-cyan-100 border-cyan-200',
                'bg-cyan-300 border-cyan-400',
                'bg-[#00c2e8] border-cyan-500 shadow-sm',
                'bg-[#0098b8] border-cyan-600 shadow-[0_0_8px_rgba(0,194,232,0.6)]'
              ];
              return (
                <div
                  key={idx}
                  title={`Day ${idx + 1}: ${val * 2} challenges solved`}
                  className={`w-full aspect-square rounded-lg border ${bgColors[val]} transition-transform hover:scale-125 cursor-pointer`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#6c797e] pt-2 border-t border-indigo-100">
            <span>Less Active</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-indigo-50 border border-indigo-100" />
              <span className="w-2.5 h-2.5 rounded bg-cyan-100" />
              <span className="w-2.5 h-2.5 rounded bg-cyan-300" />
              <span className="w-2.5 h-2.5 rounded bg-[#00c2e8]" />
              <span className="w-2.5 h-2.5 rounded bg-[#0098b8]" />
            </div>
            <span>High Intensity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
