import { ThreeYearGoal, NinetyDayTarget, Plan } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from './types';

// Local storage keys
const THREE_YEAR_GOALS_STORAGE_KEY = 'threeYearGoals';
const NINETY_DAY_TARGETS_STORAGE_KEY = 'ninetyDayTargets';
const PLANS_STORAGE_KEY = 'plans';

// Helper functions
const getStoredThreeYearGoals = (): ThreeYearGoal[] => {
  const storedGoals = localStorage.getItem(THREE_YEAR_GOALS_STORAGE_KEY);
  return storedGoals ? JSON.parse(storedGoals) : [];
};

const getStoredNinetyDayTargets = (): NinetyDayTarget[] => {
  const storedTargets = localStorage.getItem(NINETY_DAY_TARGETS_STORAGE_KEY);
  return storedTargets ? JSON.parse(storedTargets) : [];
};

const getStoredPlans = (): Plan[] => {
  const storedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
  
  // Migrate from old weeklyGoals to plans if needed
  if (!storedPlans) {
    const oldWeeklyGoals = localStorage.getItem('weeklyGoals');
    if (oldWeeklyGoals) {
      localStorage.setItem(PLANS_STORAGE_KEY, oldWeeklyGoals);
      return JSON.parse(oldWeeklyGoals);
    }
  }
  
  return storedPlans ? JSON.parse(storedPlans) : [];
};

const storeThreeYearGoals = (goals: ThreeYearGoal[]): void => {
  localStorage.setItem(THREE_YEAR_GOALS_STORAGE_KEY, JSON.stringify(goals));
};

const storeNinetyDayTargets = (targets: NinetyDayTarget[]): void => {
  localStorage.setItem(NINETY_DAY_TARGETS_STORAGE_KEY, JSON.stringify(targets));
};

const storePlans = (plans: Plan[]): void => {
  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
};

// Three Year Goal API methods
export const getThreeYearGoals = async (): Promise<ApiResponse<ThreeYearGoal[]>> => {
  try {
    const goals = getStoredThreeYearGoals();
    return { success: true, data: goals };
  } catch (error) {
    console.error('Error fetching three-year goals:', error);
    return { success: false, error: 'Failed to fetch three-year goals' };
  }
};

export const createThreeYearGoal = async (goal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ThreeYearGoal>> => {
  try {
    const goals = getStoredThreeYearGoals();
    const newGoal: ThreeYearGoal = {
      ...goal,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedGoals = [...goals, newGoal];
    storeThreeYearGoals(updatedGoals);
    
    return { success: true, data: newGoal };
  } catch (error) {
    console.error('Error creating three-year goal:', error);
    return { success: false, error: 'Failed to create three-year goal' };
  }
};

export const updateThreeYearGoal = async (id: string, updates: Partial<ThreeYearGoal>): Promise<ApiResponse<ThreeYearGoal>> => {
  try {
    const goals = getStoredThreeYearGoals();
    const goalIndex = goals.findIndex(goal => goal.id === id);
    
    if (goalIndex === -1) {
      return { success: false, error: 'Three-year goal not found' };
    }
    
    const updatedGoal = { 
      ...goals[goalIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    goals[goalIndex] = updatedGoal;
    storeThreeYearGoals(goals);
    
    return { success: true, data: updatedGoal };
  } catch (error) {
    console.error('Error updating three-year goal:', error);
    return { success: false, error: 'Failed to update three-year goal' };
  }
};

export const deleteThreeYearGoal = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const goals = getStoredThreeYearGoals();
    const updatedGoals = goals.filter(goal => goal.id !== id);
    
    if (updatedGoals.length === goals.length) {
      return { success: false, error: 'Three-year goal not found' };
    }
    
    storeThreeYearGoals(updatedGoals);
    
    // Delete associated 90-day targets
    const targets = getStoredNinetyDayTargets();
    const updatedTargets = targets.filter(target => target.threeYearGoalId !== id);
    storeNinetyDayTargets(updatedTargets);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting three-year goal:', error);
    return { success: false, error: 'Failed to delete three-year goal' };
  }
};

// 90-Day Target API methods
export const getNinetyDayTargets = async (): Promise<ApiResponse<NinetyDayTarget[]>> => {
  try {
    const targets = getStoredNinetyDayTargets();
    return { success: true, data: targets };
  } catch (error) {
    console.error('Error fetching 90-day targets:', error);
    return { success: false, error: 'Failed to fetch 90-day targets' };
  }
};

export const createNinetyDayTarget = async (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<NinetyDayTarget>> => {
  try {
    const targets = getStoredNinetyDayTargets();
    const newTarget: NinetyDayTarget = {
      ...target,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedTargets = [...targets, newTarget];
    storeNinetyDayTargets(updatedTargets);
    
    return { success: true, data: newTarget };
  } catch (error) {
    console.error('Error creating 90-day target:', error);
    return { success: false, error: 'Failed to create 90-day target' };
  }
};

export const updateNinetyDayTarget = async (id: string, updates: Partial<NinetyDayTarget>): Promise<ApiResponse<NinetyDayTarget>> => {
  try {
    const targets = getStoredNinetyDayTargets();
    const targetIndex = targets.findIndex(target => target.id === id);
    
    if (targetIndex === -1) {
      return { success: false, error: '90-day target not found' };
    }
    
    const updatedTarget = { 
      ...targets[targetIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    targets[targetIndex] = updatedTarget;
    storeNinetyDayTargets(targets);
    
    return { success: true, data: updatedTarget };
  } catch (error) {
    console.error('Error updating 90-day target:', error);
    return { success: false, error: 'Failed to update 90-day target' };
  }
};

export const deleteNinetyDayTarget = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const targets = getStoredNinetyDayTargets();
    const updatedTargets = targets.filter(target => target.id !== id);
    
    if (updatedTargets.length === targets.length) {
      return { success: false, error: '90-day target not found' };
    }
    
    storeNinetyDayTargets(updatedTargets);
    
    // Delete associated weekly goals
    const plans = getStoredPlans();
    const updatedPlans = plans.filter(plan => plan.ninetyDayTargetId !== id);
    storePlans(updatedPlans);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting 90-day target:', error);
    return { success: false, error: 'Failed to delete 90-day target' };
  }
};

// Plan API methods
export const getPlans = async (): Promise<ApiResponse<Plan[]>> => {
  try {
    const plans = getStoredPlans();
    return { success: true, data: plans };
  } catch (error) {
    console.error('Error fetching plans:', error);
    return { success: false, error: 'Failed to fetch plans' };
  }
};

export const createPlan = async (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Plan>> => {
  try {
    const plans = getStoredPlans();
    const newPlan: Plan = {
      ...plan,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedPlans = [...plans, newPlan];
    storePlans(updatedPlans);
    
    return { success: true, data: newPlan };
  } catch (error) {
    console.error('Error creating plan:', error);
    return { success: false, error: 'Failed to create plan' };
  }
};

export const updatePlan = async (id: string, updates: Partial<Plan>): Promise<ApiResponse<Plan>> => {
  try {
    const plans = getStoredPlans();
    const planIndex = plans.findIndex(plan => plan.id === id);
    
    if (planIndex === -1) {
      return { success: false, error: 'Plan not found' };
    }
    
    const updatedPlan = { 
      ...plans[planIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    plans[planIndex] = updatedPlan;
    storePlans(plans);
    
    return { success: true, data: updatedPlan };
  } catch (error) {
    console.error('Error updating plan:', error);
    return { success: false, error: 'Failed to update plan' };
  }
};

export const deletePlan = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const plans = getStoredPlans();
    const updatedPlans = plans.filter(plan => plan.id !== id);
    
    if (updatedPlans.length === plans.length) {
      return { success: false, error: 'Plan not found' };
    }
    
    storePlans(updatedPlans);
    return { success: true };
  } catch (error) {
    console.error('Error deleting plan:', error);
    return { success: false, error: 'Failed to delete plan' };
  }
};

// For backwards compatibility - these will call the Plan methods
export const getWeeklyGoals = getPlans;
export const createWeeklyGoal = createPlan;
export const updateWeeklyGoal = updatePlan;
export const deleteWeeklyGoal = deletePlan;
