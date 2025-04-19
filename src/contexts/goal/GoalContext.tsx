
import React, { createContext, useState, useEffect } from 'react';
import { Goals, NinetyDayTarget, Plan } from '@/types/task';
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
import {
  fetchPlans,
  addPlan,
  updatePlan,
  deletePlan
} from './plans';

export const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threeYearGoals, setThreeYearGoals] = useState<Goals[]>([]);
  const [ninetyDayTargets, setNinetyDayTargets] = useState<NinetyDayTarget[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load all data in parallel
        const [goalsData, targetsData, plansData] = await Promise.all([
          fetchData<Goals>('goals', 'threeYearGoals'),
          fetchData<NinetyDayTarget>('targets', 'ninetyDayTargets'),
          fetchData<Plan>('plans', 'plans')
        ]);

        // Parse dates (convert string dates back to Date objects)
        const processedGoals = goalsData.map(goal => ({
          ...goal,
          startDate: new Date(goal.startDate),
          endDate: new Date(goal.endDate),
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt)
        }));

        const processedTargets = targetsData.map(target => ({
          ...target,
          startDate: new Date(target.startDate),
          endDate: new Date(target.endDate),
          createdAt: new Date(target.createdAt),
          updatedAt: new Date(target.updatedAt)
        }));

        const processedPlans = plansData.map(plan => ({
          ...plan,
          startDate: new Date(plan.startDate),
          endDate: new Date(plan.endDate),
          createdAt: new Date(plan.createdAt),
          updatedAt: new Date(plan.updatedAt)
        }));

        setThreeYearGoals(processedGoals);
        setNinetyDayTargets(processedTargets);
        setPlans(processedPlans);

        console.log('Loaded goals:', processedGoals.length);
        console.log('Loaded targets:', processedTargets.length);
        console.log('Loaded plans:', processedPlans.length);
      } catch (error) {
        console.error('Error loading goals data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <GoalContext.Provider value={{
      threeYearGoals,
      ninetyDayTargets,
      plans,
      addThreeYearGoal: (goal) => addThreeYearGoal(goal, setThreeYearGoals, setIsLoading),
      updateThreeYearGoal: (id, updates) => updateThreeYearGoal(id, updates, setThreeYearGoals, setIsLoading),
      deleteThreeYearGoal: (id) => deleteThreeYearGoal(id, setThreeYearGoals, setNinetyDayTargets, setIsLoading),
      addNinetyDayTarget: (target) => addNinetyDayTarget(target, setNinetyDayTargets, setIsLoading),
      updateNinetyDayTarget: (id, updates) => updateNinetyDayTarget(id, updates, setNinetyDayTargets, setIsLoading),
      deleteNinetyDayTarget: (id) => deleteNinetyDayTarget(id, setNinetyDayTargets, setPlans, setIsLoading),
      addPlan: (plan) => addPlan(plan, setPlans, setIsLoading),
      updatePlan: (id, updates) => updatePlan(id, updates, setPlans, setIsLoading),
      deletePlan: (id) => deletePlan(id, setPlans, setIsLoading),
      isLoading
    }}>
      {children}
    </GoalContext.Provider>
  );
};
