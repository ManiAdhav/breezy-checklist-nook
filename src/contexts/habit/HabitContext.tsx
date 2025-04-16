
import { createContext, useContext } from 'react';
import { Habit, HabitLog, HabitStreak } from '@/types/habit';

interface HabitContextType {
  habits: Habit[];
  habitLogs: HabitLog[];
  isLoading: boolean;
  getHabitById: (id: string) => Habit | undefined;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteHabit: (id: string) => void;
  logProgress: (log: Omit<HabitLog, 'id'>) => void;
  getHabitLogs: (habitId: string) => HabitLog[];
  getHabitStreak: (habitId: string) => HabitStreak;
  loadHabits: () => Promise<void>;
  saveAllHabits?: () => void;
}

export const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabit = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};
