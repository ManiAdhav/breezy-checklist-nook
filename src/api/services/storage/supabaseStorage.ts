import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveToLocalStorage, getLocalStorageContent, saveContentToLocalStorage } from './localStorage';

/**
 * Gets data from Supabase or falls back to localStorage
 * @param key Storage key
 * @returns Promise resolving to the data
 */
export const getStoredData = async <T>(key: string): Promise<T[]> => {
  try {
    // First try to get data from Supabase if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      console.log(`Trying to fetch data for ${key} from Supabase...`);
      
      const { data, error } = await supabase
        .from('user_entries')
        .select('*')
        .eq('entry_type', key);
      
      if (error) {
        console.error(`Supabase error retrieving ${key}:`, error);
        // Fall back to localStorage if Supabase fails
      } else if (data && data.length > 0) {
        console.log(`Retrieved ${data.length} items for ${key} from Supabase`);
        
        // Extract the content from each entry
        const parsedData = data.map(entry => {
          try {
            return JSON.parse(entry.content);
          } catch (e) {
            console.error(`Error parsing ${key} data:`, e);
            return null;
          }
        }).filter(Boolean) as T[];
        
        // Also update localStorage as a cache
        saveToLocalStorage(key, parsedData);
        
        return parsedData;
      }
    }
    
    // Fall back to localStorage
    return getLocalStorageData<T>(key);
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return [];
  }
};

/**
 * Stores data in Supabase and localStorage
 * @param key Storage key
 * @param data Data to store
 * @returns Promise resolving when storage operations complete
 */
export const storeData = async <T>(key: string, data: T[]): Promise<void> => {
  try {
    console.log(`Storing data for key ${key}:`, data);
    
    // First, always update localStorage for immediate access
    saveToLocalStorage(key, data);
    
    // Then try to store in Supabase if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      console.log(`Attempting to save ${key} data to Supabase...`);
      
      // First, delete existing entries for this type to avoid duplicates
      const { error: deleteError } = await supabase
        .from('user_entries')
        .delete()
        .eq('entry_type', key);
      
      if (deleteError) {
        console.error(`Error deleting existing ${key} entries:`, deleteError);
      }
      
      // Insert the new data
      if (data.length > 0) {
        const { error: insertError } = await supabase
          .from('user_entries')
          .insert(
            data.map(item => ({
              entry_type: key,
              content: JSON.stringify(item)
            }))
          );
        
        if (insertError) {
          console.error(`Error storing ${key} data in Supabase:`, insertError);
        } else {
          console.log(`Successfully saved ${data.length} ${key} items to Supabase`);
        }
      }
    } else {
      console.log(`User not logged in, ${key} data saved only to localStorage`);
    }
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
  }
};

/**
 * Gets content from Supabase or falls back to localStorage
 * @param key Storage key
 * @returns Promise resolving to the content
 */
export const getStoredContent = async (key: string): Promise<string> => {
  try {
    // First try to get from Supabase if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      const { data, error } = await supabase
        .from('user_entries')
        .select('*')
        .eq('entry_type', key)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error(`Supabase error retrieving ${key} content:`, error);
        }
        // Fall back to localStorage
      } else if (data) {
        return data.content;
      }
    }
    
    // Fall back to localStorage
    return getLocalStorageContent(key);
  } catch (error) {
    console.error(`Error retrieving content for key ${key}:`, error);
    return '';
  }
};

/**
 * Stores content in Supabase and localStorage
 * @param key Storage key
 * @param content Content to store
 * @returns Promise resolving when storage operations complete
 */
export const storeContent = async (key: string, content: string): Promise<void> => {
  try {
    // Always update localStorage
    saveContentToLocalStorage(key, content);
    
    // Then try to store in Supabase if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      // First check if the entry already exists
      const { data, error: fetchError } = await supabase
        .from('user_entries')
        .select('*')
        .eq('entry_type', key);
      
      if (fetchError) {
        console.error(`Error checking for existing ${key} content:`, fetchError);
      } else if (data && data.length > 0) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('user_entries')
          .update({ content })
          .eq('entry_type', key);
        
        if (updateError) {
          console.error(`Error updating ${key} content:`, updateError);
        }
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('user_entries')
          .insert([{
            entry_type: key,
            content
          }]);
        
        if (insertError) {
          console.error(`Error storing ${key} content:`, insertError);
        }
      }
    }
  } catch (error) {
    console.error(`Error storing content for key ${key}:`, error);
  }
};

// Helper functions for specific data types

/**
 * Gets tasks from storage
 * @returns Promise resolving to tasks
 */
export const getStoredTasks = async (): Promise<any[]> => {
  const tasks = await getStoredData('tasks');
  console.log('Retrieved stored tasks:', tasks);
  return tasks;
};

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
 * Stores tasks in storage
 * @param tasks Tasks to store
 * @returns Promise resolving when storage operation completes
 */
export const storeTasks = async (tasks: any[]): Promise<void> => {
  console.log('Storing tasks:', tasks);
  await storeData('tasks', tasks);
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
