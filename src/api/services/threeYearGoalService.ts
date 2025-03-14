
import { ThreeYearGoal } from '@/types/task';
import { ApiResponse } from '../types';
import { generateId } from '@/utils/taskUtils';
import { 
  THREE_YEAR_GOALS_STORAGE_KEY, 
  NINETY_DAY_TARGETS_STORAGE_KEY, 
  getStoredData, 
  storeData,
  handleServiceError
} from './baseService';

export const getThreeYearGoals = async (): Promise<ApiResponse<ThreeYearGoal[]>> => {
  try {
    const goals = getStoredData<ThreeYearGoal>(THREE_YEAR_GOALS_STORAGE_KEY);
    return { success: true, data: goals };
  } catch (error) {
    return handleServiceError<ThreeYearGoal[]>(error, 'Failed to fetch three-year goals');
  }
};

export const createThreeYearGoal = async (goal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ThreeYearGoal>> => {
  try {
    const goals = getStoredData<ThreeYearGoal>(THREE_YEAR_GOALS_STORAGE_KEY);
    const newGoal: ThreeYearGoal = {
      ...goal,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedGoals = [...goals, newGoal];
    storeData(THREE_YEAR_GOALS_STORAGE_KEY, updatedGoals);
    
    return { success: true, data: newGoal };
  } catch (error) {
    return handleServiceError<ThreeYearGoal>(error, 'Failed to create three-year goal');
  }
};

export const updateThreeYearGoal = async (id: string, updates: Partial<ThreeYearGoal>): Promise<ApiResponse<ThreeYearGoal>> => {
  try {
    const goals = getStoredData<ThreeYearGoal>(THREE_YEAR_GOALS_STORAGE_KEY);
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
    storeData(THREE_YEAR_GOALS_STORAGE_KEY, goals);
    
    return { success: true, data: updatedGoal };
  } catch (error) {
    return handleServiceError<ThreeYearGoal>(error, 'Failed to update three-year goal');
  }
};

export const deleteThreeYearGoal = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const goals = getStoredData<ThreeYearGoal>(THREE_YEAR_GOALS_STORAGE_KEY);
    const targets = getStoredData(NINETY_DAY_TARGETS_STORAGE_KEY);
    
    const updatedGoals = goals.filter(goal => goal.id !== id);
    const updatedTargets = targets.filter(target => target.threeYearGoalId !== id);
    
    if (updatedGoals.length === goals.length) {
      return { success: false, error: 'Three-year goal not found' };
    }
    
    storeData(THREE_YEAR_GOALS_STORAGE_KEY, updatedGoals);
    storeData(NINETY_DAY_TARGETS_STORAGE_KEY, updatedTargets);
    
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete three-year goal');
  }
};
