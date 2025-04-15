
import { useState } from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

export const useHabitOperations = (
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
  habitLogs: HabitLog[],
  setHabitLogs: React.Dispatch<React.SetStateAction<HabitLog[]>>
) => {
  // Retrieve a habit by its ID
  const getHabitById = (id: string): Habit | undefined => {
    return habits.find(habit => habit.id === id);
  };

  // Add a new habit
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Habit => {
    console.log('Adding new habit with data:', habitData);
    
    // Validate required fields
    if (!habitData.name || !habitData.metric || !habitData.target || !habitData.frequency) {
      console.error('Missing required fields for habit:', habitData);
      toast({
        title: "Error",
        description: "Missing required fields for habit",
        variant: "destructive",
      });
      throw new Error('Missing required habit fields');
    }
    
    const now = new Date();
    const newHabit: Habit = {
      id: uuidv4(),
      ...habitData,
      createdAt: now,
      updatedAt: now,
      streak: 0,  // Initialize with zero streak
    };

    console.log('Created new habit object:', newHabit);
    
    // Update state with new habit
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    
    // Return the newly created habit
    return newHabit;
  };

  // Update an existing habit
  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>): void => {
    console.log(`Updating habit ${id} with:`, updates);
    
    setHabits(prev => {
      const updatedHabits = prev.map(habit => {
        if (habit.id === id) {
          const updatedHabit = {
            ...habit,
            ...updates,
            updatedAt: new Date()
          };
          console.log('Updated habit:', updatedHabit);
          return updatedHabit;
        }
        return habit;
      });
      
      console.log('Updated habits state with', updatedHabits.length, 'habits');
      return updatedHabits;
    });
  };

  // Delete a habit and its associated logs
  const deleteHabit = (id: string): void => {
    console.log(`Deleting habit ${id}`);
    
    // Remove the habit
    setHabits(prev => {
      const updatedHabits = prev.filter(habit => habit.id !== id);
      console.log('Habits after deletion:', updatedHabits.length);
      return updatedHabits;
    });
    
    // Remove all logs associated with this habit
    setHabitLogs(prev => {
      const updatedLogs = prev.filter(log => log.habitId !== id);
      console.log('Logs after habit deletion:', updatedLogs.length);
      return updatedLogs;
    });
  };

  // Log progress for a habit
  const logProgress = (logData: Omit<HabitLog, 'id'>): void => {
    console.log('Logging progress:', logData);
    
    const newLog: HabitLog = {
      id: uuidv4(),
      ...logData,
    };
    
    // Add the new log
    setHabitLogs(prev => {
      const updatedLogs = [...prev, newLog];
      console.log('Updated habit logs:', updatedLogs.length);
      return updatedLogs;
    });
    
    // Update the habit's updatedAt timestamp
    setHabits(prev => {
      return prev.map(habit => {
        if (habit.id === logData.habitId) {
          return {
            ...habit,
            updatedAt: new Date()
          };
        }
        return habit;
      });
    });
    
    // Show success toast
    toast({
      title: "Progress Logged",
      description: "Your habit progress has been recorded",
    });
  };

  // Get logs for a specific habit
  const getHabitLogs = (habitId: string): HabitLog[] => {
    return habitLogs.filter(log => log.habitId === habitId);
  };

  return {
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    getHabitLogs
  };
};
