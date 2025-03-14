
import { ApiResponse } from '../types';

// Local storage keys
export const THREE_YEAR_GOALS_STORAGE_KEY = 'threeYearGoals';
export const NINETY_DAY_TARGETS_STORAGE_KEY = 'ninetyDayTargets';
export const PLANS_STORAGE_KEY = 'plans';

// Generic storage helper functions
export const getStoredData = <T>(key: string): T[] => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

export const storeData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const handleServiceError = <T>(error: unknown, errorMessage: string): ApiResponse<T> => {
  console.error(errorMessage, error);
  return { success: false, error: errorMessage };
};
