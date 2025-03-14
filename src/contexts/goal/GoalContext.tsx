
import React, { createContext, useState, useEffect } from 'react';
import { ThreeYearGoal, NinetyDayTarget, Plan } from '@/types/task';
import { GoalContextType } from './types';
import { fetchThreeYearGoals, addThreeYearGoal, updateThreeYearGoal, deleteThreeYearGoal } from './threeYearGoals';
import { fetchNinetyDayTargets, addNinetyDayTarget, updateNinetyDayTarget, deleteNinetyDayTarget } from './ninetyDayTargets';
import { fetchPlans, addPlan, updatePlan, deletePlan } from './plans';

export const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threeYearGoals, setThreeYearGoals] = useState<ThreeYearGoal[]>([]);
  const [ninetyDayTargets, setNinetyDayTargets] = useState<NinetyDayTarget[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchThreeYearGoals(setThreeYearGoals, setIsLoading),
          fetchNinetyDayTargets(setNinetyDayTargets, setIsLoading),
          fetchPlans(setPlans, setIsLoading)
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
