import React, { useState, useEffect, type ReactNode, useRef } from 'react';
import type { 
  Problem, 
  Racer, 
  Team, 
  TestResult, 
  Language, 
  NotificationItem, 
  UserStats 
} from '../types';
import { mockProblems } from '../data/mockProblems';
import { mockRacers } from '../data/mockRacers';
import { mockTeam } from '../data/mockTeam';
import confetti from 'canvas-confetti';
import { 
  AppContext, 
  type NavigationTab, 
  type ThemeMode, 
  type Toast 
} from './context';

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'match',
    title: 'Heat 4 Commenced!',
    message: 'Regional Elimination Match #4 has gone live. NeoKrypton is currently in pole position.',
    time: '2 mins ago',
    read: false
  },
  {
    id: 'n-2',
    type: 'achievement',
    title: 'Sub-Millisecond Club',
    message: 'You earned the "Sub-Millisecond Club" badge for optimizing Quantum Cache Sync in 4ms.',
    time: '45 mins ago',
    read: false
  },
  {
    id: 'n-3',
    type: 'rank',
    title: 'Rank Upgrade!',
    message: 'Your squad Matrix Core Syndicate reached Global Rank #2 (+850 pts).',
    time: '3 hours ago',
    read: true
  }
];

const initialUserStats: UserStats = {
  apm: 115,
  accuracy: 94.2,
  submissionsCount: 182,
  testsPassedRatio: 96.8,
  currentStreak: 9,
  longestStreak: 16,
  globalRank: 3,
  eloRating: 2795,
  byteTokens: 1450,
  xp: 7850,
  level: 28,
  nextLevelXp: 10000
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    return (localStorage.getItem('byterace_tab') as NavigationTab) || 'arena';
  });

  // Problems
  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('byterace_problems');
    return saved ? JSON.parse(saved) : mockProblems;
  });
  const [activeProblem, setActiveProblem] = useState<Problem>(problems[0]);

  // Code editor
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('typescript');
  const [userCode, setUserCode] = useState<string>(activeProblem.starterCode.typescript);

  // Racers & Leaderboard
  const [racers, setRacers] = useState<Racer[]>(() => {
    const saved = localStorage.getItem('byterace_racers');
    return saved ? JSON.parse(saved) : mockRacers;
  });
  const [selectedRacerModal, setSelectedRacerModal] = useState<Racer | null>(null);

  // Team
  const [team, setTeam] = useState<Team>(() => {
    const saved = localStorage.getItem('byterace_team');
    return saved ? JSON.parse(saved) : mockTeam;
  });

  // User stats
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('byterace_user_stats');
    return saved ? JSON.parse(saved) : initialUserStats;
  });

  // Execution & Tests
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live race simulation
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<'normal' | 'fast'>('normal');

  // UI state
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('byterace_theme') as ThemeMode) || 'cyber';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Toasts & Notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Store persistence
  useEffect(() => {
    localStorage.setItem('byterace_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('byterace_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('byterace_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('byterace_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  // When active problem or language changes, update starter code
  const selectProblem = (problem: Problem) => {
    setActiveProblem(problem);
    setUserCode(problem.starterCode[selectedLanguage] || '');
    setTestResults([]);
    setActiveTab('arena');
  };

  const handleSetSelectedLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    setUserCode(activeProblem.starterCode[lang] || '');
  };

  // Keyboard shortcut for command palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Helpers
  const addToast = (type: Toast['type'], message: string, title?: string) => {
    toastIdRef.current += 1;
    const id = `toast-${toastIdRef.current}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'All notifications marked as read', 'Notifications');
  };

  // Add Team Member
  const addTeamMember = (handle: string, role: Team['members'][0]['role']) => {
    const newMember: Team['members'][0] = {
      id: `m-${Date.now()}`,
      handle: handle.startsWith('@') ? handle.slice(1) : handle,
      role,
      avatar: `https://images.unsplash.com/photo-${1535000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
      rating: 2450 + Math.floor(Math.random() * 300),
      country: 'Global',
      status: 'online',
      contributions: 1200
    };

    setTeam((prev) => ({
      ...prev,
      members: [...prev.members, newMember]
    }));

    addToast('success', `Added @${newMember.handle} as ${role} to ${team.name}!`, 'Squad Updated');
  };

  // Run Test Cases
  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    addToast('info', 'Compiling sandboxed runner & executing test vectors...', 'Test Runner');

    await new Promise((resolve) => setTimeout(resolve, 800));

    const simulatedResults: TestResult[] = activeProblem.testCases.map((tc, index) => {
      const isPass = Math.random() > 0.08; // 92% pass simulation
      const execTime = Math.floor(Math.random() * 18) + 2;
      const mem = +(Math.random() * 12 + 18).toFixed(1);

      return {
        testId: tc.id,
        passed: isPass,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: isPass ? tc.expectedOutput : 'NullOrError',
        executionTimeMs: execTime,
        memoryUsedMb: mem,
        error: isPass ? undefined : `AssertionError: Expected ${tc.expectedOutput}, received NullOrError at test index [${index}]`
      };
    });

    setTestResults(simulatedResults);
    setIsRunningTests(false);

    const passedCount = simulatedResults.filter((r) => r.passed).length;
    const totalCount = simulatedResults.length;

    // Update user racer progress
    setRacers((prev) =>
      prev.map((r) =>
        r.id === 'racer-user'
          ? {
              ...r,
              testsPassed: passedCount,
              totalTests: totalCount,
              currentProgress: Math.min(100, Math.round((passedCount / totalCount) * 90)),
              status: passedCount === totalCount ? 'testing' : 'coding'
            }
          : r
      )
    );

    if (passedCount === totalCount) {
      addToast('success', `All ${totalCount} sample test cases passed flawlessly! Ready to submit.`, 'Tests Passed');
    } else {
      addToast('warning', `${passedCount}/${totalCount} tests passed. Check assertion errors in the console.`, 'Tests Failed');
    }
  };

  // Submit Solution
  const submitSolution = async (): Promise<boolean> => {
    setIsSubmitting(true);
    addToast('info', 'Running full verification suite against hidden stress cases...', 'Submitting');

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);

    // Mark problem as solved
    setProblems((prev) =>
      prev.map((p) => (p.id === activeProblem.id ? { ...p, isSolved: true } : p))
    );

    // Boost user stats
    setUserStats((prev) => ({
      ...prev,
      submissionsCount: prev.submissionsCount + 1,
      byteTokens: prev.byteTokens + activeProblem.points,
      xp: prev.xp + activeProblem.points * 2,
      currentStreak: prev.currentStreak + 1,
      eloRating: prev.eloRating + 24
    }));

    // Update user racer progress to finished 100%
    setRacers((prev) =>
      prev.map((r) =>
        r.id === 'racer-user'
          ? {
              ...r,
              currentProgress: 100,
              status: 'finished',
              testsPassed: r.totalTests,
              solvedCount: r.solvedCount + 1,
              totalPoints: r.totalPoints + activeProblem.points,
              rank: Math.max(1, r.rank - 1)
            }
          : r
      )
    );

    // Trigger visual confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#9d4edd', '#00ff66', '#ff007f']
      });
    } catch {
      // Ignore if canvas context unavailable
    }

    addToast(
      'success',
      `Accepted! +${activeProblem.points} ByteTokens & +${activeProblem.points * 2} XP awarded.`,
      'Challenge Conquered'
    );

    return true;
  };

  // Reset Live Race
  const resetRace = () => {
    setRacers(mockRacers.map((r) => ({
      ...r,
      currentProgress: Math.floor(Math.random() * 25),
      status: 'coding',
      testsPassed: 0
    })));
    setTestResults([]);
    addToast('info', 'Race simulation reset to starting grid.', 'Grid Reset');
  };

  // Simulated Live Bot Racing Engine
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isSimulating) {
      if (simulationRef.current) clearInterval(simulationRef.current);
      return;
    }

    const intervalMs = simulationSpeed === 'fast' ? 1200 : 2500;

    simulationRef.current = setInterval(() => {
      setRacers((prevRacers) => {
        return prevRacers.map((racer) => {
          if (racer.id === 'racer-user') {
            // Keep user progress responsive to user's real actions
            return racer;
          }

          if (racer.status === 'finished') {
            return racer;
          }

          const delta = Math.floor(Math.random() * 6) + 1;
          const newProgress = Math.min(100, racer.currentProgress + delta);
          
          let newStatus: Racer['status'] = racer.status;
          let newPassed = racer.testsPassed;

          if (newProgress >= 100) {
            newStatus = 'finished';
            newPassed = racer.totalTests;
          } else if (newProgress > 70) {
            newStatus = 'testing';
            newPassed = Math.min(racer.totalTests, Math.floor((newProgress / 100) * racer.totalTests) + 1);
          } else {
            newStatus = 'coding';
          }

          const speedDelta = Math.floor(Math.random() * 9) - 4;
          const newSpeed = Math.max(70, Math.min(160, racer.currentSpeedWpm + speedDelta));

          return {
            ...racer,
            currentProgress: newProgress,
            status: newStatus,
            testsPassed: newPassed,
            currentSpeedWpm: newSpeed
          };
        });
      });
    }, intervalMs);

    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [isSimulating, simulationSpeed]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        problems,
        activeProblem,
        selectProblem,
        selectedLanguage,
        setSelectedLanguage: handleSetSelectedLanguage,
        userCode,
        setUserCode,
        testResults,
        isRunningTests,
        runTests,
        isSubmitting,
        submitSolution,
        racers,
        selectedRacerModal,
        setSelectedRacerModal,
        isSimulating,
        setIsSimulating,
        simulationSpeed,
        setSimulationSpeed,
        resetRace,
        team,
        addTeamMember,
        userStats,
        themeMode,
        setThemeMode,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isInviteModalOpen,
        setIsInviteModalOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toasts,
        addToast,
        removeToast,
        notifications,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
