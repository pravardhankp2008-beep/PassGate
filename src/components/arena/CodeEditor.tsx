import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import type { Language } from '../../types';
import { Copy, RotateCcw, Check, Sparkles } from 'lucide-react';

export const CodeEditor: React.FC = () => {
  const { 
    selectedLanguage, 
    setSelectedLanguage, 
    userCode, 
    setUserCode, 
    activeProblem,
    addToast 
  } = useApp();

  const [copied, setCopied] = useState(false);

  const languages: { id: Language; label: string; icon: string }[] = [
    { id: 'typescript', label: 'TypeScript', icon: 'TS' },
    { id: 'python', label: 'Python 3.12', icon: 'PY' },
    { id: 'rust', label: 'Rust 1.80', icon: 'RS' },
    { id: 'cpp', label: 'C++20', icon: 'C++' },
    { id: 'go', label: 'Go 1.23', icon: 'GO' }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    addToast('info', 'Code copied to clipboard', 'Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const starter = activeProblem.starterCode[selectedLanguage] || '';
    setUserCode(starter);
    addToast('info', 'Restored starter solution skeleton', 'Editor Reset');
  };

  const lines = userCode.split('\n');

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/95 shadow-[0_12px_32px_-4px_rgba(45,49,78,0.06),0_4px_12px_0_rgba(0,194,232,0.04)] flex flex-col h-full overflow-hidden text-[#191a2b]">
      {/* Editor Control Bar */}
      <div className="px-5 py-3 bg-white/60 border-b border-indigo-100/80 flex items-center justify-between gap-3 flex-wrap">
        {/* Language selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/15 text-[#00677d] border border-cyan-400/40 shadow-sm'
                    : 'text-[#5a647e] hover:text-[#0d0e1e] hover:bg-indigo-50/60'
                }`}
              >
                <span className="text-[10px] opacity-70">{lang.icon}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            title="Copy code"
            className="px-2.5 py-1 rounded-full text-[#5a647e] hover:text-[#0d0e1e] hover:bg-indigo-50 border border-indigo-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00c8af]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset code template"
            className="px-2.5 py-1 rounded-full text-[#5a647e] hover:text-rose-600 hover:bg-rose-50 border border-indigo-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden font-mono text-sm relative bg-[#0b101e]">
        {/* Line numbers column */}
        <div className="w-12 py-3 bg-[#080d19] text-[#475569] text-right pr-3 select-none border-r border-slate-800/80 leading-6 font-mono text-xs">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Textarea Input */}
        <div className="flex-1 relative overflow-auto">
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-3 bg-transparent text-slate-100 focus:outline-none resize-none leading-6 font-mono text-xs sm:text-sm whitespace-pre tab-4 selection:bg-[#00c2e8]/30 selection:text-white"
            placeholder="Write your optimized solution here..."
          />
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="px-5 py-2.5 bg-white/70 border-t border-indigo-100/80 flex items-center justify-between text-[11px] font-mono text-[#5a647e]">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>Tab Size: 2</span>
          <span>{lines.length} lines</span>
          <span>{userCode.length} chars</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#00677d] font-bold">
          <Sparkles className="w-3 h-3 text-[#00c2e8]" />
          <span>Vite Sandboxed V8 Engine</span>
        </div>
      </div>
    </div>
  );
};
