
import React, { createContext, useState, useEffect } from 'react';
import { Goals, NinetyDayTarget, Plan } from '@/types/task';
import { GoalContextType } from './types';
import { fetchData, saveData } from '@/utils/dataSync';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

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
        toast({
          title: "Error",
          description: "Failed to load goals data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Add three year goal
  const addThreeYearGoal = async (goal: Omit<Goals, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const newGoal: Goals = {
        ...goal,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };

      const updatedGoals = [...threeYearGoals, newGoal];
      setThreeYearGoals(updatedGoals);
      
      // Save to storage
      await saveData('goals', 'threeYearGoals', updatedGoals);
      
      return newGoal;
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update three year goal
  const updateThreeYearGoal = async (id: string, updates: Partial<Goals>) => {
    setIsLoading(true);
    try {
      const updatedGoals = threeYearGoals.map(goal => 
        goal.id === id 
          ? { ...goal, ...updates, updatedAt: new Date() } 
          : goal
      );
      
      setThreeYearGoals(updatedGoals);
      
      // Save to storage
      await saveData('goals', 'threeYearGoals', updatedGoals);
      
      return updatedGoals.find(goal => goal.id === id);
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete three year goal
  const deleteThreeYearGoal = async (id: string) => {
    setIsLoading(true);
    try {
      // Delete the goal
      const updatedGoals = threeYearGoals.filter(goal => goal.id !== id);
      setThreeYearGoals(updatedGoals);
      
      // Delete associated targets
      const goalTargets = ninetyDayTargets.filter(target => target.threeYearGoalId === id);
      const goalTargetIds = goalTargets.map(target => target.id);
      
      const updatedTargets = ninetyDayTargets.filter(target => target.threeYearGoalId !== id);
      setNinetyDayTargets(updatedTargets);
      
      // Delete plans associated with these targets
      const updatedPlans = plans.filter(plan => !goalTargetIds.includes(plan.ninetyDayTargetId));
      setPlans(updatedPlans);
      
      // Save all updates to storage
      await Promise.all([
        saveData('goals', 'threeYearGoals', updatedGoals),
        saveData('targets', 'ninetyDayTargets', updatedTargets),
        saveData('plans', 'plans', updatedPlans)
      ]);
      
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add ninety day target
  const addNinetyDayTarget = async (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const newTarget: NinetyDayTarget = {
        ...target,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };

      const updatedTargets = [...ninetyDayTargets, newTarget];
      setNinetyDayTargets(updatedTargets);
      
      // Save to storage
      await saveData('targets', 'ninetyDayTargets', updatedTargets);
      
      return newTarget;
    } catch (error) {
      console.error('Error adding target:', error);
      toast({
        title: "Error",
        description: "Failed to add target",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update ninety day target
  const updateNinetyDayTarget = async (id: string, updates: Partial<NinetyDayTarget>) => {
    setIsLoading(true);
    try {
      const updatedTargets = ninetyDayTargets.map(target => 
        target.id === id 
          ? { ...target, ...updates, updatedAt: new Date() } 
          : target
      );
      
      setNinetyDayTargets(updatedTargets);
      
      // Save to storage
      await saveData('targets', 'ninetyDayTargets', updatedTargets);
      
      return updatedTargets.find(target => target.id === id);
    } catch (error) {
      console.error('Error updating target:', error);
      toast({
        title: "Error",
        description: "Failed to update target",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete ninety day target
  const deleteNinetyDayTarget = async (id: string) => {
    setIsLoading(true);
    try {
      // Delete the target
      const updatedTargets = ninetyDayTargets.filter(target => target.id !== id);
      setNinetyDayTargets(updatedTargets);
      
      // Delete associated plans
      const updatedPlans = plans.filter(plan => plan.ninetyDayTargetId !== id);
      setPlans(updatedPlans);
      
      // Save all updates to storage
      await Promise.all([
        saveData('targets', 'ninetyDayTargets', updatedTargets),
        saveData('plans', 'plans', updatedPlans)
      ]);
      
      return true;
    } catch (error) {
      console.error('Error deleting target:', error);
      toast({
        title: "Error",
        description: "Failed to delete target",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add plan
  const addPlan = async (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const now = new Date();
      const newPlan: Plan = {
        ...plan,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };

      const updatedPlans = [...plans, newPlan];
      setPlans(updatedPlans);
      
      // Save to storage
      await saveData('plans', 'plans', updatedPlans);
      
      return newPlan;
    } catch (error) {
      console.error('Error adding plan:', error);
      toast({
        title: "Error",
        description: "Failed to add plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update plan
  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    setIsLoading(true);
    try {
      const updatedPlans = plans.map(plan => 
        plan.id === id 
          ? { ...plan, ...updates, updatedAt: new Date() } 
          : plan
      );
      
      setPlans(updatedPlans);
      
      // Save to storage
      await saveData('plans', 'plans', updatedPlans);
      
      return updatedPlans.find(plan => plan.id === id);
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete plan
  const deletePlan = async (id: string) => {
    setIsLoading(true);
    try {
      const updatedPlans = plans.filter(plan => plan.id !== id);
      setPlans(updatedPlans);
      
      // Save to storage
      await saveData('plans', 'plans', updatedPlans);
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoalContext.Provider value={{
      threeYearGoals,
      ninetyDayTargets,
      plans,
      addThreeYearGoal,
      updateThreeYearGoal,
      deleteThreeYearGoal,
      addNinetyDayTarget,
      updateNinetyDayTarget,
      deleteNinetyDayTarget,
      addPlan,
      updatePlan,
      deletePlan,
      isLoading
    }}>
      {children}
    </GoalContext.Provider>
  );
};
