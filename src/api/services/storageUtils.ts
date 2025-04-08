
// Local storage keys
export const TASKS_STORAGE_KEY = 'tasks';
export const CUSTOM_LISTS_STORAGE_KEY = 'customLists';
export const THREE_YEAR_GOALS_STORAGE_KEY = 'threeYearGoals';
export const NINETY_DAY_TARGETS_STORAGE_KEY = 'ninetyDayTargets';
export const PLANS_STORAGE_KEY = 'plans';
export const NOTEPAD_STORAGE_KEY = 'notepad_content';

import { supabase } from '@/integrations/supabase/client';

// Generic storage helper functions
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
        localStorage.setItem(key, JSON.stringify(parsedData));
        
        return parsedData;
      }
    }
    
    // Fall back to localStorage
    const storedData = localStorage.getItem(key);
    console.log(`Retrieving data for key ${key} from localStorage, found:`, storedData ? 'data' : 'nothing');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return [];
  }
};

export const storeData = async <T>(key: string, data: T[]): Promise<void> => {
  try {
    console.log(`Storing data for key ${key}:`, data);
    
    // First, always update localStorage for immediate access
    localStorage.setItem(key, JSON.stringify(data));
    
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

// Specific storage helpers for tasks and lists
export const getStoredTasks = async (): Promise<any[]> => {
  const tasks = await getStoredData(TASKS_STORAGE_KEY);
  console.log('Retrieved stored tasks:', tasks);
  return tasks;
};

export const getStoredCustomLists = async (): Promise<any[]> => {
  const lists = await getStoredData(CUSTOM_LISTS_STORAGE_KEY);
  console.log('Retrieved stored lists:', lists);
  return lists;
};

export const storeTasks = async (tasks: any[]): Promise<void> => {
  console.log('Storing tasks:', tasks);
  await storeData(TASKS_STORAGE_KEY, tasks);
};

export const storeCustomLists = async (lists: any[]): Promise<void> => {
  console.log('Storing lists:', lists);
  await storeData(CUSTOM_LISTS_STORAGE_KEY, lists);
};

// Helper for string content storage (for notepad)
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
    const content = localStorage.getItem(key);
    return content || '';
  } catch (error) {
    console.error(`Error retrieving content for key ${key}:`, error);
    return '';
  }
};

export const storeContent = async (key: string, content: string): Promise<void> => {
  try {
    // Always update localStorage
    localStorage.setItem(key, content);
    
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

// Helper for consistent error handling
export const handleServiceError = <T>(error: unknown, errorMessage: string): any => {
  console.error(errorMessage, error);
  return { success: false, error: errorMessage };
};
