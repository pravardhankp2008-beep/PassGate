import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import type { ThemeMode } from '../../context/context';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Settings, RotateCcw } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    themeMode,
    setThemeMode,
    simulationSpeed,
    setSimulationSpeed,
    addToast
  } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vimMode, setVimMode] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);

  const handleResetData = () => {
    if (window.confirm('Reset all ByteRace 2026 local storage state back to defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cyan-50 flex items-center justify-center border border-cyan-100/60 shadow-xs">
            <Settings className="w-4 h-4 text-cyan-600" />
          </div>
          <span className="text-[#0d0e1e] font-bold">ByteRace Arena Preferences</span>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Theme Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#4a5073] uppercase tracking-wider block">
            Visual Theme & Palette
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'cyber', label: 'Hydroglass Light', desc: 'Specular Cyan & Bio-Mint', glow: 'border-cyan-400 ring-2 ring-cyan-400/25 bg-white/95' },
              { id: 'matrix', label: 'Cyber Lilac', desc: 'Tactile Lavender Glass', glow: 'border-purple-400 ring-2 ring-purple-400/25 bg-white/95' },
              { id: 'stealth', label: 'Deep Cyber', desc: 'Midnight Obsidian Contrast', glow: 'border-slate-400 ring-2 ring-slate-400/25 bg-white/95' }
            ].map((theme) => {
              const isSelected = themeMode === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setThemeMode(theme.id as ThemeMode);
                    addToast('info', `Switched theme to ${theme.label}`, 'Theme');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? `${theme.glow} shadow-sm`
                      : 'bg-white/40 border-black/5 hover:border-cyan-200 hover:bg-white/70 text-[#2d314e]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#0d0e1e]">{theme.label}</div>
                  <div className="text-[10px] text-[#6b7294] mt-0.5">{theme.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bot Simulation Rate */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#4a5073] uppercase tracking-wider block">
            AI Competitor Simulation Velocity
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setSimulationSpeed('normal');
                addToast('info', 'Simulation speed set to Normal', 'Sim Speed');
              }}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                simulationSpeed === 'normal'
                  ? 'bg-cyan-50/80 border-cyan-400 text-cyan-900 shadow-sm ring-2 ring-cyan-400/20'
                  : 'bg-white/50 border-black/5 text-[#4a5073] hover:bg-white/80'
              }`}
            >
              <div className="text-xs font-bold">Standard Pace (2.5s)</div>
              <div className="text-[10px] text-[#6b7294] mt-0.5">Realistic tournament typing speed</div>
            </button>
            <button
              onClick={() => {
                setSimulationSpeed('fast');
                addToast('info', 'Simulation speed set to Fast Sprint', 'Sim Speed');
              }}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                simulationSpeed === 'fast'
                  ? 'bg-cyan-50/80 border-cyan-400 text-cyan-900 shadow-sm ring-2 ring-cyan-400/20'
                  : 'bg-white/50 border-black/5 text-[#4a5073] hover:bg-white/80'
              }`}
            >
              <div className="text-xs font-bold">Turbo Sprint (1.2s)</div>
              <div className="text-[10px] text-[#6b7294] mt-0.5">High-intensity esports velocity</div>
            </button>
          </div>
        </div>

        {/* Toggle Preferences */}
        <div className="space-y-3 pt-3 border-t border-black/5">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/40 transition-colors">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#0d0e1e]">Terminal & Match Audio FX</div>
              <div className="text-[11px] text-[#6b7294]">Play mechanical clicks & pass chime notifications</div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEnabled ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-inner' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${
                  soundEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/40 transition-colors">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#0d0e1e]">Vim Keybindings Emulation</div>
              <div className="text-[11px] text-[#6b7294]">Modal editing navigation inside code editor</div>
            </div>
            <button
              onClick={() => setVimMode(!vimMode)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                vimMode ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-inner' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${
                  vimMode ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/40 transition-colors">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#0d0e1e]">Auto-Format Code on Test Run</div>
              <div className="text-[11px] text-[#6b7294]">Prettify code layout before sending to sandbox</div>
            </div>
            <button
              onClick={() => setAutoFormat(!autoFormat)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoFormat ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-inner' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${
                  autoFormat ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Clear Data Reset */}
        <div className="pt-4 border-t border-black/5 flex items-center justify-between">
          <button
            onClick={handleResetData}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Mock Database</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSettingsOpen(false)}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </Modal>
  );
};
