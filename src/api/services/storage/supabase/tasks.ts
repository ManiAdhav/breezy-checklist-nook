
import { getStoredData, storeData } from './core';

/**
 * Gets tasks from storage
 * @returns Promise resolving to tasks
 */
export const getTasks = async (): Promise<any[]> => {
  const tasks = await getStoredData('tasks');
  console.log('Retrieved stored tasks:', tasks);
  return tasks;
};

/**
 * Stores tasks in storage
 * @param tasks Tasks to store
 * @returns Promise resolving when storage operation completes
 */
export const storeTasks = async (tasks: any[]): Promise<void> => {
  console.log('Storing tasks:', tasks);
  await storeData('tasks', tasks);
};
