
import { useState, useCallback } from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Constants for localStorage keys
const HABITS_STORAGE_KEY = 'habits';
const HABIT_LOGS_STORAGE_KEY = 'habitLogs';

export const useHabitStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load habits from storage (localStorage and then Supabase if available)
  const loadHabitsFromStorage = useCallback(async () => {
    console.log('useHabitStorage: Loading habits from storage');
    setIsLoading(true);

    try {
      // Try to load from Supabase first if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      let loadedHabits: Habit[] = [];
      let loadedLogs: HabitLog[] = [];
      
      if (session?.session) {
        console.log('User is authenticated, trying to load from Supabase');
        const { data: habitsData, error: habitsError } = await supabase
          .from('user_entries')
          .select('*')
          .eq('entry_type', HABITS_STORAGE_KEY);
          
        const { data: logsData, error: logsError } = await supabase
          .from('user_entries')
          .select('*')
          .eq('entry_type', HABIT_LOGS_STORAGE_KEY);
          
        if (habitsError) {
          console.error('Error loading habits from Supabase:', habitsError);
        } else if (habitsData && habitsData.length > 0) {
          // Parse the habits data
          loadedHabits = habitsData.map(entry => {
            try {
              return JSON.parse(entry.content);
            } catch (e) {
              console.error('Error parsing habit data:', e);
              return null;
            }
          }).filter(Boolean) as Habit[];
          console.log('Loaded habits from Supabase:', loadedHabits.length);
        }
        
        if (logsError) {
          console.error('Error loading habit logs from Supabase:', logsError);
        } else if (logsData && logsData.length > 0) {
          // Parse the logs data
          loadedLogs = logsData.map(entry => {
            try {
              return JSON.parse(entry.content);
            } catch (e) {
              console.error('Error parsing habit log data:', e);
              return null;
            }
          }).filter(Boolean) as HabitLog[];
          console.log('Loaded habit logs from Supabase:', loadedLogs.length);
        }
      }
      
      // If no data from Supabase or not authenticated, try localStorage
      if (loadedHabits.length === 0) {
        console.log('No habits from Supabase, trying localStorage');
        const localHabits = localStorage.getItem(HABITS_STORAGE_KEY);
        if (localHabits) {
          try {
            loadedHabits = JSON.parse(localHabits);
            console.log('Loaded habits from localStorage:', loadedHabits.length);
          } catch (e) {
            console.error('Error parsing localStorage habits:', e);
          }
        } else {
          console.log('No habits found in localStorage');
        }
      }
      
      if (loadedLogs.length === 0) {
        console.log('No habit logs from Supabase, trying localStorage');
        const localLogs = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
        if (localLogs) {
          try {
            loadedLogs = JSON.parse(localLogs);
            console.log('Loaded habit logs from localStorage:', loadedLogs.length);
          } catch (e) {
            console.error('Error parsing localStorage habit logs:', e);
          }
        } else {
          console.log('No habit logs found in localStorage');
        }
      }
      
      // Convert dates back to Date objects
      loadedHabits = loadedHabits.map(habit => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        updatedAt: new Date(habit.updatedAt),
        startDate: new Date(habit.startDate),
        endDate: habit.endDate ? new Date(habit.endDate) : undefined
      }));
      
      loadedLogs = loadedLogs.map(log => ({
        ...log,
        date: new Date(log.date)
      }));
      
      return { habits: loadedHabits, habitLogs: loadedLogs };
    } catch (error) {
      console.error('Error in loadHabitsFromStorage:', error);
      toast({
        title: "Error loading data",
        description: "There was an error loading your habits data.",
        variant: "destructive"
      });
      return { habits: [], habitLogs: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save habits to storage (localStorage and Supabase if available)
  const saveHabitsToStorage = useCallback(async (habitsToSave: Habit[], logsToSave: HabitLog[]) => {
    console.log('useHabitStorage: Saving habits to storage');
    setIsLoading(true);

    try {
      // Always save to localStorage first for immediate availability
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habitsToSave));
      localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify(logsToSave));
      console.log('Habits and logs saved to localStorage');
      
      // Try to save to Supabase if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        console.log('User is authenticated, saving to Supabase');
        
        // For habits, delete existing entries and insert new ones
        if (habitsToSave.length > 0) {
          const { error: deleteError } = await supabase
            .from('user_entries')
            .delete()
            .eq('entry_type', HABITS_STORAGE_KEY);
            
          if (deleteError) {
            console.error('Error deleting existing habits in Supabase:', deleteError);
          }
          
          const { error: insertError } = await supabase
            .from('user_entries')
            .insert(
              habitsToSave.map(habit => ({
                entry_type: HABITS_STORAGE_KEY,
                content: JSON.stringify(habit)
              }))
            );
            
          if (insertError) {
            console.error('Error saving habits to Supabase:', insertError);
          } else {
            console.log('Habits saved to Supabase successfully');
          }
        }
        
        // For logs, delete existing entries and insert new ones
        if (logsToSave.length > 0) {
          const { error: deleteError } = await supabase
            .from('user_entries')
            .delete()
            .eq('entry_type', HABIT_LOGS_STORAGE_KEY);
            
          if (deleteError) {
            console.error('Error deleting existing habit logs in Supabase:', deleteError);
          }
          
          const { error: insertError } = await supabase
            .from('user_entries')
            .insert(
              logsToSave.map(log => ({
                entry_type: HABIT_LOGS_STORAGE_KEY,
                content: JSON.stringify(log)
              }))
            );
            
          if (insertError) {
            console.error('Error saving habit logs to Supabase:', insertError);
          } else {
            console.log('Habit logs saved to Supabase successfully');
          }
        }
      }
    } catch (error) {
      console.error('Error in saveHabitsToStorage:', error);
      toast({
        title: "Error saving data",
        description: "There was an error saving your habits data.",
        variant: "destructive"
      });
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
