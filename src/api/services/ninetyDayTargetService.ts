
import { NinetyDayTarget, Plan } from '@/types/task';
import { ApiResponse } from '../types';
import { generateId } from '@/utils/taskUtils';
import { 
  NINETY_DAY_TARGETS_STORAGE_KEY, 
  PLANS_STORAGE_KEY,
  getStoredData, 
  storeData
} from './storageUtils';
import { handleServiceError } from './errorUtils';

export const getNinetyDayTargets = async (): Promise<ApiResponse<NinetyDayTarget[]>> => {
  try {
    const targets = await getStoredData<NinetyDayTarget>(NINETY_DAY_TARGETS_STORAGE_KEY);
    return { success: true, data: targets };
  } catch (error) {
    return handleServiceError<NinetyDayTarget[]>(error, 'Failed to fetch 90-day targets');
  }
};

export const createNinetyDayTarget = async (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<NinetyDayTarget>> => {
  try {
    const targets = await getStoredData<NinetyDayTarget>(NINETY_DAY_TARGETS_STORAGE_KEY);
    const newTarget: NinetyDayTarget = {
      ...target,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedTargets = [...targets, newTarget];
    await storeData(NINETY_DAY_TARGETS_STORAGE_KEY, updatedTargets);
    
    return { success: true, data: newTarget };
  } catch (error) {
    return handleServiceError<NinetyDayTarget>(error, 'Failed to create 90-day target');
  }
};

export const updateNinetyDayTarget = async (id: string, updates: Partial<NinetyDayTarget>): Promise<ApiResponse<NinetyDayTarget>> => {
  try {
    const targets = await getStoredData<NinetyDayTarget>(NINETY_DAY_TARGETS_STORAGE_KEY);
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
    await storeData(NINETY_DAY_TARGETS_STORAGE_KEY, targets);
    
    return { success: true, data: updatedTarget };
  } catch (error) {
    return handleServiceError<NinetyDayTarget>(error, 'Failed to update 90-day target');
  }
};

export const deleteNinetyDayTarget = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const targets = await getStoredData<NinetyDayTarget>(NINETY_DAY_TARGETS_STORAGE_KEY);
    const plans = await getStoredData<Plan>(PLANS_STORAGE_KEY);
    
    const updatedTargets = targets.filter(target => target.id !== id);
    const updatedPlans = plans.filter(plan => plan.ninetyDayTargetId !== id);
    
    if (updatedTargets.length === targets.length) {
      return { success: false, error: '90-day target not found' };
    }
    
    await storeData(NINETY_DAY_TARGETS_STORAGE_KEY, updatedTargets);
    await storeData(PLANS_STORAGE_KEY, updatedPlans);
    
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete 90-day target');
  }
};
