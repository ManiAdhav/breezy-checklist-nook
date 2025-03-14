
import { useContext } from 'react';
import { GoalContext } from '@/contexts/goal/GoalContext';

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
};
