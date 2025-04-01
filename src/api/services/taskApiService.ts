import { Task } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from '../types';
import { getStoredTasks, storeTasks } from './storageUtils';
import { handleServiceError } from './errorUtils';

// Task API methods
export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  try {
    const tasks = getStoredTasks();
    return { success: true, data: tasks };
  } catch (error) {
    return handleServiceError<Task[]>(error, 'Failed to fetch tasks');
  }
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Task>> => {
  try {
    const tasks = getStoredTasks();
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedTasks = [...tasks, newTask];
    storeTasks(updatedTasks);
    
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
    
    tasks[taskIndex] = updatedTask;
    storeTasks(tasks);
    
    return { success: true, data: updatedTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to update task');
  }
};

export const deleteTask = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const tasks = getStoredTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    
    if (updatedTasks.length === tasks.length) {
      return { success: false, error: 'Task not found' };
    }
    
    storeTasks(updatedTasks);
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
    
    tasks[taskIndex] = updatedTask;
    storeTasks(tasks);
    
    return { success: true, data: updatedTask };
  } catch (error) {
    return handleServiceError<Task>(error, 'Failed to toggle task completion');
  }
};
