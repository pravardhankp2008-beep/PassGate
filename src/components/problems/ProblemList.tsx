import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/useApp';
import type { Difficulty } from '../../types';
import { Search, CheckCircle2, Award, Clock, ArrowRight, Filter, Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const ProblemList: React.FC = () => {
  const { problems, selectProblem } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved'>('All');

  const filteredProblems = useMemo(() => {
    return problems.filter((prob) => {
      const matchesSearch =
        prob.title.toLowerCase().includes(search.toLowerCase()) ||
        prob.category.toLowerCase().includes(search.toLowerCase());

      const matchesDiff =
        selectedDifficulty === 'All' || prob.difficulty === selectedDifficulty;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Solved' && prob.isSolved) ||
        (statusFilter === 'Unsolved' && !prob.isSolved);

      return matchesSearch && matchesDiff && matchesStatus;
    });
  }, [problems, search, selectedDifficulty, statusFilter]);

  const difficulties: ('All' | Difficulty)[] = ['All', 'Easy', 'Medium', 'Hard', 'Legendary'];

  return (
    <div className="space-y-6 text-[#191a2b]">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)]">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-50 text-[#00677d] border border-cyan-300 shadow-sm">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono text-[#00677d] uppercase tracking-wider font-bold">
              Tournament Gauntlet
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e1e] font-sans tracking-tight">
            CHALLENGE SPRINT CATALOG
          </h1>
          <p className="text-sm text-[#5a647e] leading-relaxed">
            Curated competitive algorithmic problems, distributed systems concurrency challenges, and cryptographic puzzles for ByteRace 2026.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/95 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6c797e] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by challenge name, algorithmic tag, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-indigo-50/60 border border-indigo-200/80 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#0d0e1e] placeholder-[#6c797e] focus:outline-none focus:border-[#00c2e8] focus:ring-2 focus:ring-cyan-100 transition-all font-sans font-medium"
            />
          </div>

          {/* Solved status filters */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-indigo-50/70 p-1 rounded-full border border-indigo-200/60">
            {(['All', 'Solved', 'Unsolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-[#00677d] shadow-sm'
                    : 'text-[#5a647e] hover:text-[#0d0e1e]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Pill Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-[#5a647e] flex items-center gap-1 font-mono font-semibold">
            <Filter className="w-3.5 h-3.5" /> Difficulty:
          </span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-gradient-to-r from-[#00c2e8] to-[#0098b8] text-white shadow-sm'
                  : 'bg-white/80 text-[#5a647e] hover:text-[#0d0e1e] border border-indigo-100 hover:border-indigo-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProblems.map((prob) => (
          <div
            key={prob.id}
            onClick={() => selectProblem(prob)}
            className="group bg-white/75 hover:bg-white backdrop-blur-xl border border-white/95 hover:border-cyan-300 rounded-3xl p-5 sm:p-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_12px_32px_-4px_rgba(0,194,232,0.18)] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Info */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-base font-extrabold text-[#0d0e1e] group-hover:text-[#00677d] transition-colors font-sans flex items-center gap-2">
                  {prob.title}
                </span>

                {prob.isSolved && (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-teal-100 text-[#006b5d] border border-teal-300 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SOLVED
                  </span>
                )}

                <Badge difficulty={prob.difficulty} size="sm">
                  {prob.difficulty}
                </Badge>

                <Badge variant="purple" size="sm">
                  {prob.category}
                </Badge>
              </div>

              <p className="text-xs text-[#5a647e] line-clamp-2 leading-relaxed">
                {prob.description}
              </p>

              {/* Specs */}
              <div className="flex items-center gap-4 text-xs font-mono font-semibold text-[#6c797e]">
                <span className="flex items-center gap-1 text-[#b45309]">
                  <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>+{prob.points} pts</span>
                </span>
                <span className="flex items-center gap-1 text-[#00677d]">
                  <Clock className="w-3.5 h-3.5 text-[#00c2e8]" />
                  <span>{prob.timeLimitMs}ms</span>
                </span>
                <span>Pass Rate: {prob.acceptanceRate}%</span>
                <span>{prob.testCases.length} Test Suites</span>
              </div>
            </div>

            {/* Right: Enter Arena CTA */}
            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <Button
                variant={prob.isSolved ? 'outline' : 'primary'}
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              >
                {prob.isSolved ? 'Review Code' : 'Enter Arena'}
              </Button>
            </div>
          </div>
        ))}

        {filteredProblems.length === 0 && (
          <div className="text-center py-12 bg-white/70 backdrop-blur-md rounded-3xl border border-indigo-100 text-[#5a647e] space-y-2">
            <div className="text-lg font-bold text-[#0d0e1e]">No challenges matched your query</div>
            <p className="text-xs text-[#6c797e]">Try adjusting your difficulty or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};
