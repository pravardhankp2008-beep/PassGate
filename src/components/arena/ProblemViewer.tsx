import React from 'react';
import { useApp } from '../../context/useApp';
import { Badge } from '../ui/Badge';
import { Clock, Cpu, Award, CheckCircle2 } from 'lucide-react';

export const ProblemViewer: React.FC = () => {
  const { activeProblem, problems, selectProblem } = useApp();

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/95 p-6 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)] flex flex-col h-full overflow-y-auto text-[#191a2b]">
      {/* Problem Quick Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-indigo-100/80 scrollbar-none">
        {problems.map((p) => {
          const isSelected = p.id === activeProblem.id;
          return (
            <button
              key={p.id}
              onClick={() => selectProblem(p)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/15 text-[#00677d] border border-cyan-400/40 shadow-sm'
                  : 'bg-white/70 text-[#5a647e] hover:text-[#0d0e1e] hover:bg-white border border-indigo-100'
              }`}
            >
              {p.isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-[#00c8af]" />}
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Problem Header */}
      <div className="space-y-3 pb-4 border-b border-indigo-100/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-extrabold text-[#0d0e1e] font-sans tracking-tight flex items-center gap-2">
            <span>{activeProblem.title}</span>
            {activeProblem.isSolved && (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#006b5d] border border-teal-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> SOLVED
              </span>
            )}
          </h1>

          <div className="flex items-center gap-2">
            <Badge difficulty={activeProblem.difficulty}>
              {activeProblem.difficulty}
            </Badge>
            <Badge variant="purple">
              {activeProblem.category}
            </Badge>
          </div>
        </div>

        {/* Specs bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold text-[#5a647e]">
          <div className="flex items-center gap-1.5 text-[#b45309]">
            <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>+{activeProblem.points} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00677d]">
            <Clock className="w-3.5 h-3.5 text-[#00c2e8]" />
            <span>Limit: {activeProblem.timeLimitMs}ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#7135d1]">
            <Cpu className="w-3.5 h-3.5 text-[#8b52ec]" />
            <span>Mem: {activeProblem.memoryLimitMb}MB</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#5a647e]">
            <span>Pass Rate: {activeProblem.acceptanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="py-4 space-y-4 text-[#2d314e] text-sm leading-relaxed">
        <div className="whitespace-pre-line">{activeProblem.description}</div>

        {/* Examples */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-[#5a647e] uppercase tracking-wider font-mono">
            Test Examples
          </h3>
          {activeProblem.examples.map((ex, idx) => (
            <div
              key={idx}
              className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100/90 space-y-2 font-mono text-xs shadow-inner"
            >
              <div className="text-[#00677d] font-bold">Example {idx + 1}:</div>
              <div>
                <span className="text-[#6c797e] font-sans font-bold">Input: </span>
                <span className="text-[#0d0e1e] font-semibold">{ex.input}</span>
              </div>
              <div>
                <span className="text-[#6c797e] font-sans font-bold">Output: </span>
                <span className="text-[#006b5d] font-bold">{ex.output}</span>
              </div>
              {ex.explanation && (
                <div className="text-[11px] text-[#5a647e] font-sans pt-1.5 border-t border-indigo-100">
                  <span className="text-[#6c797e] font-bold">Explanation: </span>
                  {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Constraints */}
        {activeProblem.constraints && activeProblem.constraints.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-[#5a647e] uppercase tracking-wider font-mono">
              Constraints
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs font-mono text-[#5a647e]">
              {activeProblem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
