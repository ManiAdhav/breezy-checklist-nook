
import { getStoredData, storeData } from './core';

/**
 * Gets custom lists from storage
 * @returns Promise resolving to custom lists
 */
export const getStoredCustomLists = async (): Promise<any[]> => {
  const lists = await getStoredData('customLists');
  console.log('Retrieved stored lists:', lists);
  return lists;
};

/**
 * Stores custom lists in storage
 * @param lists Lists to store
 * @returns Promise resolving when storage operation completes
 */
export const storeCustomLists = async (lists: any[]): Promise<void> => {
  console.log('Storing lists:', lists);
  await storeData('customLists', lists);
};
