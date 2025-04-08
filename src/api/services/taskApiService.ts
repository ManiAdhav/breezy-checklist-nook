
import { Task } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from '../types';
import { getStoredTasks, storeTasks } from './storage/supabaseStorage';
import { handleServiceError } from './storage/errorHandling';
import { supabase } from '@/integrations/supabase/client';

// Task API methods
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
        await storeTasks(data);
        
        return { success: true, data };
      } else {
        console.log('No tasks found in Supabase, checking user_entries...');
        
        // If no tasks in tasks table, check if they're in user_entries
        const tasks = await getStoredTasks();
        
        if (tasks && tasks.length > 0) {
          console.log('Retrieved tasks from user_entries:', tasks.length);
          return { success: true, data: tasks };
        }
      }
    }
    
    // Fall back to localStorage if no Supabase tasks or not authenticated
    const tasks = await getStoredTasks();
    console.log('Using local storage tasks:', tasks.length);
    return { success: true, data: tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return handleServiceError<Task[]>(error, 'Failed to fetch tasks');
  }
};

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
          const tasks = await getStoredTasks();
          const updatedTasks = [...tasks, newTask];
          await storeTasks(updatedTasks);
        } else if (data) {
          console.log('Task saved to Supabase:', data.id);
          
          // Also update localStorage as backup
          const tasks = await getStoredTasks();
          const updatedTasks = [...tasks, data];
          await storeTasks(updatedTasks);
          
          return { success: true, data };
        }
      } catch (supabaseError) {
        console.error('Supabase task insert error:', supabaseError);
      }
    }
    
    // Fall back to localStorage
    const tasks = await getStoredTasks();
    const updatedTasks = [...tasks, newTask];
    await storeTasks(updatedTasks);
    console.log('Task saved to localStorage:', newTask.id);
    
    return { success: true, data: newTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to create task');
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> => {
  try {
    const tasks = await getStoredTasks();
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
          await storeTasks(tasks);
        } else if (data) {
          console.log('Task updated in Supabase:', data.id);
          
          // Also update localStorage as backup
          tasks[taskIndex] = data;
          await storeTasks(tasks);
          
          return { success: true, data };
        }
      } catch (supabaseError) {
        console.error('Supabase task update error:', supabaseError);
      }
    }
    
    // Fall back to localStorage
    tasks[taskIndex] = updatedTask;
    await storeTasks(tasks);
    console.log('Task updated in localStorage:', updatedTask.id);
    
    return { success: true, data: updatedTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to update task');
  }
};

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
    const tasks = await getStoredTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    if (updatedTasks.length === tasks.length) {
      return { success: false, error: 'Task not found' };
    }
    
    await storeTasks(updatedTasks);
    console.log('Task deleted from localStorage:', id);
    
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete task');
  }
};

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
