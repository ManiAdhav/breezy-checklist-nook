import { List } from '@/types/task';
import { generateId } from '@/utils/taskUtils';
import { ApiResponse } from '../types';
import { getStoredCustomLists, getStoredTasks, storeCustomLists, storeTasks } from './storageUtils';
import { handleServiceError } from './errorUtils';

// List API methods
export const getLists = async (): Promise<ApiResponse<List[]>> => {
  try {
    const lists = getStoredCustomLists();
    console.log('getLists:', lists);
    return { success: true, data: lists };
  } catch (error) {
    return handleServiceError<List[]>(error, 'Failed to fetch lists');
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
    return handleServiceError<List>(error, 'Failed to create list');
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
    return handleServiceError<List>(error, 'Failed to update list');
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
    return handleServiceError<void>(error, 'Failed to delete list');
  }
};
