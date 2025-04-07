
import { Task } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from '../types';
import { getStoredTasks, storeTasks } from './storageUtils';
import { handleServiceError } from './errorUtils';
import { supabase } from '@/integrations/supabase/client';

// Task API methods
export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  try {
    // First try to get tasks from Supabase if the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (session?.session) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
        const tasks = getStoredTasks();
        console.log('Using localStorage tasks instead:', tasks.length);
        return { success: true, data: tasks };
      }
      
      if (data && data.length > 0) {
        console.log('Retrieved tasks from Supabase:', data.length);
        
        // Store the Supabase tasks to localStorage as backup
        storeTasks(data);
        
        return { success: true, data };
      }
    }
    
    // Fall back to localStorage if no Supabase tasks or not authenticated
    const tasks = getStoredTasks();
    console.log('Using localStorage tasks:', tasks.length);
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
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        // Fall back to localStorage
      } else if (data) {
        console.log('Task saved to Supabase:', data.id);
        
        // Also update localStorage as backup
        const tasks = getStoredTasks();
        storeTasks([...tasks, data]);
        
        return { success: true, data };
      }
    }
    
    // Fall back to localStorage
    const tasks = getStoredTasks();
    const updatedTasks = [...tasks, newTask];
    storeTasks(updatedTasks);
    console.log('Task saved to localStorage:', newTask.id);
    
    return { success: true, data: newTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to create task');
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> => {
  try {
    const tasks = getStoredTasks();
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
      const { data, error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        // Fall back to localStorage
      } else if (data) {
        console.log('Task updated in Supabase:', data.id);
        
        // Also update localStorage as backup
        tasks[taskIndex] = data;
        storeTasks(tasks);
        
        return { success: true, data };
      }
    }
    
    // Fall back to localStorage
    tasks[taskIndex] = updatedTask;
    storeTasks(tasks);
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
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        // Fall back to localStorage
      } else {
        console.log('Task deleted from Supabase:', id);
      }
    }
    
    // Always update localStorage regardless of Supabase result
    const tasks = getStoredTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    if (updatedTasks.length === tasks.length) {
      return { success: false, error: 'Task not found' };
    }
    
    storeTasks(updatedTasks);
    console.log('Task deleted from localStorage:', id);
    
    return { success: true };
  } catch (error) {
    return handleServiceError<void>(error, 'Failed to delete task');
  }
};

export const toggleTaskCompletion = async (id: string): Promise<ApiResponse<Task>> => {
  try {
    const tasks = getStoredTasks();
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
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed: updatedTask.completed, updatedAt: updatedTask.updatedAt })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase toggle error:', error);
        // Fall back to localStorage
      } else if (data) {
        console.log('Task completion toggled in Supabase:', data.id);
        
        // Also update localStorage as backup
        tasks[taskIndex] = data;
        storeTasks(tasks);
        
        return { success: true, data };
      }
    }
    
    // Fall back to localStorage
    tasks[taskIndex] = updatedTask;
    storeTasks(tasks);
    console.log('Task completion toggled in localStorage:', updatedTask.id);
    
    return { success: true, data: updatedTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to toggle task completion');
  }
};
