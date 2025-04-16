
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { HabitContext } from './HabitContext';
import { useHabitStorage } from './useHabitStorage';
import { useHabitOperations } from './useHabitOperations';
import { useStreakCalculation } from './useStreakCalculation';
import { toast } from '@/hooks/use-toast';
import { Habit } from '@/types/habit';

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
  
  // Create useRef at the component level, not inside useEffect
  const initialLoadDone = useRef(false);
  
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
    
    // Use the ref defined at component level
    if (!initialLoadDone.current) {
      loadHabits();
      initialLoadDone.current = true;
    }
  }, []); // Empty dependency array to run only once

  // Function to calculate streak for a habit
  const getHabitStreak = useCallback((habitId: string) => {
    return calculateHabitStreak(habitLogs, habitId);
  }, [habitLogs, calculateHabitStreak]);
  
  // Function to load habits data
  const loadHabits = useCallback(async () => {
    console.log('HabitProvider: Forcing reload of habits data');
    
    // Prevent multiple simultaneous loading operations
    if (loadingState) {
      console.log('Already loading habits, skipping duplicate call');
      return;
    }
    
    setLoadingState(true);
    
    try {
      const { habits: loadedHabits } = await loadHabitsFromStorage();
      
      console.log('HabitProvider: Habits reloaded successfully', loadedHabits?.length);
      
      // Only show toast if habits were loaded successfully and there are habits
      if (loadedHabits && loadedHabits.length > 0) {
        toast({
          title: "Habits loaded",
          description: `${loadedHabits.length} habits loaded successfully`,
        });
      }
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
  }, [loadHabitsFromStorage, loadingState]); 

  // Force save all habits
  const saveAllHabits = useCallback(() => {
    console.log('HabitProvider: Force saving all habits');
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
