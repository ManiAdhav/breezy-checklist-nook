
import React, { createContext, useContext } from 'react';
import { HabitContextType } from './types';

const HabitContext = createContext<HabitContextType | null>(null);

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

// Export the context for use in the provider
export { HabitContext };

// Re-export the provider from its dedicated file
export { HabitProvider } from './HabitProvider';
