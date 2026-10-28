import React from 'react';
import { useApp } from '../../context/useApp';
import { Users, UserPlus } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const SquadHub: React.FC = () => {
  const { team, setIsInviteModalOpen } = useApp();

  return (
    <div className="space-y-6 text-[#191a2b]">
      {/* Squad Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00c2e8] to-[#8b52ec] flex items-center justify-center text-3xl shadow-[0_8px_20px_rgba(0,194,232,0.35)] text-white">
              {team.logo}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e1e] font-sans tracking-tight">
                  {team.name}
                </h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100/70 text-[#00677d] border border-cyan-300">
                  [{team.tag}]
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#5a647e] font-semibold">
                <Badge division={team.division} size="sm">
                  {team.division}
                </Badge>
                <span>•</span>
                <span>4 / 6 Roster Slots Filled</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsInviteModalOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Invite Teammate
            </Button>
          </div>
        </div>
      </div>

      {/* Squad Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white/80 rounded-3xl border border-indigo-100 shadow-sm text-center font-mono">
          <div className="text-[#6c797e] text-xs uppercase font-sans font-bold">Global Squad Rank</div>
          <div className="text-2xl font-black text-[#b45309] mt-1 font-sans">
            #{team.globalRank}
          </div>
        </div>
        <div className="p-4 bg-white/80 rounded-3xl border border-indigo-100 shadow-sm text-center font-mono">
          <div className="text-[#6c797e] text-xs uppercase font-sans font-bold">Cumulative Squad Pts</div>
          <div className="text-2xl font-black text-[#00677d] mt-1 font-sans">
            {team.totalPoints.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-white/80 rounded-3xl border border-indigo-100 shadow-sm text-center font-mono">
          <div className="text-[#6c797e] text-xs uppercase font-sans font-bold">Relay Win Rate</div>
          <div className="text-2xl font-black text-[#006b5d] mt-1 font-sans">
            {team.winRate}%
          </div>
        </div>
        <div className="p-4 bg-white/80 rounded-3xl border border-indigo-100 shadow-sm text-center font-mono">
          <div className="text-[#6c797e] text-xs uppercase font-sans font-bold">Active Stage Heat</div>
          <div className="text-2xl font-black text-[#7135d1] mt-1 font-sans">
            Heat #4
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#0d0e1e] font-sans flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00c2e8]" />
            <span>Active Team Roster</span>
          </h2>
          <span className="text-xs text-[#5a647e] font-mono font-semibold">
            {team.members.length} members enlisted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="bg-white/75 border border-white/95 hover:border-cyan-300 rounded-3xl p-5 hover:bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.handle}
                    className="w-12 h-12 rounded-2xl object-cover border border-indigo-100 shadow-sm"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === 'racing'
                        ? 'bg-[#00c8af] animate-ping'
                        : member.status === 'online'
                        ? 'bg-[#00c2e8]'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#0d0e1e] font-sans">
                      @{member.handle}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#5a647e] border border-indigo-100">
                      {member.role}
                    </span>
                  </div>
                  <div className="text-xs text-[#5a647e] font-mono font-semibold flex items-center gap-2">
                    <span>{member.rating} ELO</span>
                    <span>•</span>
                    <span className="text-[#00677d]">+{member.contributions.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    member.status === 'racing'
                      ? 'bg-teal-100 text-[#006b5d] border border-teal-300'
                      : member.status === 'online'
                      ? 'bg-cyan-100 text-[#00677d] border border-cyan-300'
                      : 'bg-indigo-50 text-[#6c797e]'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
