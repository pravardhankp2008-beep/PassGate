export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Legendary';
export type Division = 'All' | 'Pro Division' | 'University' | 'Rookie';
export type Language = 'typescript' | 'python' | 'rust' | 'cpp' | 'go';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSecret?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  points: number;
  timeLimitMs: number;
  memoryLimitMb: number;
  acceptanceRate: number;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: TestCase[];
  starterCode: Record<Language, string>;
  solutionCode?: Record<Language, string>;
  isSolved?: boolean;
}

export interface Racer {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  division: Division;
  rating: number;
  rank: number;
  previousRank: number;
  solvedCount: number;
  totalPoints: number;
  currentProgress: number; // 0 - 100% in active race
  status: 'idle' | 'coding' | 'testing' | 'submitted' | 'finished';
  currentSpeedWpm: number;
  testsPassed: number;
  totalTests: number;
  streak: number;
  country: string;
  flag: string;
  badges: string[];
}

export interface TestResult {
  testId: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTimeMs: number;
  memoryUsedMb: number;
  error?: string;
}

export interface TeamMember {
  id: string;
  handle: string;
  role: 'Captain' | 'Algorithm Specialist' | 'Optimizer' | 'Strategist';
  avatar: string;
  rating: number;
  country: string;
  status: 'online' | 'racing' | 'offline';
  contributions: number;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo: string;
  division: Division;
  globalRank: number;
  totalPoints: number;
  winRate: number;
  members: TeamMember[];
}

export interface TournamentStage {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'completed' | 'live' | 'upcoming';
  prizePool: string;
  format: string;
  description: string;
  participantsCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'achievement' | 'alert' | 'match' | 'rank';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface UserStats {
  apm: number; // actions per minute
  accuracy: number; // %
  submissionsCount: number;
  testsPassedRatio: number;
  currentStreak: number;
  longestStreak: number;
  globalRank: number;
  eloRating: number;
  byteTokens: number;
  xp: number;
  level: number;
  nextLevelXp: number;
}
