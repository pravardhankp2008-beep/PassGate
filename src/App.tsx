import React from 'react';
import { AppProvider, useApp } from './context';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LiveRaceTrack } from './components/arena/LiveRaceTrack';
import { ProblemViewer } from './components/arena/ProblemViewer';
import { CodeEditor } from './components/arena/CodeEditor';
import { TestRunnerConsole } from './components/arena/TestRunnerConsole';
import { ProblemList } from './components/problems/ProblemList';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { SquadHub } from './components/squad/SquadHub';
import { TournamentSchedule } from './components/schedule/TournamentSchedule';
import { TelemetryDashboard } from './components/telemetry/TelemetryDashboard';
import { SearchPalette } from './components/ui/SearchPalette';
import { RacerProfileModal } from './components/leaderboard/RacerProfileModal';
import { InviteMemberModal } from './components/squad/InviteMemberModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { ToastContainer } from './components/ui/ToastContainer';

const MainArenaView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Real-time visual race track */}
      <LiveRaceTrack />

      {/* 2. Responsive 2-column arena workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Problem Viewer (5 cols) */}
        <div className="lg:col-span-5 h-[620px] flex flex-col">
          <ProblemViewer />
        </div>

        {/* Right Column: Code Editor & Test Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-[620px]">
          <div className="flex-1 min-h-[340px]">
            <CodeEditor />
          </div>
          <div className="h-[260px]">
            <TestRunnerConsole />
          </div>
        </div>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, themeMode } = useApp();

  const themeClasses = {
    cyber: '',
    matrix: 'matrix-mode selection:bg-emerald-500',
    stealth: 'stealth-mode selection:bg-purple-500'
  };

  return (
    <div 
      className={`min-h-screen flex flex-col bg-[#fbf8ff] text-[#191a2b] font-sans selection:bg-cyan-200 selection:text-[#004b5b] ${themeClasses[themeMode]}`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 12% 14%, rgba(0, 194, 232, 0.09) 0%, transparent 45%),
          radial-gradient(circle at 88% 86%, rgba(157, 101, 255, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 50% 40%, rgba(0, 200, 175, 0.05) 0%, transparent 60%)
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Body with Sidebar and Main View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'arena' && <MainArenaView />}
          {activeTab === 'problems' && <ProblemList />}
          {activeTab === 'leaderboard' && <LeaderboardTable />}
          {activeTab === 'squad' && <SquadHub />}
          {activeTab === 'schedule' && <TournamentSchedule />}
          {activeTab === 'telemetry' && <TelemetryDashboard />}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals & Reactive Alerts */}
      <SearchPalette />
      <RacerProfileModal />
      <InviteMemberModal />
      <SettingsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
