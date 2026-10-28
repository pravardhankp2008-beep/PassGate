import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import { Play, Send, CheckCircle2, XCircle, Clock, HardDrive, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';

export const TestRunnerConsole: React.FC = () => {
  const { 
    activeProblem, 
    testResults, 
    isRunningTests, 
    runTests, 
    isSubmitting, 
    submitSolution 
  } = useApp();

  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [activeView, setActiveView] = useState<'cases' | 'console'>('cases');

  const testCases = activeProblem.testCases;
  const currentResult = testResults[activeTestCaseIdx];

  const totalPassed = testResults.filter((r) => r.passed).length;
  const hasRun = testResults.length > 0;

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/95 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)] flex flex-col h-full overflow-hidden text-[#191a2b]">
      {/* Console Top Toolbar */}
      <div className="px-5 py-3 bg-white/60 border-b border-indigo-100/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-indigo-50/80 rounded-full border border-indigo-100">
          <button
            onClick={() => setActiveView('cases')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeView === 'cases'
                ? 'bg-white text-[#00677d] shadow-sm'
                : 'text-[#5a647e] hover:text-[#0d0e1e]'
            }`}
          >
            Test Cases ({testCases.length})
          </button>
          <button
            onClick={() => setActiveView('console')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'console'
                ? 'bg-white text-[#00677d] shadow-sm'
                : 'text-[#5a647e] hover:text-[#0d0e1e]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Stdout Logs</span>
          </button>
        </div>

        {/* Action Run & Submit buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={runTests}
            isLoading={isRunningTests}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current text-[#00c2e8]" />}
          >
            <span>Run Tests</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={submitSolution}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            <span>Submit Solution</span>
          </Button>
        </div>
      </div>

      {/* Main Console Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
        {activeView === 'cases' ? (
          <>
            {/* Case selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {testCases.map((tc, idx) => {
                const res = testResults[idx];
                const isSelected = activeTestCaseIdx === idx;

                return (
                  <button
                    key={tc.id}
                    onClick={() => setActiveTestCaseIdx(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-[#00677d] shadow-sm'
                        : 'bg-white/80 border-indigo-100 text-[#5a647e] hover:text-[#0d0e1e]'
                    }`}
                  >
                    {res ? (
                      res.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00c8af]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      )
                    ) : null}
                    <span>Case {idx + 1}</span>
                    {tc.isSecret && (
                      <span className="text-[10px] text-[#b45309] font-normal">[Hidden]</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Overall Run Status Banner */}
            {hasRun && (
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between font-sans ${
                  totalPassed === testResults.length
                    ? 'bg-teal-50 border-teal-300 text-[#006b5d]'
                    : 'bg-amber-50 border-amber-300 text-[#b45309]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {totalPassed === testResults.length ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00c8af]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#f59e0b]" />
                  )}
                  <span className="font-extrabold text-sm">
                    {totalPassed === testResults.length
                      ? 'All Tests Passed Successfully!'
                      : `${totalPassed} of ${testResults.length} Tests Passed`}
                  </span>
                </div>
                {currentResult && (
                  <div className="flex items-center gap-3 text-[11px] font-mono font-semibold opacity-90">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00c2e8]" />
                      {currentResult.executionTimeMs}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-[#8b52ec]" />
                      {currentResult.memoryUsedMb}MB
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Input & Output Panels for Active Case */}
            <div className="space-y-3">
              <div>
                <div className="text-[#5a647e] text-[11px] uppercase tracking-wider mb-1 font-bold font-sans">
                  Input Vector:
                </div>
                <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-[#0d0e1e] font-semibold">
                  {testCases[activeTestCaseIdx]?.input}
                </div>
              </div>

              <div>
                <div className="text-[#5a647e] text-[11px] uppercase tracking-wider mb-1 font-bold font-sans">
                  Expected Output:
                </div>
                <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-[#006b5d] font-bold">
                  {testCases[activeTestCaseIdx]?.expectedOutput}
                </div>
              </div>

              {currentResult && (
                <div>
                  <div className="text-[#5a647e] text-[11px] uppercase tracking-wider mb-1 flex items-center justify-between font-bold font-sans">
                    <span>Actual Sandbox Return:</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentResult.passed
                          ? 'bg-teal-100 text-[#006b5d]'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {currentResult.passed ? 'MATCH' : 'MISMATCH'}
                    </span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      currentResult.passed
                        ? 'bg-teal-50/60 border-teal-200 text-[#004e43] font-bold'
                        : 'bg-rose-50/60 border-rose-200 text-rose-800'
                    }`}
                  >
                    {currentResult.actual}
                  </div>

                  {currentResult.error && (
                    <div className="mt-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {currentResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Console Logs View */
          <div className="p-4 bg-[#0b101e] rounded-2xl border border-slate-800 text-slate-300 space-y-2 h-full">
            <div className="text-[#00c2e8] font-bold">=== ByteRace Sandboxed V8 Node Runner ===</div>
            <div className="text-[#64748b]">[SYSTEM] Initializing memory limits at 256MB...</div>
            <div className="text-[#64748b]">[SYSTEM] Compiling solution bytecode target: ES2024</div>
            {hasRun ? (
              <>
                <div className="text-[#00c8af] font-semibold">
                  [SUCCESS] Execution completed in {currentResult?.executionTimeMs || 8}ms.
                </div>
                <div className="text-slate-400">
                  [TELEMETRY] Branch prediction accuracy: 98.4%
                </div>
                <div className="text-slate-400">
                  [HEAP] Retained heap memory footprint: {currentResult?.memoryUsedMb || 24}MB
                </div>
              </>
            ) : (
              <div className="text-[#64748b] italic">
                Press "Run Tests" or Ctrl+Enter to initiate sandbox execution logs.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
