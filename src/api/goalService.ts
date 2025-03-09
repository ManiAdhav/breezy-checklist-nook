
import { ThreeYearGoal, NinetyDayTarget, WeeklyGoal } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from './types';

// Local storage keys
const THREE_YEAR_GOALS_STORAGE_KEY = 'threeYearGoals';
const NINETY_DAY_TARGETS_STORAGE_KEY = 'ninetyDayTargets';
const WEEKLY_GOALS_STORAGE_KEY = 'weeklyGoals';

// Helper functions
const getStoredThreeYearGoals = (): ThreeYearGoal[] => {
  const storedGoals = localStorage.getItem(THREE_YEAR_GOALS_STORAGE_KEY);
  return storedGoals ? JSON.parse(storedGoals) : [];
};

const getStoredNinetyDayTargets = (): NinetyDayTarget[] => {
  const storedTargets = localStorage.getItem(NINETY_DAY_TARGETS_STORAGE_KEY);
  return storedTargets ? JSON.parse(storedTargets) : [];
};

const getStoredWeeklyGoals = (): WeeklyGoal[] => {
  const storedGoals = localStorage.getItem(WEEKLY_GOALS_STORAGE_KEY);
  return storedGoals ? JSON.parse(storedGoals) : [];
};

const storeThreeYearGoals = (goals: ThreeYearGoal[]): void => {
  localStorage.setItem(THREE_YEAR_GOALS_STORAGE_KEY, JSON.stringify(goals));
};

const storeNinetyDayTargets = (targets: NinetyDayTarget[]): void => {
  localStorage.setItem(NINETY_DAY_TARGETS_STORAGE_KEY, JSON.stringify(targets));
};

const storeWeeklyGoals = (goals: WeeklyGoal[]): void => {
  localStorage.setItem(WEEKLY_GOALS_STORAGE_KEY, JSON.stringify(goals));
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
    const weeklyGoals = getStoredWeeklyGoals();
    const updatedWeeklyGoals = weeklyGoals.filter(goal => goal.ninetyDayTargetId !== id);
    storeWeeklyGoals(updatedWeeklyGoals);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting 90-day target:', error);
    return { success: false, error: 'Failed to delete 90-day target' };
  }
};

// Weekly Goal API methods
export const getWeeklyGoals = async (): Promise<ApiResponse<WeeklyGoal[]>> => {
  try {
    const goals = getStoredWeeklyGoals();
    return { success: true, data: goals };
  } catch (error) {
    console.error('Error fetching weekly goals:', error);
    return { success: false, error: 'Failed to fetch weekly goals' };
  }
};

export const createWeeklyGoal = async (goal: Omit<WeeklyGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<WeeklyGoal>> => {
  try {
    const goals = getStoredWeeklyGoals();
    const newGoal: WeeklyGoal = {
      ...goal,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedGoals = [...goals, newGoal];
    storeWeeklyGoals(updatedGoals);
    
    return { success: true, data: newGoal };
  } catch (error) {
    console.error('Error creating weekly goal:', error);
    return { success: false, error: 'Failed to create weekly goal' };
  }
};

export const updateWeeklyGoal = async (id: string, updates: Partial<WeeklyGoal>): Promise<ApiResponse<WeeklyGoal>> => {
  try {
    const goals = getStoredWeeklyGoals();
    const goalIndex = goals.findIndex(goal => goal.id === id);
    
    if (goalIndex === -1) {
      return { success: false, error: 'Weekly goal not found' };
    }
    
    const updatedGoal = { 
      ...goals[goalIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    goals[goalIndex] = updatedGoal;
    storeWeeklyGoals(goals);
    
    return { success: true, data: updatedGoal };
  } catch (error) {
    console.error('Error updating weekly goal:', error);
    return { success: false, error: 'Failed to update weekly goal' };
  }
};

export const deleteWeeklyGoal = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const goals = getStoredWeeklyGoals();
    const updatedGoals = goals.filter(goal => goal.id !== id);
    
    if (updatedGoals.length === goals.length) {
      return { success: false, error: 'Weekly goal not found' };
    }
    
    storeWeeklyGoals(updatedGoals);
    return { success: true };
  } catch (error) {
    console.error('Error deleting weekly goal:', error);
    return { success: false, error: 'Failed to delete weekly goal' };
  }
};
