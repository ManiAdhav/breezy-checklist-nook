
import { Task } from '@/types/task';
import { ApiResponse } from '../../../types';
import { handleServiceError } from '../../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { getStoredTasks } from '../../storage/supabase';

export const updateTask = async (id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> => {
  try {
    const tasks = await getStoredTasks.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }
    
    const updatedTask = { 
      ...tasks[taskIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    // First try to update in Supabase if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update(updatedTask)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Supabase update error:', error);
          // Fall back to user_entries if tasks table update fails
          tasks[taskIndex] = updatedTask;
          await getStoredTasks.storeTasks(tasks);
        } else if (data) {
          console.log('Task updated in Supabase:', data.id);
          
          // Also update localStorage as backup
          tasks[taskIndex] = data;
          await getStoredTasks.storeTasks(tasks);
          
          return { success: true, data };
        }
      } catch (supabaseError) {
        console.error('Supabase task update error:', supabaseError);
      }
    }
    
    // Fall back to localStorage
    tasks[taskIndex] = updatedTask;
    await getStoredTasks.storeTasks(tasks);
    console.log('Task updated in localStorage:', updatedTask.id);
    
    return { success: true, data: updatedTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to update task');
  }
};
