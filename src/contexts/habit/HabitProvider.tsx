
import React, { useState, useEffect } from 'react';
import { HabitContext } from './HabitContext';
import { useHabitStorage } from './useHabitStorage';
import { useHabitOperations } from './useHabitOperations';
import { useStreakCalculation } from './useStreakCalculation';
import { toast } from '@/hooks/use-toast';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { habits, setHabits, habitLogs, setHabitLogs, isLoading: storageLoading, loadHabitsFromStorage } = useHabitStorage();
  const { calculateHabitStreak } = useStreakCalculation();
  const [loadingState, setLoadingState] = useState(false);
  
  const { 
    getHabitById, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    logProgress, 
    getHabitLogs 
  } = useHabitOperations(habits, setHabits, habitLogs, setHabitLogs);

  // Load habits on component mount
  useEffect(() => {
    console.log('HabitProvider mounted, loading habits initially');
    loadHabits();
  }, []);

  const getHabitStreak = (habitId: string) => {
    return calculateHabitStreak(habitLogs, habitId);
  };
  
  // Function to load habits data
  const loadHabits = async () => {
    console.log('HabitProvider: Forcing reload of habits data');
    setLoadingState(true);
    
    try {
      await loadHabitsFromStorage();
      console.log('HabitProvider: Habits reloaded successfully', habits);
    } catch (error) {
      console.error('Error loading habits in provider:', error);
      toast({
        title: "Error loading habits",
        description: "There was a problem loading your habits. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoadingState(false);
    }
  };

  const combinedIsLoading = storageLoading || loadingState;

  const value = {
    habits,
    habitLogs,
    isLoading: combinedIsLoading,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    getHabitLogs,
    getHabitStreak,
    loadHabits
  };

  useEffect(() => {
    console.log('HabitProvider rendered with', habits.length, 'habits');
  }, [habits.length]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
