
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
  const [loadingState, setLoadingState] = useState(true); // Start as loading
  
  // Memoize the habit operations to prevent unnecessary re-renders
  const { 
    getHabitById, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    logProgress, 
    getHabitLogs 
  } = useHabitOperations(habits, setHabits, habitLogs, setHabitLogs);

  // Load habits on component mount - CRITICAL for loading previous habits
  useEffect(() => {
    console.log('HabitProvider mounted, loading habits initially');
    loadHabits();
  }, []); // Empty dependency array to run only once

  // Function to calculate streak for a habit
  const getHabitStreak = useCallback((habitId: string) => {
    return calculateHabitStreak(habitLogs, habitId);
  }, [habitLogs, calculateHabitStreak]);
  
  // Function to load habits data - made more robust
  const loadHabits = useCallback(async () => {
    console.log('HabitProvider: Loading habits data');
    
    // Set loading state immediately
    setLoadingState(true);
    
    try {
      console.log('Calling loadHabitsFromStorage');
      // Wait for loadHabitsFromStorage to complete and get the result
      const result = await loadHabitsFromStorage();
      
      // Log what was retrieved for debugging
      console.log('HabitProvider: Habits loaded successfully', {
        habitsLength: result.habits?.length || 0,
        logsLength: result.habitLogs?.length || 0,
        habitsData: result.habits
      });
      
      // Always set state regardless of empty or not to ensure state updates
      console.log('Setting habits and habitLogs state with loaded data');
      setHabits(result.habits || []);
      setHabitLogs(result.habitLogs || []);
      
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
  }, [loadHabitsFromStorage, setHabits, setHabitLogs]);

  // Force save all habits
  const saveAllHabits = useCallback(() => {
    console.log('HabitProvider: Force saving all habits', habits.length);
    saveHabitsToStorage(habits, habitLogs);
  }, [habits, habitLogs, saveHabitsToStorage]);

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
    console.log('Current habits state:', habits);
  }, [habits]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
