
import { useState, useCallback } from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { toast } from '@/hooks/use-toast';

// Local storage keys
const HABITS_STORAGE_KEY = 'habits';
const HABIT_LOGS_STORAGE_KEY = 'habitLogs';

export const useHabitStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to safely parse dates in objects
  const parseDatesInObject = (obj: any): any => {
    const dateProperties = ['createdAt', 'updatedAt', 'startDate', 'endDate', 'date'];
    
    const parsed = { ...obj };
    for (const key of dateProperties) {
      if (parsed[key] && typeof parsed[key] === 'string') {
        parsed[key] = new Date(parsed[key]);
      }
    }
    return parsed;
  };

  // Load habits and logs from storage
  const loadHabitsFromStorage = useCallback(async () => {
    console.log('Loading habits and logs from storage');
    setIsLoading(true);
    
    try {
      // Load habits
      const habitsJson = localStorage.getItem(HABITS_STORAGE_KEY);
      console.log('Raw habits from storage:', habitsJson);
      
      let parsedHabits: Habit[] = [];
      if (habitsJson) {
        try {
          parsedHabits = JSON.parse(habitsJson);
          console.log('Parsed habits before date conversion:', parsedHabits);
          
          // Parse dates in habits
          parsedHabits = parsedHabits.map(habit => parseDatesInObject(habit));
          console.log('Formatted habits after date conversion:', parsedHabits);
        } catch (e) {
          console.error('Error parsing habits from storage:', e);
          toast({
            title: "Error",
            description: "Failed to load habits data. The data might be corrupted.",
            variant: "destructive"
          });
        }
      }
      
      // Load habit logs
      const logsJson = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
      console.log('Raw habit logs from storage:', logsJson);
      
      let parsedLogs: HabitLog[] = [];
      if (logsJson) {
        try {
          parsedLogs = JSON.parse(logsJson);
          console.log('Parsed logs before date conversion:', parsedLogs);
          
          // Parse dates in logs
          parsedLogs = parsedLogs.map(log => parseDatesInObject(log));
          console.log('Formatted logs after date conversion:', parsedLogs);
        } catch (e) {
          console.error('Error parsing habit logs from storage:', e);
          toast({
            title: "Error",
            description: "Failed to load habit logs data. The data might be corrupted.",
            variant: "destructive"
          });
        }
      }
      
      // Update state with parsed data
      setHabits(parsedHabits);
      setHabitLogs(parsedLogs);
      console.log('Finished loading habits and logs from storage');
      
      return { habits: parsedHabits, habitLogs: parsedLogs };
    } catch (error) {
      console.error('Error loading from storage:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load data from storage",
        variant: "destructive"
      });
      return { habits: [], habitLogs: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save habits to storage
  const saveHabitsToStorage = useCallback(async (habitsToSave: Habit[]) => {
    console.log('Saving habits to storage:', habitsToSave);
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habitsToSave));
      console.log('Habits saved successfully');
    } catch (error) {
      console.error('Error saving habits to storage:', error);
      toast({
        title: "Error saving data",
        description: "Failed to save habits data to storage",
        variant: "destructive"
      });
    }
  }, []);

  // Save habit logs to storage
  const saveHabitLogsToStorage = useCallback(async (logsToSave: HabitLog[]) => {
    console.log('Saving habit logs to storage:', logsToSave);
    try {
      localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify(logsToSave));
      console.log('Habit logs saved successfully');
    } catch (error) {
      console.error('Error saving habit logs to storage:', error);
      toast({
        title: "Error saving data",
        description: "Failed to save habit logs data to storage",
        variant: "destructive"
      });
    }
  }, []);

  // Update habits state and save to storage
  const updateHabits = useCallback((newHabits: Habit[]) => {
    console.log('Updating habits state and storage:', newHabits.length, 'habits');
    setHabits(newHabits);
    saveHabitsToStorage(newHabits);
  }, [saveHabitsToStorage]);

  // Update habit logs state and save to storage
  const updateHabitLogs = useCallback((newLogs: HabitLog[]) => {
    console.log('Updating habit logs state and storage:', newLogs.length, 'logs');
    setHabitLogs(newLogs);
    saveHabitLogsToStorage(newLogs);
  }, [saveHabitLogsToStorage]);

  return {
    habits,
    setHabits: updateHabits,
    habitLogs,
    setHabitLogs: updateHabitLogs,
    isLoading,
    loadHabitsFromStorage,
    saveHabitsToStorage,
    saveHabitLogsToStorage
  };
};
