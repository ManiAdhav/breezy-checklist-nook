
import { List } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from '../types';
import { getStoredCustomLists, getStoredTasks, storeCustomLists, storeTasks } from './storageUtils';
import { handleServiceError } from './errorUtils';
import { supabase } from '@/integrations/supabase/client';

// List API methods
export const getLists = async (): Promise<ApiResponse<List[]>> => {
  try {
    console.log('Getting custom lists from storage and Supabase...');
    // First try to get lists from Supabase if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      // Try to query custom lists from user_entries table
      const { data, error } = await supabase
        .from('user_entries')
        .select('*')
        .eq('entry_type', 'customLists');
      
      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
      } else if (data && data.length > 0) {
        // Convert the data format to our list format
        const lists: List[] = [];
        
        for (const entry of data) {
          try {
            const listData = JSON.parse(entry.content);
            if (listData) {
              lists.push(listData);
            }
          } catch (e) {
            console.error('Error parsing list data:', e);
          }
        }
        
        console.log('Retrieved lists from Supabase:', lists.length);
        
        if (lists.length > 0) {
          // Store to localStorage as backup
          await storeCustomLists(lists);
          
          return { success: true, data: lists };
        }
      }
    }
    
    // Fall back to localStorage
    const lists = await getStoredCustomLists();
    console.log('Using localStorage lists:', lists);
    return { success: true, data: lists };
  } catch (error) {
    return handleServiceError<List[]>(error, 'Failed to fetch lists');
  }
};

export const createList = async (list: Omit<List, 'id'>): Promise<ApiResponse<List>> => {
  try {
    const newList: List = {
      ...list,
      id: generateId()
    };
    
    // First try to store in Supabase if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      console.log('User authenticated, saving list to Supabase:', newList);
      // Store list as JSON in user_entries table
      const { data, error } = await supabase
        .from('user_entries')
        .insert([{
          entry_type: 'customLists',
          content: JSON.stringify(newList)
        }]);
      
      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
      } else {
        console.log('List saved to Supabase');
        
        // Update localStorage with all lists
        const lists = await getStoredCustomLists();
        await storeCustomLists([...lists, newList]);
        
        return { success: true, data: newList };
      }
    }
    
    // Fall back to localStorage
    const lists = await getStoredCustomLists();
    const updatedLists = [...lists, newList];
    await storeCustomLists(updatedLists);
    console.log('List saved to localStorage:', newList);
    
    return { success: true, data: newList };
  } catch (error) {
    return handleServiceError<List>(error, 'Failed to create list');
  }
};

export const updateList = async (id: string, updates: Partial<List>): Promise<ApiResponse<List>> => {
  try {
    const lists = await getStoredCustomLists();
    const listIndex = lists.findIndex(list => list.id === id);
    
    if (listIndex === -1) {
      return { success: false, error: 'List not found' };
    }
    
    const updatedList = { 
      ...lists[listIndex], 
      ...updates
    };
    
    // First try to update in Supabase if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      // Get all lists from Supabase
      const { data, error } = await supabase
        .from('user_entries')
        .select('*')
        .eq('entry_type', 'customLists');
      
      if (error) {
        console.error('Supabase fetch error:', error);
        // Fall back to localStorage
      } else {
        // Find the entry with the list we want to update
        const entryToUpdate = data.find(entry => {
          try {
            const listData = JSON.parse(entry.content);
            return listData.id === id;
          } catch (e) {
            return false;
          }
        });
        
        if (entryToUpdate) {
          // Update the entry
          const { error: updateError } = await supabase
            .from('user_entries')
            .update({
              content: JSON.stringify(updatedList)
            })
            .eq('id', entryToUpdate.id);
          
          if (updateError) {
            console.error('Supabase update error:', updateError);
            // Fall back to localStorage
          } else {
            console.log('List updated in Supabase:', id);
          }
        } else {
          // Insert as new entry if not found
          const { error: insertError } = await supabase
            .from('user_entries')
            .insert([{
              entry_type: 'customLists',
              content: JSON.stringify(updatedList)
            }]);
          
          if (insertError) {
            console.error('Supabase insert error:', insertError);
            // Fall back to localStorage
          } else {
            console.log('List added to Supabase (not found for update):', id);
          }
        }
      }
    }
    
    // Always update localStorage
    lists[listIndex] = updatedList;
    await storeCustomLists(lists);
    console.log('List updated in localStorage:', updatedList);
    
    return { success: true, data: updatedList };
  } catch (error) {
    return handleServiceError<List>(error, 'Failed to update list');
  }
};

export const deleteList = async (id: string): Promise<ApiResponse<void>> => {
  try {
    // First try to delete from Supabase if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      // Get all lists from Supabase
      const { data, error } = await supabase
        .from('user_entries')
        .select('*')
        .eq('entry_type', 'customLists');
      
      if (error) {
        console.error('Supabase fetch error:', error);
        // Fall back to localStorage
      } else {
        // Find entries with the list we want to delete
        const entriesToDelete = data.filter(entry => {
          try {
            const listData = JSON.parse(entry.content);
            return listData.id === id;
          } catch (e) {
            return false;
          }
        });
        
        for (const entry of entriesToDelete) {
          const { error: deleteError } = await supabase
            .from('user_entries')
            .delete()
            .eq('id', entry.id);
          
          if (deleteError) {
            console.error('Supabase delete error:', deleteError);
          } else {
            console.log('List entry deleted from Supabase:', entry.id);
          }
        }
        
        // Now update all lists in Supabase without the deleted one
        const lists = await getStoredCustomLists();
        const updatedLists = lists.filter(list => list.id !== id);
        
        // Re-save the filtered list
        await storeCustomLists(updatedLists);
      }
    }
    
    // Always update localStorage regardless of Supabase result
    const lists = await getStoredCustomLists();
    const updatedLists = lists.filter(list => list.id !== id);
    
    if (updatedLists.length === lists.length) {
      return { success: false, error: 'List not found' };
    }
    
    await storeCustomLists(updatedLists);
    
    // Update tasks to move them to inbox
    const tasks = await getStoredTasks();
    const updatedTasks = tasks.map(task => 
      task.listId === id 
        ? { ...task, listId: 'inbox' } 
        : task
    );
    
    await storeTasks(updatedTasks);
    console.log('List deleted from localStorage and tasks moved to inbox:', id);
    
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete list');
  }
};
