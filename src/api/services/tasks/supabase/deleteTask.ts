
import { ApiResponse } from '../../../types';
import { handleServiceError } from '../../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { getStoredTasks } from '../../storage/supabase';

export const deleteTask = async (id: string): Promise<ApiResponse<void>> => {
  try {
    // First try to delete from Supabase if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Supabase delete error:', error);
          // Will still update localStorage below
        } else {
          console.log('Task deleted from Supabase:', id);
        }
      } catch (supabaseError) {
        console.error('Supabase task delete error:', supabaseError);
      }
    }
    
    // Always update localStorage regardless of Supabase result
    const tasks = await getStoredTasks.getTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    if (updatedTasks.length === tasks.length) {
      return { success: false, error: 'Task not found' };
    }
    
    await getStoredTasks.storeTasks(updatedTasks);
    console.log('Task deleted from localStorage:', id);
    
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete task');
  }
};
