
import { useState, useEffect } from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { HABITS_STORAGE_KEY, HABIT_LOGS_STORAGE_KEY } from '@/api/services/storage/constants';

export const useHabitStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load habits from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      const storedLogs = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
      
      if (storedHabits) {
        const parsedHabits = JSON.parse(storedHabits);
        
        // Convert string dates to Date objects
        const formattedHabits = parsedHabits.map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          updatedAt: new Date(habit.updatedAt),
          endDate: habit.endDate ? new Date(habit.endDate) : undefined
        }));
        
        setHabits(formattedHabits);
      }
      
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        
        // Convert string dates to Date objects
        const formattedLogs = parsedLogs.map((log: any) => ({
          ...log,
          date: new Date(log.date)
        }));
        
        setHabitLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Error loading habits from localStorage:', error);
      // Initialize with empty arrays in case of error
      setHabits([]);
      setHabitLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits to localStorage:', error);
    }
  }, [habits]);

  // Save habit logs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify(habitLogs));
    } catch (error) {
      console.error('Error saving habit logs to localStorage:', error);
    }
  }, [habitLogs]);

  return { habits, setHabits, habitLogs, setHabitLogs, isLoading };
};
