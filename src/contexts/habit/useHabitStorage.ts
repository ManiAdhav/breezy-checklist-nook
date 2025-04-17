
import { useState, useCallback } from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { fetchData, saveData } from '@/utils/dataSync';

// Constants for storage keys
const HABITS_STORAGE_KEY = 'habits';
const HABIT_LOGS_STORAGE_KEY = 'habitLogs';

export const useHabitStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load habits from storage
  const loadHabitsFromStorage = useCallback(async () => {
    console.log('useHabitStorage: Loading habits from storage');
    setIsLoading(true);

    try {
      // Use our data sync utilities for consistent loading
      const [habitsData, logsData] = await Promise.all([
        fetchData<Habit>('habits', HABITS_STORAGE_KEY),
        fetchData<HabitLog>('habit_logs', HABIT_LOGS_STORAGE_KEY)
      ]);
      
      // Convert dates back to Date objects
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
      
      console.log(`Loaded ${processedHabits.length} habits and ${processedLogs.length} logs from storage`);
      
      return { habits: processedHabits, habitLogs: processedLogs };
    } catch (error) {
      console.error('Error in loadHabitsFromStorage:', error);
      return { habits: [], habitLogs: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save habits to storage
  const saveHabitsToStorage = useCallback(async (habitsToSave: Habit[], logsToSave: HabitLog[]) => {
    console.log('useHabitStorage: Saving habits to storage');
    setIsLoading(true);

    try {
      // Use our data sync utilities for consistent saving
      await Promise.all([
        saveData('habits', HABITS_STORAGE_KEY, habitsToSave),
        saveData('habit_logs', HABIT_LOGS_STORAGE_KEY, logsToSave)
      ]);
      
      console.log(`Saved ${habitsToSave.length} habits and ${logsToSave.length} logs to storage`);
    } catch (error) {
      console.error('Error in saveHabitsToStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    habits,
    setHabits,
    habitLogs,
    setHabitLogs,
    isLoading,
    loadHabitsFromStorage,
    saveHabitsToStorage
  };
};
