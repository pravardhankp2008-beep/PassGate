import type { TournamentStage } from '../types';

export const mockSchedule: TournamentStage[] = [
  {
    id: 'stage-1',
    title: 'Stage 1: Continental Speed Qualifiers',
    date: 'Oct 20 - Oct 25, 2026',
    time: 'Completed',
    status: 'completed',
    prizePool: '$25,000',
    format: '1v1 Knockout Speed Sprint (10 mins / problem)',
    description: '10,000 global challengers battled across 5 algorithmic brackets to secure top 256 seed placements.',
    participantsCount: 10240
  },
  {
    id: 'stage-2',
    title: 'Stage 2: Regional Elimination & Squad Relays',
    date: 'Oct 28 - Nov 02, 2026',
    time: 'LIVE NOW (Heat 4/8)',
    status: 'live',
    prizePool: '$75,000',
    format: '4-Player Squad Relay & Concurrency Gauntlet',
    description: 'High-octane live coding sprint where teammates tag each other in real time to solve multi-stage distributed system bugs.',
    participantsCount: 256
  },
  {
    id: 'stage-3',
    title: 'Stage 3: 24-Hour Deep Systems Marathon',
    date: 'Nov 12 - Nov 13, 2026',
    time: '14:00 UTC',
    status: 'upcoming',
    prizePool: '$150,000',
    format: 'Continuous Autonomous Kernel & AI Agent Optimization',
    description: 'Teams build high-throughput, low-latency microservices under chaotic network degradation and simulated DDoS attacks.',
    participantsCount: 64
  },
  {
    id: 'stage-4',
    title: 'Grand Finals: The ByteRace 2026 World Cup',
    date: 'Dec 05, 2026',
    time: '18:00 UTC',
    status: 'upcoming',
    prizePool: '$500,000 + Champion Aegis',
    format: 'Arena Main Stage: Best-of-7 Speed Heats',
    description: 'The top 8 teams and top 16 solo speed-racers converge in the live arena for the undisputed World Championship.',
    participantsCount: 16
  }
];
