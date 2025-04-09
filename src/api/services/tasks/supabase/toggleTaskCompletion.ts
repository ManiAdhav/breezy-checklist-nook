
import { Task } from '@/types/task';
import { ApiResponse } from '../../../types';
import { handleServiceError } from '../../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { getTasks as getStoredTasks, storeTasks } from '../../storage/supabase/tasks';

export const toggleTaskCompletion = async (id: string): Promise<ApiResponse<Task>> => {
  try {
    const tasks = await getStoredTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }
    
    const updatedTask = { 
      ...tasks[taskIndex],
      completed: !tasks[taskIndex].completed,
      updatedAt: new Date() 
    };
    
    // First try to update in Supabase if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({ completed: updatedTask.completed, updatedAt: updatedTask.updatedAt })
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Supabase toggle error:', error);
          // Will still update localStorage below
        } else if (data) {
          console.log('Task completion toggled in Supabase:', data.id);
          
          // Also update localStorage as backup
          tasks[taskIndex] = data;
          await storeTasks(tasks);
          
          return { success: true, data };
        }
      } catch (supabaseError) {
        console.error('Supabase task toggle error:', supabaseError);
      }
    }
    
    // Fall back to localStorage
    tasks[taskIndex] = updatedTask;
    await storeTasks(tasks);
    console.log('Task completion toggled in localStorage:', updatedTask.id);
    
    return { success: true, data: updatedTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to toggle task completion');
  }
};
