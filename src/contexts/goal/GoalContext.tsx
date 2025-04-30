
import React, { createContext, useState, useEffect } from 'react';
import { Goals, NinetyDayTarget } from '@/types/task';
import { GoalContextType } from './types';
import { fetchData } from '@/utils/dataSync';
import { 
  fetchThreeYearGoals, 
  addThreeYearGoal, 
  updateThreeYearGoal, 
  deleteThreeYearGoal 
} from './threeYearGoals';
import {
  fetchNinetyDayTargets,
  addNinetyDayTarget,
  updateNinetyDayTarget,
  deleteNinetyDayTarget
} from './ninetyDayTargets';

export const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threeYearGoals, setThreeYearGoals] = useState<Goals[]>([]);
  const [ninetyDayTargets, setNinetyDayTargets] = useState<NinetyDayTarget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    const loadGoalData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching goals and targets data from Supabase...');
        
        // Load all data in parallel
        const [goalsData, targetsData] = await Promise.all([
          fetchData<Goals>('goals', 'threeYearGoals'),
          fetchData<NinetyDayTarget>('targets', 'ninetyDayTargets')
        ]);

        console.log(`Fetched ${goalsData.length} goals and ${targetsData.length} targets from Supabase`);
        console.log('Goals data:', JSON.stringify(goalsData, null, 2));
        console.log('Targets data:', JSON.stringify(targetsData, null, 2));

        // Parse dates (convert string dates back to Date objects)
        const processedGoals = goalsData.map(goal => ({
          ...goal,
          startDate: goal.startDate ? new Date(goal.startDate) : new Date(),
          endDate: goal.endDate ? new Date(goal.endDate) : new Date(),
          createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
          updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date()
        }));

        const processedTargets = targetsData.map(target => ({
          ...target,
          startDate: target.startDate ? new Date(target.startDate) : new Date(),
          endDate: target.endDate ? new Date(target.endDate) : new Date(),
          createdAt: target.createdAt ? new Date(target.createdAt) : new Date(),
          updatedAt: target.updatedAt ? new Date(target.updatedAt) : new Date()
        }));

        setThreeYearGoals(processedGoals);
        setNinetyDayTargets(processedTargets);

        console.log('Processed and loaded goals:', processedGoals.length);
        console.log('Processed and loaded targets:', processedTargets.length);
      } catch (error) {
        console.error('Error loading goals data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Immediately fetch data when component mounts
    loadGoalData();
    
    // Set up a refresh interval for goals data
    const refreshInterval = setInterval(() => {
      console.log('Refreshing goals and targets data...');
      loadGoalData();
    }, 30000); // Refresh every 30 seconds
    
    // Add a visibility change listener for goals data
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, refreshing goal data...');
        loadGoalData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <GoalContext.Provider value={{
      threeYearGoals,
      ninetyDayTargets,
      addThreeYearGoal: (goal) => addThreeYearGoal(goal, setThreeYearGoals, setIsLoading),
      updateThreeYearGoal: (id, updates) => updateThreeYearGoal(id, updates, setThreeYearGoals, setIsLoading),
      deleteThreeYearGoal: (id) => deleteThreeYearGoal(id, setThreeYearGoals, setNinetyDayTargets, setIsLoading),
      addNinetyDayTarget: (target) => addNinetyDayTarget(target, setNinetyDayTargets, setIsLoading),
      updateNinetyDayTarget: (id, updates) => updateNinetyDayTarget(id, updates, setNinetyDayTargets, setIsLoading),
      deleteNinetyDayTarget: (id) => deleteNinetyDayTarget(id, setNinetyDayTargets, setIsLoading),
      isLoading
    }}>
      {children}
    </GoalContext.Provider>
  );
};
