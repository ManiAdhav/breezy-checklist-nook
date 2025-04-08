import { Plan } from '@/types/task';
import { ApiResponse } from '../types';
import { generateId } from '@/utils/taskUtils';
import { 
  PLANS_STORAGE_KEY,
  getStoredData, 
  storeData
} from './storage/index';
import { handleServiceError } from './storage/errorHandling';

export const getPlans = async (): Promise<ApiResponse<Plan[]>> => {
  try {
    const plans = await getStoredData<Plan>(PLANS_STORAGE_KEY);
    return { success: true, data: plans };
  } catch (error) {
    return handleServiceError<Plan[]>(error, 'Failed to fetch plans');
  }
};

export const createPlan = async (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Plan>> => {
  try {
    const plans = await getStoredData<Plan>(PLANS_STORAGE_KEY);
    const newPlan: Plan = {
      ...plan,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedPlans = [...plans, newPlan];
    await storeData(PLANS_STORAGE_KEY, updatedPlans);
    
    return { success: true, data: newPlan };
  } catch (error) {
    return handleServiceError<Plan>(error, 'Failed to create plan');
  }
};

export const updatePlan = async (id: string, updates: Partial<Plan>): Promise<ApiResponse<Plan>> => {
  try {
    const plans = await getStoredData<Plan>(PLANS_STORAGE_KEY);
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
    await storeData(PLANS_STORAGE_KEY, plans);
    
    return { success: true, data: updatedPlan };
  } catch (error) {
    return handleServiceError<Plan>(error, 'Failed to update plan');
  }
};

export const deletePlan = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const plans = await getStoredData<Plan>(PLANS_STORAGE_KEY);
    const updatedPlans = plans.filter(plan => plan.id !== id);
    
    if (updatedPlans.length === plans.length) {
      return { success: false, error: 'Plan not found' };
    }
    
    await storeData(PLANS_STORAGE_KEY, updatedPlans);
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete plan');
  }
};

// For backwards compatibility
export const getWeeklyGoals = getPlans;
export const createWeeklyGoal = createPlan;
export const updateWeeklyGoal = updatePlan;
export const deleteWeeklyGoal = deletePlan;
