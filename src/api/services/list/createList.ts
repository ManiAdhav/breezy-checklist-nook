
import { List } from '@/types/task';
import { ApiResponse } from '../../types';
import { getStoredCustomLists, storeCustomLists } from '../storage/supabaseStorage';
import { handleServiceError } from '../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { generateId } from '@/utils/taskUtils';

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
