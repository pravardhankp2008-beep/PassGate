import { createContext } from 'react';
import type { 
  Problem, 
  Racer, 
  Team, 
  TestResult, 
  Language, 
  NotificationItem, 
  UserStats 
} from '../types';

export type NavigationTab = 'arena' | 'problems' | 'leaderboard' | 'squad' | 'schedule' | 'telemetry';
export type ThemeMode = 'cyber' | 'matrix' | 'stealth';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export interface AppContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Problems
  problems: Problem[];
  activeProblem: Problem;
  selectProblem: (problem: Problem) => void;
  
  // Code & Execution
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  userCode: string;
  setUserCode: (code: string) => void;
  testResults: TestResult[];
  isRunningTests: boolean;
  runTests: () => Promise<void>;
  isSubmitting: boolean;
  submitSolution: () => Promise<boolean>;
  
  // Racers & Leaderboard
  racers: Racer[];
  selectedRacerModal: Racer | null;
  setSelectedRacerModal: (racer: Racer | null) => void;
  
  // Live Simulation
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simulationSpeed: 'normal' | 'fast';
  setSimulationSpeed: (speed: 'normal' | 'fast') => void;
  resetRace: () => void;
  
  // Squad / Team
  team: Team;
  addTeamMember: (handle: string, role: Team['members'][0]['role']) => void;
  
  // User Profile & Telemetry
  userStats: UserStats;
  
  // UI States & Modals
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Toasts & Notifications
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string, title?: string) => void;
  removeToast: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
