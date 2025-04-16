
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
  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> => {
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
    
    // Update state with new habit - create a new array to ensure React detects the change
    const updatedHabits = [...habits, newHabit];
    console.log('Setting habits with new habit included, new count:', updatedHabits.length);
    
    // Use setHabits to update and persist the habits
    setHabits(updatedHabits);
    
    // Force the localStorage update (even though this should already happen via setHabits)
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        console.log('Manually forced saving habits to localStorage, count:', updatedHabits.length);
      } catch (err) {
        console.error('Error manually saving habits to localStorage:', err);
      }
    }
    
    // Return the newly created habit
    return newHabit;
  };

  // Update an existing habit
  const updateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
    console.log(`Updating habit ${id} with:`, updates);
    
    const updatedHabits = habits.map(habit => {
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
    setHabits(updatedHabits);
    
    // Also force update localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        console.log('Manually forced saving updated habits to localStorage');
      } catch (err) {
        console.error('Error manually saving updated habits to localStorage:', err);
      }
    }
  };

  // Delete a habit and its associated logs
  const deleteHabit = (id: string): void => {
    console.log(`Deleting habit ${id}`);
    
    // Remove the habit
    const updatedHabits = habits.filter(habit => habit.id !== id);
    console.log('Habits after deletion:', updatedHabits.length);
    setHabits(updatedHabits);
    
    // Remove all logs associated with this habit
    const updatedLogs = habitLogs.filter(log => log.habitId !== id);
    console.log('Logs after habit deletion:', updatedLogs.length);
    setHabitLogs(updatedLogs);
    
    // Force update localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        localStorage.setItem('habitLogs', JSON.stringify(updatedLogs));
        console.log('Manually forced saving after habit deletion');
      } catch (err) {
        console.error('Error manually saving after habit deletion:', err);
      }
    }
  };

  // Log progress for a habit
  const logProgress = (logData: Omit<HabitLog, 'id'>): void => {
    console.log('Logging progress:', logData);
    
    const newLog: HabitLog = {
      id: uuidv4(),
      ...logData,
    };
    
    // Add the new log
    const updatedLogs = [...habitLogs, newLog];
    console.log('Updated habit logs:', updatedLogs.length);
    setHabitLogs(updatedLogs);
    
    // Update the habit's updatedAt timestamp
    const updatedHabits = habits.map(habit => {
      if (habit.id === logData.habitId) {
        return {
          ...habit,
          updatedAt: new Date()
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    
    // Force update localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('habitLogs', JSON.stringify(updatedLogs));
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        console.log('Manually forced saving after logging progress');
      } catch (err) {
        console.error('Error manually saving after logging progress:', err);
      }
    }
    
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
