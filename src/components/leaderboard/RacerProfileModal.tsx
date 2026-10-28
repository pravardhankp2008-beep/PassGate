import React from 'react';
import { useApp } from '../../context/useApp';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Trophy, Crosshair } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const RacerProfileModal: React.FC = () => {
  const { selectedRacerModal, setSelectedRacerModal } = useApp();

  if (!selectedRacerModal) return null;

  const racer = selectedRacerModal;

  return (
    <Modal
      isOpen={!!selectedRacerModal}
      onClose={() => setSelectedRacerModal(null)}
      title={
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#f59e0b]" />
          <span className="font-extrabold text-[#0d0e1e]">Competitor Telemetry Dossier</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6 text-[#191a2b]">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-indigo-50/70 p-5 rounded-3xl border border-indigo-100">
          <div className="relative">
            <img
              src={racer.avatar}
              alt={racer.handle}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#00c2e8] shadow-md shadow-cyan-500/20"
            />
            <span className="absolute -bottom-1 -right-1 text-lg">
              {racer.flag}
            </span>
          </div>

          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-[#0d0e1e]">{racer.handle}</h2>
              <Badge division={racer.division} size="sm">
                {racer.division}
              </Badge>
            </div>
            <p className="text-xs text-[#5a647e] font-medium">{racer.name} • {racer.country}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              {racer.badges.map((b, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7135d1] border border-purple-200"
                >
                  ★ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Rank Badge Box */}
          <div className="bg-white border border-indigo-100 rounded-2xl p-3.5 text-center min-w-[7rem] shadow-sm">
            <div className="text-[10px] text-[#6c797e] font-sans font-bold">GLOBAL RANK</div>
            <div className="text-2xl font-black text-[#b45309]">#{racer.rank}</div>
            <div className="text-xs font-mono text-[#00677d] font-bold">{racer.rating} ELO</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center font-mono">
            <div className="text-[#6c797e] text-[10px] uppercase font-sans font-bold">Challenges Solved</div>
            <div className="text-lg font-extrabold text-[#0d0e1e] mt-0.5">{racer.solvedCount}</div>
          </div>
          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center font-mono">
            <div className="text-[#6c797e] text-[10px] uppercase font-sans font-bold">Sprint Points</div>
            <div className="text-lg font-extrabold text-[#00677d] mt-0.5">{racer.totalPoints.toLocaleString()}</div>
          </div>
          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center font-mono">
            <div className="text-[#6c797e] text-[10px] uppercase font-sans font-bold">Current Streak</div>
            <div className="text-lg font-extrabold text-[#b45309] mt-0.5">{racer.streak} Wins 🔥</div>
          </div>
          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center font-mono">
            <div className="text-[#6c797e] text-[10px] uppercase font-sans font-bold">Live Speed</div>
            <div className="text-lg font-extrabold text-[#006b5d] mt-0.5">{racer.currentSpeedWpm} WPM</div>
          </div>
        </div>

        {/* Skill Matrix Telemetry Breakdown */}
        <div className="bg-white/80 p-5 rounded-3xl border border-indigo-100 space-y-3 shadow-sm">
          <div className="text-xs font-bold text-[#0d0e1e] uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Crosshair className="w-4 h-4 text-[#00c2e8]" />
            <span>Benchmark Performance Attributes</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#5a647e] font-sans font-semibold">Algorithmic Velocity</span>
                <span className="text-[#00677d] font-bold">94%</span>
              </div>
              <ProgressBar progress={94} color="cyan" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#5a647e] font-sans font-semibold">Space Complexity Optimization</span>
                <span className="text-[#7135d1] font-bold">88%</span>
              </div>
              <ProgressBar progress={88} color="purple" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#5a647e] font-sans font-semibold">Test Vector First-Pass Yield</span>
                <span className="text-[#006b5d] font-bold">96%</span>
              </div>
              <ProgressBar progress={96} color="emerald" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
