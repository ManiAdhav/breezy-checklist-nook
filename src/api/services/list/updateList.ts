
import { List } from '@/types/task';
import { ApiResponse } from '../../types';
import { getStoredCustomLists, storeCustomLists } from '../storageUtils';
import { handleServiceError } from '../errorUtils';
import { supabase } from '@/integrations/supabase/client';

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
