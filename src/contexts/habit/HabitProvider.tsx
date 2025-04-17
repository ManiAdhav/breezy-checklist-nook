
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HabitContext } from './HabitContext';
import { useHabitOperations } from './useHabitOperations';
import { useStreakCalculation } from './useStreakCalculation';
import { toast } from '@/hooks/use-toast';
import { fetchData, saveData } from '@/utils/dataSync';
import { Habit, HabitLog } from '@/types/habit';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { calculateHabitStreak } = useStreakCalculation();
  
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
    console.log('HabitProvider mounted, loading habits...');
    loadHabits();
  }, []); 

  // Function to calculate streak for a habit
  const getHabitStreak = useCallback((habitId: string) => {
    return calculateHabitStreak(habitLogs, habitId);
  }, [habitLogs, calculateHabitStreak]);
  
  // Function to load habits data
  const loadHabits = useCallback(async () => {
    console.log('HabitProvider: Loading habits data');
    
    // Set loading state immediately
    setIsLoading(true);
    
    try {
      // Use our sync utilities to load habits and logs consistently
      const [habitsData, logsData] = await Promise.all([
        fetchData<Habit>('habits', 'habits'),
        fetchData<HabitLog>('habit_logs', 'habitLogs')
      ]);
      
      // Convert string dates back to Date objects
      const processedHabits = habitsData.map(habit => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        updatedAt: new Date(habit.updatedAt),
        startDate: new Date(habit.startDate),
        endDate: habit.endDate ? new Date(habit.endDate) : undefined
      }));
      
      const processedLogs = logsData.map(log => ({
        ...log,
        date: new Date(log.date)
      }));
      
      console.log('HabitProvider: Habits loaded successfully', {
        habitsLength: processedHabits.length,
        logsLength: processedLogs.length
      });
      
      setHabits(processedHabits);
      setHabitLogs(processedLogs);
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
      setIsLoading(false);
    }
  }, []);

  // Force save all habits
  const saveAllHabits = useCallback(async () => {
    console.log('HabitProvider: Force saving all habits', habits.length);
    try {
      await Promise.all([
        saveData('habits', 'habits', habits),
        saveData('habit_logs', 'habitLogs', habitLogs)
      ]);
      
      toast({
        title: "Success",
        description: "All habits and logs saved successfully",
      });
    } catch (error) {
      console.error('Error saving all habits:', error);
      toast({
        title: "Error",
        description: "Failed to save habits data",
        variant: "destructive"
      });
    }
  }, [habits, habitLogs]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    habits,
    habitLogs,
    isLoading,
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
    isLoading,
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
  }, [habits]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
