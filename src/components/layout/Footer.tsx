import React from 'react';
import { Wifi, Activity, Terminal, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-indigo-100/80 bg-white/75 backdrop-blur-xl text-xs text-[#5a647e] py-3.5 px-4 sm:px-6 shadow-[0_-4px_20px_rgba(45,49,78,0.02)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-[#006b5d] font-semibold">
            <Wifi className="w-3.5 h-3.5 text-[#00c8af]" />
            <span>RTT 14ms (Frankfurt Server)</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[#2d314e] font-semibold">
            <Activity className="w-3.5 h-3.5 text-[#00c2e8]" />
            <span>2,418 Racers Connected</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-[#7135d1] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8b52ec]" />
            <span>BFT Anti-Cheat Active</span>
          </div>
        </div>

        {/* Brand & Version */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-[11px] text-[#2d314e] font-semibold">
            <Terminal className="w-3 h-3 text-[#00c2e8]" />
            <span>ByteRace Engine v2026.4</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[#5a647e]">© 2026 Global Esports Sprint League</span>
        </div>
      </div>
    </footer>
  );
};
