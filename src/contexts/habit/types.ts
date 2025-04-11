
import { Habit, HabitLog, HabitStreak } from '@/types/habit';

export interface HabitContextType {
  habits: Habit[];
  habitLogs: HabitLog[];
  isLoading: boolean;
  getHabitById: (id: string) => Habit | undefined;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Habit;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteHabit: (id: string) => void;
  logProgress: (log: Omit<HabitLog, 'id'>) => void;
  getHabitLogs: (habitId: string) => HabitLog[];
  getHabitStreak: (habitId: string) => HabitStreak;
  loadHabits: () => Promise<void>;
}
