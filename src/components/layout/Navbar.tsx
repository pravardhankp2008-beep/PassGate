import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import { 
  Zap, 
  Search, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  CheckCheck, 
  Clock, 
  ChevronDown
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { 
    userStats, 
    notifications, 
    markAllNotificationsRead, 
    markNotificationRead,
    setIsCommandPaletteOpen,
    setIsSettingsOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 28, seconds: 12 });

  // Live countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-2xl border-b border-indigo-100/80 shadow-[0_4px_24px_rgba(45,49,78,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#5a647e] hover:text-[#0d0e1e] hover:bg-indigo-50"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#00c2e8] to-[#8b52ec] flex items-center justify-center shadow-[0_8px_16px_rgba(0,194,232,0.35)]">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[#0d0e1e] font-sans">
                  BYTE<span className="bg-gradient-to-r from-[#00677d] to-[#00c2e8] bg-clip-text text-transparent">RACE</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-[#00677d] border border-cyan-400/40">
                  2026
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#5a647e] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c8af] animate-ping" />
                <span className="text-[#006b5d]">LIVE SPRINT</span>
                <span className="text-slate-300">•</span>
                <span className="hidden sm:inline">HEAT #4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live Sprint Countdown */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-100 shadow-[0_4px_12px_rgba(45,49,78,0.04)] backdrop-blur-md">
          <Clock className="w-4 h-4 text-[#00c2e8] animate-pulse" />
          <span className="text-xs text-[#5a647e] font-medium">Next Elimination Sprint:</span>
          <span className="font-mono text-xs font-bold text-[#00677d] tracking-wider">
            {String(countdown.hours).padStart(2, '0')}:
            {String(countdown.minutes).padStart(2, '0')}:
            {String(countdown.seconds).padStart(2, '0')}
          </span>
          <Badge variant="amber" size="sm">
            STAGE 2
          </Badge>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-[#5a647e] bg-white/70 hover:bg-white hover:text-[#0d0e1e] border border-indigo-200/70 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Search className="w-3.5 h-3.5 text-[#00c2e8]" />
            <span className="hidden sm:inline font-semibold">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-indigo-50 text-[#5a647e] rounded-md border border-indigo-100">
              Ctrl+K
            </kbd>
          </button>

          {/* ByteTokens Counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50/80 border border-amber-300/60 text-[#b45309] font-mono text-xs font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{userStats.byteTokens.toLocaleString()}</span>
            <span className="text-[10px] text-amber-700/80 font-normal">TOKENS</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 rounded-full text-[#5a647e] hover:text-[#0d0e1e] hover:bg-indigo-50 border border-indigo-100/70 transition-all cursor-pointer shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#00c2e8] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border border-white/95 rounded-3xl shadow-[0_20px_48px_-8px_rgba(0,194,232,0.22)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#191a2b]">
                <div className="px-5 py-3.5 border-b border-indigo-100/80 flex items-center justify-between bg-white/70">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0d0e1e]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-[#00677d] font-mono font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#00677d] hover:text-[#00c2e8] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-indigo-100/60">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-4 hover:bg-indigo-50/50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-cyan-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#0d0e1e]">{n.title}</span>
                        <span className="text-[10px] text-[#6c797e] font-mono">{n.time}</span>
                      </div>
                      <p className="text-xs text-[#5a647e] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 border-t border-indigo-100/80 bg-indigo-50/40 text-center">
                  <span className="text-[11px] text-[#6c797e] font-semibold">Live ByteRace Match Feeds</span>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full text-[#5a647e] hover:text-[#0d0e1e] hover:bg-indigo-50 border border-indigo-100/70 transition-all cursor-pointer shadow-sm"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1 pl-3 bg-white/80 hover:bg-white border border-indigo-200/70 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col text-right mr-1 hidden sm:flex">
                <span className="text-xs font-bold text-[#0d0e1e] leading-tight">Alex Dev</span>
                <span className="text-[10px] font-mono font-semibold text-[#00677d] leading-none">
                  {userStats.eloRating} ELO • Lv.{userStats.level}
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Alex Dev"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#00c2e8]/40"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#5a647e] mr-1" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl border border-white/95 rounded-3xl shadow-[0_20px_48px_-8px_rgba(0,194,232,0.22)] z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-[#191a2b]">
                <div className="flex items-center gap-3 pb-3 border-b border-indigo-100/80">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    alt="Alex Dev"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00c2e8]/50"
                  />
                  <div>
                    <div className="font-extrabold text-sm text-[#0d0e1e]">Alex Dev</div>
                    <div className="text-xs text-[#00677d] font-mono font-semibold">@CipherByte</div>
                    <Badge variant="cyan" size="sm" className="mt-1">
                      Grandmaster
                    </Badge>
                  </div>
                </div>

                {/* Level / XP bar */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#5a647e] font-mono text-[11px]">
                    <span className="font-semibold">Level {userStats.level}</span>
                    <span className="text-[#00677d] font-bold">{userStats.xp} / {userStats.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-100/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00c2e8] to-[#0098b8] rounded-full"
                      style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono py-1">
                  <div className="p-2 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <div className="text-[#6c797e] text-[10px] font-sans font-bold">GLOBAL RANK</div>
                    <div className="text-[#0d0e1e] font-extrabold text-sm">#{userStats.globalRank}</div>
                  </div>
                  <div className="p-2 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <div className="text-[#6c797e] text-[10px] font-sans font-bold">WIN STREAK</div>
                    <div className="text-[#b45309] font-extrabold text-sm">{userStats.currentStreak} 🔥</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsProfileOpen(false);
                  }}
                >
                  Edit Preferences
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
