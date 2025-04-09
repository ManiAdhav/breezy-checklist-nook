
import { Task } from '@/types/task';
import { ApiResponse } from '../../../types';
import { handleServiceError } from '../../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { getStoredTasks } from '../../storage/supabase';

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  try {
    console.log('Getting tasks from storage and Supabase...');
    // First try to get tasks from Supabase if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        // Fall back to local storage
      } else if (data && data.length > 0) {
        console.log('Retrieved tasks from Supabase:', data.length);
        
        // Store the Supabase tasks to localStorage as backup
        await getStoredTasks.storeTasks(data);
        
        return { success: true, data };
      } else {
        console.log('No tasks found in Supabase, checking user_entries...');
        
        // If no tasks in tasks table, check if they're in user_entries
        const tasks = await getStoredTasks.getTasks();
        
        if (tasks && tasks.length > 0) {
          console.log('Retrieved tasks from user_entries:', tasks.length);
          return { success: true, data: tasks };
        }
      }
    }
    
    // Fall back to localStorage if no Supabase tasks or not authenticated
    const tasks = await getStoredTasks.getTasks();
    console.log('Using local storage tasks:', tasks.length);
    return { success: true, data: tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return handleServiceError<Task[]>(error, 'Failed to fetch tasks');
  }
};
