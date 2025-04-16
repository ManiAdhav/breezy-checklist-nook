
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HabitContext } from './HabitContext';
import { useHabitStorage } from './useHabitStorage';
import { useHabitOperations } from './useHabitOperations';
import { useStreakCalculation } from './useStreakCalculation';
import { toast } from '@/hooks/use-toast';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    habits, 
    setHabits, 
    habitLogs, 
    setHabitLogs, 
    isLoading: storageLoading, 
    loadHabitsFromStorage,
    saveHabitsToStorage 
  } = useHabitStorage();
  
  const { calculateHabitStreak } = useStreakCalculation();
  const [loadingState, setLoadingState] = useState(false);
  
  // Memoize the habit operations to prevent unnecessary re-renders
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
  }, []); // Empty dependency array to run only once

  // Function to calculate streak for a habit
  const getHabitStreak = useCallback((habitId: string) => {
    return calculateHabitStreak(habitLogs, habitId);
  }, [habitLogs, calculateHabitStreak]);
  
  // Function to load habits data
  const loadHabits = useCallback(async () => {
    console.log('HabitProvider: Loading habits data');
    
    // Prevent multiple simultaneous loading operations
    if (loadingState) {
      console.log('Already loading habits, skipping duplicate call');
      return;
    }
    
    setLoadingState(true);
    
    try {
      const { habits: loadedHabits, habitLogs: loadedLogs } = await loadHabitsFromStorage();
      
      console.log('HabitProvider: Habits loaded successfully', {
        habitsLength: loadedHabits?.length,
        logsLength: loadedLogs?.length
      });
      
    } catch (error) {
      console.error('Error loading habits in provider:', error);
      
      // Initialize with empty arrays to prevent errors
      setHabits([]);
      setHabitLogs([]);
      
      toast({
        title: "Error loading habits",
        description: "There was a problem loading your habits. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoadingState(false);
    }
  }, [loadHabitsFromStorage, loadingState, setHabits, setHabitLogs]);

  // Force save all habits
  const saveAllHabits = useCallback(() => {
    console.log('HabitProvider: Force saving all habits', habits.length);
    saveHabitsToStorage(habits);
  }, [habits, saveHabitsToStorage]);

  const combinedIsLoading = storageLoading || loadingState;

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
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
    loadHabits,
    saveAllHabits
  }), [
    habits,
    habitLogs,
    combinedIsLoading,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    getHabitLogs,
    getHabitStreak,
    loadHabits,
    saveAllHabits
  ]);

  // Log when habits change for debugging
  useEffect(() => {
    console.log('HabitProvider rendered with', habits.length, 'habits');
  }, [habits.length]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
