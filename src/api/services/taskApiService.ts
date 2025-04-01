
import { Task } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from '../types';
import { getStoredTasks, storeTasks } from './storageUtils';

// Task API methods
export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  try {
    const tasks = getStoredTasks();
    return { success: true, data: tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
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
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
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
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
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
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
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
    console.error('Error toggling task completion:', error);
    return { success: false, error: 'Failed to toggle task completion' };
  }
};
