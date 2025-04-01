import { Task, List, Priority } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from './types';

// Local storage keys
const TASKS_STORAGE_KEY = 'tasks';
const CUSTOM_LISTS_STORAGE_KEY = 'customLists';

// Helper functions - updated for debugging
const getStoredTasks = (): Task[] => {
  const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
};

const getStoredCustomLists = (): List[] => {
  const storedLists = localStorage.getItem(CUSTOM_LISTS_STORAGE_KEY);
  const lists = storedLists ? JSON.parse(storedLists) : [];
  console.log('Retrieved stored lists:', lists);
  return lists;
};

const storeTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const storeCustomLists = (lists: List[]): void => {
  console.log('Storing lists:', lists);
  localStorage.setItem(CUSTOM_LISTS_STORAGE_KEY, JSON.stringify(lists));
};

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

// List API methods
export const getLists = async (): Promise<ApiResponse<List[]>> => {
  try {
    const lists = getStoredCustomLists();
    console.log('getLists:', lists);
    return { success: true, data: lists };
  } catch (error) {
    console.error('Error fetching lists:', error);
    return { success: false, error: 'Failed to fetch lists' };
  }
};

export const createList = async (list: Omit<List, 'id'>): Promise<ApiResponse<List>> => {
  try {
    const lists = getStoredCustomLists();
    const newList: List = {
      ...list,
      id: generateId()
    };
    
    const updatedLists = [...lists, newList];
    storeCustomLists(updatedLists);
    console.log('List created:', newList, 'All lists:', updatedLists);
    
    return { success: true, data: newList };
  } catch (error) {
    console.error('Error creating list:', error);
    return { success: false, error: 'Failed to create list' };
  }
};

export const updateList = async (id: string, updates: Partial<List>): Promise<ApiResponse<List>> => {
  try {
    const lists = getStoredCustomLists();
    const listIndex = lists.findIndex(list => list.id === id);
    
    if (listIndex === -1) {
      return { success: false, error: 'List not found' };
    }
    
    const updatedList = { 
      ...lists[listIndex], 
      ...updates
    };
    
    lists[listIndex] = updatedList;
    storeCustomLists(lists);
    
    return { success: true, data: updatedList };
  } catch (error) {
    console.error('Error updating list:', error);
    return { success: false, error: 'Failed to update list' };
  }
};

export const deleteList = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const lists = getStoredCustomLists();
    const updatedLists = lists.filter(list => list.id !== id);
    
    if (updatedLists.length === lists.length) {
      return { success: false, error: 'List not found' };
    }
    
    storeCustomLists(updatedLists);
    
    // Update tasks to move them to inbox
    const tasks = getStoredTasks();
    const updatedTasks = tasks.map(task => 
      task.listId === id 
        ? { ...task, listId: 'inbox' } 
        : task
    );
    
    storeTasks(updatedTasks);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting list:', error);
    return { success: false, error: 'Failed to delete list' };
  }
};
