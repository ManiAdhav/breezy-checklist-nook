
import { ApiResponse } from '../../types';
import { getStoredCustomLists, getStoredTasks, storeCustomLists, storeTasks } from '../storage/supabase';
import { handleServiceError } from '../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';

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
