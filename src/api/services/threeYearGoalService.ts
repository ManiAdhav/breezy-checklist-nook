
import { Goals, NinetyDayTarget } from '@/types/task';
import { ApiResponse } from '../types';
import { generateId } from '@/utils/taskUtils';
import { 
  THREE_YEAR_GOALS_STORAGE_KEY, 
  NINETY_DAY_TARGETS_STORAGE_KEY, 
  getStoredData, 
  storeData
} from './storageUtils';
import { handleServiceError } from './errorUtils';

export const getThreeYearGoals = async (): Promise<ApiResponse<Goals[]>> => {
  try {
    const goals = await getStoredData<Goals>(THREE_YEAR_GOALS_STORAGE_KEY);
    return { success: true, data: goals };
  } catch (error) {
    return handleServiceError<Goals[]>(error, 'Failed to fetch goals');
  }
};

export const createThreeYearGoal = async (goal: Omit<Goals, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Goals>> => {
  try {
    const goals = await getStoredData<Goals>(THREE_YEAR_GOALS_STORAGE_KEY);
    const newGoal: Goals = {
      ...goal,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedGoals = [...goals, newGoal];
    await storeData(THREE_YEAR_GOALS_STORAGE_KEY, updatedGoals);
    
    return { success: true, data: newGoal };
  } catch (error) {
    return handleServiceError<Goals>(error, 'Failed to create goal');
  }
};

export const updateThreeYearGoal = async (id: string, updates: Partial<Goals>): Promise<ApiResponse<Goals>> => {
  try {
    const goals = await getStoredData<Goals>(THREE_YEAR_GOALS_STORAGE_KEY);
    const goalIndex = goals.findIndex(goal => goal.id === id);
    
    if (goalIndex === -1) {
      return { success: false, error: 'Goal not found' };
    }
    
    const updatedGoal = { 
      ...goals[goalIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    goals[goalIndex] = updatedGoal;
    await storeData(THREE_YEAR_GOALS_STORAGE_KEY, goals);
    
    return { success: true, data: updatedGoal };
  } catch (error) {
    return handleServiceError<Goals>(error, 'Failed to update goal');
  }
};

export const deleteThreeYearGoal = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const goals = await getStoredData<Goals>(THREE_YEAR_GOALS_STORAGE_KEY);
    const targets = await getStoredData<NinetyDayTarget>(NINETY_DAY_TARGETS_STORAGE_KEY);
    
    const updatedGoals = goals.filter(goal => goal.id !== id);
    const updatedTargets = targets.filter(target => target.threeYearGoalId !== id);
    
    if (updatedGoals.length === goals.length) {
      return { success: false, error: 'Goal not found' };
    }
    
    await storeData(THREE_YEAR_GOALS_STORAGE_KEY, updatedGoals);
    await storeData(NINETY_DAY_TARGETS_STORAGE_KEY, updatedTargets);
    
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete goal');
  }
};
