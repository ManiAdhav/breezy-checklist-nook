
import React from 'react';
import { HabitContext } from './HabitContext';
import { useHabitStorage } from './useHabitStorage';
import { useHabitOperations } from './useHabitOperations';
import { useStreakCalculation } from './useStreakCalculation';

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
