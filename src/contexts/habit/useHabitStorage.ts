
import { useState, useEffect } from 'react';
import { Habit, HabitLog } from '@/types/habit';

export const useHabitStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load habits from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const storedHabits = localStorage.getItem('habits');
      const storedLogs = localStorage.getItem('habitLogs');
      
      if (storedHabits) {
        const parsedHabits = JSON.parse(storedHabits);
        
        // Convert string dates to Date objects
        const formattedHabits = parsedHabits.map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          updatedAt: new Date(habit.updatedAt)
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits to localStorage:', error);
    }
  }, [habits]);

  // Save habit logs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('habitLogs', JSON.stringify(habitLogs));
    } catch (error) {
      console.error('Error saving habit logs to localStorage:', error);
    }
  }, [habitLogs]);

  return { habits, setHabits, habitLogs, setHabitLogs, isLoading };
};
