
import { Task } from '@/types/task';
import { ApiResponse } from '../../types';
import { getTasks, storeTasks } from '../storage/supabase/tasks';
import { handleServiceError } from '../storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { generateId } from '@/utils/taskUtils';

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Task>> => {
  try {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // First try to store in Supabase if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      console.log('User authenticated, saving task to Supabase:', newTask);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([newTask])
          .select()
          .single();
        
        if (error) {
          console.error('Supabase insert error:', error);
          console.log('Falling back to user_entries for task storage');
          
          // Try storing in user_entries if tasks table insert fails
          const tasks = await getTasks();
          const updatedTasks = [...tasks, newTask];
          await storeTasks(updatedTasks);
        } else if (data) {
          console.log('Task saved to Supabase:', data.id);
          
          // Also update localStorage as backup
          const tasks = await getTasks();
          const updatedTasks = [...tasks, data];
          await storeTasks(updatedTasks);
          
          return { success: true, data };
        }
      } catch (supabaseError) {
        console.error('Supabase task insert error:', supabaseError);
      }
    }
    
    // Fall back to localStorage
    const tasks = await getTasks();
    const updatedTasks = [...tasks, newTask];
    await storeTasks(updatedTasks);
    console.log('Task saved to localStorage:', newTask.id);
    
    return { success: true, data: newTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to create task');
  }
};
