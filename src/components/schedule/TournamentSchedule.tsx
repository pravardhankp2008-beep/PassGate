import React from 'react';
import { mockSchedule } from '../../data/mockSchedule';
import { Calendar, Trophy, Users, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/useApp';

export const TournamentSchedule: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="space-y-6 text-[#191a2b]">
      {/* Schedule Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)]">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-50 text-[#006b5d] border border-teal-300 shadow-sm">
              <Calendar className="w-4 h-4 text-[#00c8af]" />
            </span>
            <span className="text-xs font-mono text-[#006b5d] uppercase tracking-wider font-bold">
              Tournament Roadmap
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e1e] font-sans tracking-tight">
            BYTERACE 2026 ROADMAP &amp; TIMELINE
          </h1>
          <p className="text-sm text-[#5a647e]">
            From 10,000 algorithmic contenders to the ultimate World Champion. Total prize pool: <strong className="text-[#b45309] font-bold">$750,000 USD</strong>.
          </p>
        </div>
      </div>

      {/* Stage Cards Timeline */}
      <div className="space-y-4">
        {mockSchedule.map((stage, idx) => {
          const isLive = stage.status === 'live';
          const isCompleted = stage.status === 'completed';

          return (
            <div
              key={stage.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all relative overflow-hidden ${
                isLive
                  ? 'bg-white/90 border-cyan-400/60 shadow-[0_12px_32px_-4px_rgba(0,194,232,0.2)] ring-1 ring-cyan-400/30'
                  : isCompleted
                  ? 'bg-white/60 border-indigo-100/70 opacity-80'
                  : 'bg-white/75 border-white/95 shadow-sm'
              }`}
            >
              {/* Live glow ribbon */}
              {isLive && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-l from-[#00c2e8] to-[#8b52ec] text-white font-bold font-mono text-[10px] tracking-wider uppercase rounded-bl-2xl shadow-md">
                  LIVE ARENA ACTIVE
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#6c797e]">STAGE 0{idx + 1}</span>
                    <h2 className="text-lg font-extrabold text-[#0d0e1e] font-sans">{stage.title}</h2>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        isLive
                          ? 'bg-cyan-100 text-[#00677d] border border-cyan-300 animate-pulse'
                          : isCompleted
                          ? 'bg-indigo-50 text-[#5a647e]'
                          : 'bg-purple-100 text-[#7135d1] border border-purple-200'
                      }`}
                    >
                      {stage.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#5a647e] leading-relaxed max-w-2xl font-normal">
                    {stage.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold text-[#6c797e] pt-1">
                    <span className="flex items-center gap-1.5 text-[#b45309]">
                      <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" />
                      <span>{stage.prizePool}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#5a647e]">
                      <Calendar className="w-3.5 h-3.5 text-[#00c2e8]" />
                      <span>{stage.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#5a647e]">
                      <Users className="w-3.5 h-3.5 text-[#8b52ec]" />
                      <span>{stage.participantsCount.toLocaleString()} Racers</span>
                    </span>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="shrink-0">
                  {isLive ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab('arena')}
                      leftIcon={<Zap className="w-4 h-4" />}
                    >
                      Join Live Arena
                    </Button>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#006b5d] bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
                      <CheckCircle2 className="w-4 h-4 text-[#00c8af]" />
                      <span>Archive Verified</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      Locked Stage
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
