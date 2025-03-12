import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThreeYearGoal, NinetyDayTarget, Plan, GoalStatus } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import * as GoalService from '@/api/goalService';

interface GoalContextType {
  threeYearGoals: ThreeYearGoal[];
  ninetyDayTargets: NinetyDayTarget[];
  plans: Plan[];
  addThreeYearGoal: (goal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ThreeYearGoal | undefined>;
  updateThreeYearGoal: (id: string, updates: Partial<ThreeYearGoal>) => void;
  deleteThreeYearGoal: (id: string) => void;
  addNinetyDayTarget: (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<NinetyDayTarget | undefined>;
  updateNinetyDayTarget: (id: string, updates: Partial<NinetyDayTarget>) => void;
  deleteNinetyDayTarget: (id: string) => void;
  addPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Plan | undefined>;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  isLoading: boolean;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threeYearGoals, setThreeYearGoals] = useState<ThreeYearGoal[]>([]);
  const [ninetyDayTargets, setNinetyDayTargets] = useState<NinetyDayTarget[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [goalsResponse, targetsResponse, plansResponse] = await Promise.all([
          GoalService.getThreeYearGoals(),
          GoalService.getNinetyDayTargets(),
          GoalService.getPlans()
        ]);
        
        if (goalsResponse.success && goalsResponse.data) {
          setThreeYearGoals(goalsResponse.data);
        }
        
        if (targetsResponse.success && targetsResponse.data) {
          setNinetyDayTargets(targetsResponse.data);
        }
        
        if (plansResponse.success && plansResponse.data) {
          setPlans(plansResponse.data);
        }
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

    fetchData();
  }, []);

  const addThreeYearGoal = async (goal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await GoalService.createThreeYearGoal(goal);
      
      if (response.success && response.data) {
        setThreeYearGoals(prevGoals => [...prevGoals, response.data!]);
        toast({
          title: "Goal added",
          description: "Your three-year goal was added successfully.",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add goal');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const updateThreeYearGoal = async (id: string, updates: Partial<ThreeYearGoal>) => {
    setIsLoading(true);
    try {
      const response = await GoalService.updateThreeYearGoal(id, updates);
      
      if (response.success && response.data) {
        setThreeYearGoals(prevGoals => 
          prevGoals.map(goal => 
            goal.id === id ? response.data! : goal
          )
        );
        toast({
          title: "Goal updated",
          description: "Your three-year goal was updated successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to update goal');
      }
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

  const deleteThreeYearGoal = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await GoalService.deleteThreeYearGoal(id);
      
      if (response.success) {
        setThreeYearGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
        
        setNinetyDayTargets(prevTargets => prevTargets.filter(target => target.threeYearGoalId !== id));
        
        toast({
          title: "Goal deleted",
          description: "Your three-year goal was deleted successfully.",
          variant: "destructive",
        });
      } else {
        throw new Error(response.error || 'Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNinetyDayTarget = async (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await GoalService.createNinetyDayTarget(target);
      
      if (response.success && response.data) {
        setNinetyDayTargets(prevTargets => [...prevTargets, response.data!]);
        toast({
          title: "Target added",
          description: "Your 90-day target was added successfully.",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add target');
      }
    } catch (error) {
      console.error('Error adding target:', error);
      toast({
        title: "Error",
        description: "Failed to add target",
        variant: "destructive",
      });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNinetyDayTarget = async (id: string, updates: Partial<NinetyDayTarget>) => {
    setIsLoading(true);
    try {
      const response = await GoalService.updateNinetyDayTarget(id, updates);
      
      if (response.success && response.data) {
        setNinetyDayTargets(prevTargets => 
          prevTargets.map(target => 
            target.id === id ? response.data! : target
          )
        );
        toast({
          title: "Target updated",
          description: "Your 90-day target was updated successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to update target');
      }
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

  const deleteNinetyDayTarget = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await GoalService.deleteNinetyDayTarget(id);
      
      if (response.success) {
        setNinetyDayTargets(prevTargets => prevTargets.filter(target => target.id !== id));
        
        setPlans(prevPlans => prevPlans.filter(plan => plan.ninetyDayTargetId !== id));
        
        toast({
          title: "Target deleted",
          description: "Your 90-day target was deleted successfully.",
          variant: "destructive",
        });
      } else {
        throw new Error(response.error || 'Failed to delete target');
      }
    } catch (error) {
      console.error('Error deleting target:', error);
      toast({
        title: "Error",
        description: "Failed to delete target",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPlan = async (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await GoalService.createPlan(plan);
      
      if (response.success && response.data) {
        setPlans(prevPlans => [...prevPlans, response.data!]);
        toast({
          title: "Plan added",
          description: "Your plan was added successfully.",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add plan');
      }
    } catch (error) {
      console.error('Error adding plan:', error);
      toast({
        title: "Error",
        description: "Failed to add plan",
        variant: "destructive",
      });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    setIsLoading(true);
    try {
      const response = await GoalService.updatePlan(id, updates);
      
      if (response.success && response.data) {
        setPlans(prevPlans => 
          prevPlans.map(plan => 
            plan.id === id ? response.data! : plan
          )
        );
        toast({
          title: "Plan updated",
          description: "Your plan was updated successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to update plan');
      }
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

  const deletePlan = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await GoalService.deletePlan(id);
      
      if (response.success) {
        setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
        
        toast({
          title: "Plan deleted",
          description: "Your plan was deleted successfully.",
          variant: "destructive",
        });
      } else {
        throw new Error(response.error || 'Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
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

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
};
