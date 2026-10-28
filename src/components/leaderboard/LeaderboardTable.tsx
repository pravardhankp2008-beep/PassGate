import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/useApp';
import type { Division } from '../../types';
import { Trophy, TrendingUp, TrendingDown, Minus, Search, Flame, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const LeaderboardTable: React.FC = () => {
  const { racers, setSelectedRacerModal } = useApp();

  const [selectedDivision, setSelectedDivision] = useState<Division>('All');
  const [search, setSearch] = useState('');

  const divisions: Division[] = ['All', 'Pro Division', 'University', 'Rookie'];

  const filteredRacers = useMemo(() => {
    return racers
      .filter((r) => {
        const matchesDiv = selectedDivision === 'All' || r.division === selectedDivision;
        const matchesSearch =
          r.handle.toLowerCase().includes(search.toLowerCase()) ||
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.country.toLowerCase().includes(search.toLowerCase());
        return matchesDiv && matchesSearch;
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [racers, selectedDivision, search]);

  return (
    <div className="space-y-6 text-[#191a2b]">
      {/* Leaderboard Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)]">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 text-[#b45309] border border-amber-300 shadow-sm">
              <Trophy className="w-4 h-4 text-[#f59e0b]" />
            </span>
            <span className="text-xs font-mono text-[#b45309] uppercase tracking-wider font-bold">
              Global Standings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e1e] font-sans tracking-tight">
            BYTERACE 2026 LEADERBOARD
          </h1>
          <p className="text-sm text-[#5a647e]">
            Real-time verified standings across continental brackets, Elo rating updates, and sprint points.
          </p>
        </div>
      </div>

      {/* Division Filters & Search */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Division tabs */}
        <div className="flex items-center gap-1.5 bg-indigo-50/70 p-1 rounded-full border border-indigo-200/60 overflow-x-auto w-full md:w-auto">
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDivision === div
                  ? 'bg-white text-[#00677d] shadow-sm'
                  : 'text-[#5a647e] hover:text-[#0d0e1e]'
              }`}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#6c797e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search competitor or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-indigo-50/60 border border-indigo-200/80 rounded-full pl-10 pr-4 py-2 text-xs text-[#0d0e1e] placeholder-[#6c797e] focus:outline-none focus:border-[#00c2e8] font-sans font-medium"
          />
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50/80 border-b border-indigo-100 text-[11px] font-sans font-bold text-[#5a647e] uppercase tracking-wider">
                <th className="py-4 px-4 w-16 text-center">Rank</th>
                <th className="py-4 px-4">Competitor</th>
                <th className="py-4 px-4">Division</th>
                <th className="py-4 px-4 text-right">Rating</th>
                <th className="py-4 px-4 text-right">Solved</th>
                <th className="py-4 px-4 text-right">Total Points</th>
                <th className="py-4 px-4 text-center">Streak</th>
                <th className="py-4 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/80 text-xs font-sans">
              {filteredRacers.map((racer, index) => {
                const rankDelta = racer.previousRank - racer.rank;
                const isUser = racer.id === 'racer-user';

                return (
                  <tr
                    key={racer.id}
                    className={`hover:bg-cyan-50/40 transition-colors ${
                      isUser ? 'bg-cyan-50/60 font-semibold' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono">
                        <span
                          className={`font-extrabold text-sm ${
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
                        {rankDelta > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5 text-[#00c8af]" />
                        ) : rankDelta < 0 ? (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <Minus className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </td>

                    {/* Competitor Profile Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={racer.avatar}
                            alt={racer.handle}
                            className={`w-9 h-9 rounded-full object-cover border ${
                              isUser ? 'border-[#00c2e8] ring-2 ring-cyan-200' : 'border-indigo-100'
                            }`}
                          />
                          <span className="absolute -bottom-1 -right-1 text-xs">
                            {racer.flag}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-[#0d0e1e]">
                            <span>{racer.handle}</span>
                            {isUser && (
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500 text-white font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6c797e]">{racer.name} • {racer.country}</div>
                        </div>
                      </div>
                    </td>

                    {/* Division */}
                    <td className="py-4 px-4">
                      <Badge division={racer.division} size="sm">
                        {racer.division}
                      </Badge>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-[#2d314e]">
                      {racer.rating}
                    </td>

                    {/* Solved Count */}
                    <td className="py-4 px-4 text-right font-mono font-semibold text-[#5a647e]">
                      {racer.solvedCount}
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-4 text-right font-mono font-extrabold text-[#00677d]">
                      {racer.totalPoints.toLocaleString()}
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#b45309] border border-amber-300 text-xs font-bold">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {racer.streak}
                      </span>
                    </td>

                    {/* Inspect Profile */}
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRacerModal(racer)}
                        leftIcon={<Eye className="w-3.5 h-3.5 text-[#00c2e8]" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
