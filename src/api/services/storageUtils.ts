
// Local storage keys
export const TASKS_STORAGE_KEY = 'tasks';
export const CUSTOM_LISTS_STORAGE_KEY = 'customLists';
export const THREE_YEAR_GOALS_STORAGE_KEY = 'threeYearGoals';
export const NINETY_DAY_TARGETS_STORAGE_KEY = 'ninetyDayTargets';
export const PLANS_STORAGE_KEY = 'plans';
export const NOTEPAD_STORAGE_KEY = 'notepad_content';

// Generic storage helper functions
export const getStoredData = <T>(key: string): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    console.log(`Retrieving data for key ${key}, found:`, storedData ? 'data' : 'nothing');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return [];
  }
};

export const storeData = <T>(key: string, data: T[]): void => {
  try {
    console.log(`Storing data for key ${key}:`, data);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
  }
};

// Specific storage helpers for tasks and lists
export const getStoredTasks = (): any[] => {
  const tasks = getStoredData(TASKS_STORAGE_KEY);
  console.log('Retrieved stored tasks:', tasks);
  return tasks;
};

export const getStoredCustomLists = (): any[] => {
  const lists = getStoredData(CUSTOM_LISTS_STORAGE_KEY);
  console.log('Retrieved stored lists:', lists);
  return lists;
};

export const storeTasks = (tasks: any[]): void => {
  console.log('Storing tasks:', tasks);
  storeData(TASKS_STORAGE_KEY, tasks);
};

export const storeCustomLists = (lists: any[]): void => {
  console.log('Storing lists:', lists);
  storeData(CUSTOM_LISTS_STORAGE_KEY, lists);
};

// Helper for string content storage (for notepad)
export const getStoredContent = (key: string): string => {
  try {
    const content = localStorage.getItem(key);
    return content || '';
  } catch (error) {
    console.error(`Error retrieving content for key ${key}:`, error);
    return '';
  }
};

export const storeContent = (key: string, content: string): void => {
  try {
    localStorage.setItem(key, content);
  } catch (error) {
    console.error(`Error storing content for key ${key}:`, error);
  }
};

// Helper for consistent error handling
export const handleServiceError = <T>(error: unknown, errorMessage: string): any => {
  console.error(errorMessage, error);
  return { success: false, error: errorMessage };
};
