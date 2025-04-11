
import { useState } from 'react';
import { Habit, HabitLog } from '@/types/habit';
import { v4 as uuidv4 } from 'uuid';

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
    
    const now = new Date();
    const newHabit: Habit = {
      id: uuidv4(),
      ...habitData,
      createdAt: now,
      updatedAt: now,
      streak: 0,  // Initialize with zero streak
    };

    console.log('Created new habit object:', newHabit);
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  // Update an existing habit
  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>): void => {
    console.log(`Updating habit ${id} with:`, updates);
    
    setHabits(prev => {
      return prev.map(habit => {
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
    });
  };

  // Delete a habit and its associated logs
  const deleteHabit = (id: string): void => {
    console.log(`Deleting habit ${id}`);
    
    // Remove the habit
    setHabits(prev => prev.filter(habit => habit.id !== id));
    
    // Remove all logs associated with this habit
    setHabitLogs(prev => prev.filter(log => log.habitId !== id));
  };

  // Log progress for a habit
  const logProgress = (logData: Omit<HabitLog, 'id'>): void => {
    console.log('Logging progress:', logData);
    
    const newLog: HabitLog = {
      id: uuidv4(),
      ...logData,
    };
    
    // Add the new log
    setHabitLogs(prev => [...prev, newLog]);
    
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
