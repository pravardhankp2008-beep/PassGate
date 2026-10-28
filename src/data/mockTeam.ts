import type { Team } from '../types';

export const mockTeam: Team = {
  id: 'team-matrix-core',
  name: 'Matrix Core Syndicate',
  tag: 'MCS',
  logo: '⚡',
  division: 'Pro Division',
  globalRank: 2,
  totalPoints: 34850,
  winRate: 84.6,
  members: [
    {
      id: 'm-1',
      handle: 'CipherByte',
      role: 'Captain',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: 2795,
      country: 'United States',
      status: 'racing',
      contributions: 11420
    },
    {
      id: 'm-2',
      handle: 'CyberValkyrie',
      role: 'Algorithm Specialist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 2885,
      country: 'Estonia',
      status: 'racing',
      contributions: 11980
    },
    {
      id: 'm-3',
      handle: 'RustOverlord',
      role: 'Optimizer',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      rating: 2650,
      country: 'Sweden',
      status: 'online',
      contributions: 6720
    },
    {
      id: 'm-4',
      handle: 'AstraNode',
      role: 'Strategist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      rating: 2510,
      country: 'Japan',
      status: 'offline',
      contributions: 4730
    }
  ]
};
