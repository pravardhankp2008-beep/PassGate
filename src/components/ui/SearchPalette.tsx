import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/useApp';
import { Search, Trophy, Code2, Users, Calendar, BarChart2, Zap, ArrowRight, X } from 'lucide-react';
import { Badge } from './Badge';

export const SearchPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    problems,
    selectProblem,
    setActiveTab,
    racers,
    setSelectedRacerModal,
    runTests,
    submitSolution,
    resetRace
  } = useApp();

  const [query, setQuery] = useState('');

  const filteredProblems = useMemo(() => {
    if (!query) return problems.slice(0, 3);
    return problems.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.difficulty.toLowerCase().includes(query.toLowerCase())
    );
  }, [problems, query]);

  const filteredRacers = useMemo(() => {
    if (!query) return [];
    return racers.filter(
      (r) =>
        r.handle.toLowerCase().includes(query.toLowerCase()) ||
        r.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [racers, query]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0d0e1e]/40 backdrop-blur-md"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Container (Hydroglass Elevation 3) */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/95 rounded-3xl shadow-[0_20px_48px_-8px_rgba(0,194,232,0.22),0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 text-[#191a2b]">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-indigo-100/80 bg-white/60">
          <Search className="w-5 h-5 text-[#00c2e8] shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a command, problem, or racer handle... (e.g. 'warp', 'neokrypton', 'arena')"
            className="w-full bg-transparent text-[#0d0e1e] placeholder-[#6c797e] text-sm focus:outline-none font-sans font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-full text-[#6c797e] hover:text-[#0d0e1e] hover:bg-indigo-50 ml-2 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Nav Actions */}
          <div>
            <div className="text-[10px] font-bold text-[#5a647e] uppercase tracking-wider px-2 mb-2 font-mono">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'arena', label: 'Live Arena', icon: <Zap className="w-3.5 h-3.5 text-[#00c2e8]" /> },
                { id: 'problems', label: 'Challenges', icon: <Code2 className="w-3.5 h-3.5 text-[#7135d1]" /> },
                { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-3.5 h-3.5 text-[#b45309]" /> },
                { id: 'squad', label: 'Squad Hub', icon: <Users className="w-3.5 h-3.5 text-[#7135d1]" /> },
                { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-3.5 h-3.5 text-[#006b5d]" /> },
                { id: 'telemetry', label: 'Telemetry', icon: <BarChart2 className="w-3.5 h-3.5 text-rose-500" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-full bg-indigo-50/70 hover:bg-white text-[#2d314e] hover:text-[#0d0e1e] text-left transition-all border border-indigo-100/70 shadow-sm hover:shadow-md cursor-pointer"
                >
                  {item.icon}
                  <span className="font-semibold truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Problem Matches */}
          <div>
            <div className="text-[10px] font-bold text-[#5a647e] uppercase tracking-wider px-2 mb-2 flex justify-between items-center font-mono">
              <span>Problems &amp; Challenges</span>
              <span className="text-[#6c797e]">{filteredProblems.length} available</span>
            </div>
            <div className="space-y-1">
              {filteredProblems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => {
                    selectProblem(prob);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-50/70 cursor-pointer transition-all group border border-transparent hover:border-cyan-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-[#00c2e8] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[#0d0e1e] font-semibold group-hover:text-[#00677d] transition-colors">
                        {prob.title}
                      </div>
                      <div className="text-[11px] text-[#5a647e]">{prob.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge difficulty={prob.difficulty} size="sm">
                      {prob.difficulty}
                    </Badge>
                    <span className="text-[#b45309] font-mono font-bold">+{prob.points} pt</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6c797e] group-hover:text-[#00677d] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Racer Matches if query */}
          {filteredRacers.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-[#5a647e] uppercase tracking-wider px-2 mb-2 font-mono">
                Competitors
              </div>
              <div className="space-y-1">
                {filteredRacers.map((racer) => (
                  <div
                    key={racer.id}
                    onClick={() => {
                      setSelectedRacerModal(racer);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/70 cursor-pointer transition-all group border border-transparent hover:border-purple-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={racer.avatar}
                        alt={racer.handle}
                        className="w-6 h-6 rounded-full object-cover border border-indigo-200 shadow-sm"
                      />
                      <div>
                        <span className="text-[#0d0e1e] font-bold">@{racer.handle}</span>
                        <span className="text-[#6c797e] ml-2">({racer.name})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono font-bold">
                      <span className="text-[#00677d]">Rank #{racer.rank}</span>
                      <span className="text-[#7135d1]">{racer.rating} ELO</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Triggers */}
          <div>
            <div className="text-[10px] font-bold text-[#5a647e] uppercase tracking-wider px-2 mb-2 font-mono">
              Simulation &amp; Arena Commands
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  runTests();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-50/80 text-[#2d314e] hover:text-[#00677d] transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Zap className="w-3.5 h-3.5 text-[#00c2e8]" />
                  <span>Execute Test Suite in Sandbox</span>
                </div>
                <span className="text-[#6c797e] font-mono text-[10px]">Ctrl+Enter</span>
              </button>
              <button
                onClick={() => {
                  submitSolution();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50/80 text-[#2d314e] hover:text-[#006b5d] transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Trophy className="w-3.5 h-3.5 text-[#00c8af]" />
                  <span>Submit Solution to ByteRace Matrix</span>
                </div>
                <span className="text-[#6c797e] font-mono text-[10px]">Submit</span>
              </button>
              <button
                onClick={() => {
                  resetRace();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/80 text-[#2d314e] hover:text-rose-600 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 font-medium">
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span>Reset Competitor Grid Simulation</span>
                </div>
                <span className="text-[#6c797e] font-mono text-[10px]">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-5 py-3 bg-indigo-50/60 border-t border-indigo-100/80 text-[11px] text-[#5a647e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-2 py-0.5 bg-white rounded border border-indigo-200 text-[#0d0e1e] font-mono font-bold">ESC</kbd> to close</span>
            <span><kbd className="px-2 py-0.5 bg-white rounded border border-indigo-200 text-[#0d0e1e] font-mono font-bold">↑↓</kbd> to navigate</span>
          </div>
          <span className="text-[#00677d] font-mono font-bold">ByteRace Command Engine</span>
        </div>
      </div>
    </div>
  );
};
