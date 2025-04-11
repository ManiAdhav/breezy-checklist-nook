
import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { HABITS_STORAGE_KEY, HABIT_LOGS_STORAGE_KEY } from '@/api/services/storage/constants';
import { toast } from '@/hooks/use-toast';

export const useHabitStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to properly parse dates from localStorage
  const parseDates = (item: any): any => {
    if (item === null || typeof item !== 'object') return item;
    
    // Handle Date objects
    if (item.hasOwnProperty('createdAt')) {
      item.createdAt = new Date(item.createdAt);
    }
    if (item.hasOwnProperty('updatedAt')) {
      item.updatedAt = new Date(item.updatedAt);
    }
    if (item.hasOwnProperty('endDate') && item.endDate) {
      item.endDate = new Date(item.endDate);
    }
    if (item.hasOwnProperty('date') && item.date) {
      item.date = new Date(item.date);
    }
    
    // Process arrays recursively
    if (Array.isArray(item)) {
      return item.map(element => parseDates(element));
    }
    
    // Process objects recursively
    const result = { ...item };
    for (const key in result) {
      if (result.hasOwnProperty(key) && typeof result[key] === 'object' && result[key] !== null) {
        result[key] = parseDates(result[key]);
      }
    }
    
    return result;
  };

  // Load habits from localStorage
  const loadHabitsFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading habits and logs from storage');
      
      // Load habits
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      console.log('Raw habits from storage:', storedHabits);
      
      if (storedHabits) {
        try {
          const parsedHabits = JSON.parse(storedHabits);
          console.log('Parsed habits before date conversion:', parsedHabits);
          
          // Convert string dates to Date objects
          const formattedHabits = parseDates(parsedHabits);
          console.log('Formatted habits after date conversion:', formattedHabits);
          
          setHabits(formattedHabits);
        } catch (parseError) {
          console.error('Error parsing habits JSON:', parseError);
          setHabits([]);
          toast({
            title: "Error loading habits",
            description: "Invalid habit data format. Starting with empty habits.",
            variant: "destructive"
          });
        }
      } else {
        console.log('No habits found in storage');
        setHabits([]);
      }
      
      // Load habit logs
      const storedLogs = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
      console.log('Raw habit logs from storage:', storedLogs);
      
      if (storedLogs) {
        try {
          const parsedLogs = JSON.parse(storedLogs);
          console.log('Parsed logs before date conversion:', parsedLogs);
          
          // Convert string dates to Date objects
          const formattedLogs = parseDates(parsedLogs);
          console.log('Formatted logs after date conversion:', formattedLogs);
          
          setHabitLogs(formattedLogs);
        } catch (parseError) {
          console.error('Error parsing habit logs JSON:', parseError);
          setHabitLogs([]);
          toast({
            title: "Error loading habit logs",
            description: "Invalid log data format. Starting with empty logs.",
            variant: "destructive"
          });
        }
      } else {
        console.log('No habit logs found in storage');
        setHabitLogs([]);
      }
      
      return true;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      toast({
        title: "Error loading data",
        description: "There was a problem loading your habits. Please try refreshing the page.",
        variant: "destructive"
      });
      
      // Initialize with empty arrays in case of error
      setHabits([]);
      setHabitLogs([]);
      return false;
    } finally {
      setIsLoading(false);
      console.log('Finished loading habits and logs from storage');
    }
  }, []);

  // Load habits from localStorage on mount
  useEffect(() => {
    loadHabitsFromStorage();
    
    // Add event listener for storage changes from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === HABITS_STORAGE_KEY || event.key === HABIT_LOGS_STORAGE_KEY) {
        console.log('Storage changed in another tab, reloading data');
        loadHabitsFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadHabitsFromStorage]);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    try {
      if (habits.length > 0) {
        console.log('Saving habits to localStorage:', habits);
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      }
    } catch (error) {
      console.error('Error saving habits to localStorage:', error);
      toast({
        title: "Error saving habits",
        description: "There was a problem saving your habits.",
        variant: "destructive"
      });
    }
  }, [habits]);

  // Save habit logs to localStorage whenever they change
  useEffect(() => {
    try {
      if (habitLogs.length > 0) {
        console.log('Saving habit logs to localStorage:', habitLogs);
        localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify(habitLogs));
      }
    } catch (error) {
      console.error('Error saving habit logs to localStorage:', error);
      toast({
        title: "Error saving habit logs",
        description: "There was a problem saving your habit logs.",
        variant: "destructive"
      });
    }
  }, [habitLogs]);

  return { 
    habits, 
    setHabits, 
    habitLogs, 
    setHabitLogs, 
    isLoading,
    loadHabitsFromStorage 
  };
};
