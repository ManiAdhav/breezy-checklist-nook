
import React, { createContext, useContext } from 'react';
import { HabitContextType } from './types';
import { useHabitStorage } from './useHabitStorage';
import { useHabitOperations } from './useHabitOperations';
import { useStreakCalculation } from './useStreakCalculation';

const HabitContext = createContext<HabitContextType | null>(null);

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { habits, setHabits, habitLogs, setHabitLogs, isLoading } = useHabitStorage();
  const { calculateHabitStreak } = useStreakCalculation();
  const { 
    getHabitById, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    logProgress, 
    getHabitLogs 
  } = useHabitOperations(habits, setHabits, habitLogs, setHabitLogs);

  const getHabitStreak = (habitId: string) => {
    return calculateHabitStreak(habitLogs, habitId);
  };

  const value = {
    habits,
    habitLogs,
    isLoading,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    getHabitLogs,
    getHabitStreak
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
