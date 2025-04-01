
// Local storage keys
export const TASKS_STORAGE_KEY = 'tasks';
export const CUSTOM_LISTS_STORAGE_KEY = 'customLists';

// Generic storage helper functions
export const getStoredData = <T>(key: string): T[] => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

export const storeData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Specific storage helpers for tasks and lists
export const getStoredTasks = (): any[] => {
  const tasks = getStoredData(TASKS_STORAGE_KEY);
  return tasks;
};

export const getStoredCustomLists = (): any[] => {
  const lists = getStoredData(CUSTOM_LISTS_STORAGE_KEY);
  console.log('Retrieved stored lists:', lists);
  return lists;
};

export const storeTasks = (tasks: any[]): void => {
  storeData(TASKS_STORAGE_KEY, tasks);
};

export const storeCustomLists = (lists: any[]): void => {
  console.log('Storing lists:', lists);
  storeData(CUSTOM_LISTS_STORAGE_KEY, lists);
};
