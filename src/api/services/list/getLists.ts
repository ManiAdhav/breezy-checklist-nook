
import { List } from '@/types/task';
import { ApiResponse } from '../../types';
import { getStoredCustomLists, storeCustomLists } from '../storage/supabaseStorage';
import { handleServiceError } from '../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';

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
