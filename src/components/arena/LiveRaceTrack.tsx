import React from 'react';
import { useApp } from '../../context/useApp';
import { Flag, Trophy, Gauge, Sparkles } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const LiveRaceTrack: React.FC = () => {
  const { racers, setSelectedRacerModal } = useApp();

  // Sort racers by progress descending for pole position order
  const sortedRacers = [...racers].sort((a, b) => b.currentProgress - a.currentProgress);

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/95 p-6 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)] relative overflow-hidden text-[#191a2b]">
      {/* Background track finish line checkered pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-8 opacity-10 bg-[linear-gradient(45deg,#00c2e8_25%,transparent_25%,transparent_75%,#00c2e8_75%,#00c2e8),linear-gradient(45deg,#00c2e8_25%,transparent_25%,transparent_75%,#00c2e8_75%,#00c2e8)] bg-[size:10px_10px] bg-[position:0_0,5px_5px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-indigo-100/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-cyan-50 border border-cyan-300/60 text-[#00677d] shadow-sm">
            <Gauge className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0d0e1e] font-sans tracking-tight">
                ARENA SPEED TRACK
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100/70 text-[#00677d] border border-cyan-300/60">
                HEAT #4
              </span>
            </div>
            <p className="text-xs text-[#5a647e]">
              Live racers testing real-time test vector pass rates &amp; code execution velocity
            </p>
          </div>
        </div>

        {/* Legend / Status counts */}
        <div className="flex items-center gap-3 text-xs font-mono font-semibold">
          <div className="flex items-center gap-1.5 text-[#006b5d]">
            <span className="w-2 h-2 rounded-full bg-[#00c8af]" />
            <span>Passed Tests</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00677d]">
            <span className="w-2 h-2 rounded-full bg-[#00c2e8]" />
            <span>Coding</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#7135d1]">
            <Flag className="w-3.5 h-3.5 text-[#8b52ec]" />
            <span>Finish Line</span>
          </div>
        </div>
      </div>

      {/* Racers Grid */}
      <div className="space-y-3">
        {sortedRacers.slice(0, 5).map((racer, index) => {
          const isUser = racer.id === 'racer-user';
          const isFinished = racer.currentProgress >= 100;

          return (
            <div
              key={racer.id}
              onClick={() => setSelectedRacerModal(racer)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                isUser
                  ? 'bg-cyan-50/75 border-cyan-400/50 shadow-[0_4px_16px_rgba(0,194,232,0.15)] ring-1 ring-cyan-400/30'
                  : 'bg-white/70 border-indigo-100/80 hover:border-cyan-300 hover:bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {/* Racer info */}
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-mono text-xs font-extrabold w-5 text-center ${
                      index === 0
                        ? 'text-[#b45309]'
                        : index === 1
                        ? 'text-slate-500'
                        : index === 2
                        ? 'text-amber-700'
                        : 'text-slate-400'
                    }`}
                  >
                    #{index + 1}
                  </span>

                  <div className="relative">
                    <img
                      src={racer.avatar}
                      alt={racer.handle}
                      className={`w-7 h-7 rounded-full object-cover border ${
                        isUser ? 'border-[#00c2e8] ring-2 ring-cyan-300' : 'border-indigo-200'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 text-[10px] leading-none">
                      {racer.flag}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold ${
                          isUser ? 'text-[#00677d]' : 'text-[#0d0e1e] group-hover:text-[#00677d]'
                        }`}
                      >
                        {racer.handle}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500 text-white font-bold">
                          YOU
                        </span>
                      )}
                      {isFinished && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-purple-100 text-[#7135d1] border border-purple-300 font-bold flex items-center gap-0.5">
                          <Trophy className="w-2.5 h-2.5" /> FINISHED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Telemetry metrics */}
                <div className="flex items-center gap-3 text-xs font-mono font-semibold">
                  <div className="hidden sm:flex items-center gap-1 text-[#5a647e]">
                    <span className="text-[#6c797e]">Speed:</span>
                    <span className="text-[#0d0e1e]">{racer.currentSpeedWpm} WPM</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[#6c797e]">Tests:</span>
                    <span
                      className={`font-bold ${
                        racer.testsPassed === racer.totalTests
                          ? 'text-[#006b5d]'
                          : 'text-[#b45309]'
                      }`}
                    >
                      {racer.testsPassed}/{racer.totalTests}
                    </span>
                  </div>

                  <div className="font-extrabold text-[#00677d] min-w-[3rem] text-right">
                    {racer.currentProgress}%
                  </div>
                </div>
              </div>

              {/* Progress track */}
              <div className="relative">
                <ProgressBar
                  progress={racer.currentProgress}
                  color={isUser ? 'gradient' : isFinished ? 'purple' : 'cyan'}
                  size={isUser ? 'md' : 'sm'}
                  animated={!isFinished}
                />

                {/* Car / Avatar runner indicator on track */}
                <div
                  className="absolute -top-1.5 transition-all duration-500 transform -translate-x-1/2 pointer-events-none"
                  style={{ left: `${Math.min(98, Math.max(2, racer.currentProgress))}%` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shadow-md ${
                      isUser
                        ? 'bg-[#00c2e8] text-white ring-2 ring-cyan-200'
                        : isFinished
                        ? 'bg-[#8b52ec] text-white'
                        : 'bg-[#00677d] text-white'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
