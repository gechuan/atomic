export interface Habit {
  id: string;
  name: string;
  cue: string; // "After I..."
  identity: string; // "I am the type of person who..."
  category: 'health' | 'productivity' | 'mindfulness' | 'finance' | 'other';
  streak: number;
  completedToday: boolean;
  color: string;
  history: boolean[]; // Last 7 days, for simplicity
  totalCompletions: number;
  userId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum Tab {
  TODAY = 'today',
  COACH = 'coach',
  STATS = 'stats',
  PROFILE = 'profile'
}

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Run',
    cue: 'After I drink coffee',
    identity: 'I am a runner',
    category: 'health',
    streak: 5,
    completedToday: false,
    color: '#10b981',
    history: [true, true, true, false, true, true, false],
    totalCompletions: 42
  },
  {
    id: '2',
    name: 'Read 10 pages',
    cue: 'After I sit on the couch',
    identity: 'I am a reader',
    category: 'mindfulness',
    streak: 12,
    completedToday: true,
    color: '#f97316',
    history: [true, true, true, true, true, true, true],
    totalCompletions: 89
  },
  {
    id: '3',
    name: 'Deep Work',
    cue: 'After I open my laptop',
    identity: 'I am productive',
    category: 'productivity',
    streak: 2,
    completedToday: false,
    color: '#8b5cf6',
    history: [false, true, true, false, false, true, false],
    totalCompletions: 15
  }
];