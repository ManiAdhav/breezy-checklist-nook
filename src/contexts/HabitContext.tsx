
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitLog, HabitStreak } from '@/types/habit';

interface HabitContextType {
  habits: Habit[];
  habitLogs: HabitLog[];
  isLoading: boolean;
  getHabitById: (id: string) => Habit | undefined;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Habit;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteHabit: (id: string) => void;
  logProgress: (log: Omit<HabitLog, 'id'>) => void;
  getHabitLogs: (habitId: string) => HabitLog[];
  getHabitStreak: (habitId: string) => HabitStreak;
}

const HabitContext = createContext<HabitContextType | null>(null);

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const getHabitById = (id: string) => {
    return habits.find(habit => habit.id === id);
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setHabits(prevHabits => [...prevHabits, newHabit]);
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id 
          ? { ...habit, ...updates, updatedAt: new Date() } 
          : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
    setHabitLogs(prevLogs => prevLogs.filter(log => log.habitId !== id));
  };

  const logProgress = (log: Omit<HabitLog, 'id'>) => {
    const newLog: HabitLog = {
      ...log,
      id: uuidv4(),
    };
    
    setHabitLogs(prevLogs => [...prevLogs, newLog]);
  };

  const getHabitLogs = (habitId: string) => {
    return habitLogs
      .filter(log => log.habitId === habitId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const getHabitStreak = (habitId: string): HabitStreak => {
    const logs = getHabitLogs(habitId);
    
    if (logs.length === 0) {
      return { current: 0, longest: 0 };
    }
    
    // Sort logs by date in ascending order
    const sortedLogs = [...logs].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Initialize variables
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;
    
    // Calculate streak
    sortedLogs.forEach(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        // First log
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const dayDiff = Math.floor((logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (dayDiff > 1) {
          // Break in streak
          currentStreak = 1;
        }
      }
      
      lastDate = logDate;
    });
    
    // Check if the streak is current (last log is from today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastLogDate = logs[0]?.date;
    if (lastLogDate) {
      const lastLogDay = new Date(lastLogDate);
      lastLogDay.setHours(0, 0, 0, 0);
      
      const daysSinceLastLog = Math.floor((today.getTime() - lastLogDay.getTime()) / (1000 * 60 * 60 * 24));
      
      // If the last log is older than yesterday, reset current streak
      if (daysSinceLastLog > 1) {
        currentStreak = 0;
      }
    }
    
    return {
      current: currentStreak,
      longest: longestStreak,
      lastLoggedDate: logs[0]?.date
    };
  };

  const value = {
    habits,
    habitLogs,
    isLoading,
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    getHabitLogs,
    getHabitStreak
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
