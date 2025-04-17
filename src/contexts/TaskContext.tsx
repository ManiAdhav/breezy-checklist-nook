import React, { createContext, useContext, useEffect } from 'react';
import { TaskContextType, defaultLists } from './task/types';
import { useTaskOperations } from './task/useTaskOperations';
import { useListOperations } from './task/useListOperations';
import { useTaskPreferences } from './task/useTaskPreferences';
import { useTaskData } from './task/useTaskData';
import { useTagOperations } from './task/useTagOperations';
import { List, Tag } from '@/types/task';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Task operations (create, update, delete)
  const { 
    tasks, 
    setTasks, 
    customLists, 
    setCustomLists, 
    isLoading, 
    setIsLoading, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion 
  } = useTaskOperations();

  // Task preferences (sorting, filtering)
  const {
    selectedListId,
    setSelectedListId,
    sortBy,
    setSortBy,
    showCompleted,
    setShowCompleted,
    searchQuery,
    setSearchQuery,
    filteredTasks,
  } = useTaskPreferences(tasks);

  // List operations (create, update, delete)
  const { 
    addList, 
    updateList, 
    deleteList 
  } = useListOperations(
    setCustomLists, 
    setTasks, 
    setSelectedListId,
    setIsLoading,
    customLists, 
    selectedListId 
  );

  const {
    tags,
    setTags,
    loadTags,
    addTag,
    updateTag,
    deleteTag
  } = useTagOperations();

  // Data fetching
  useTaskData(setTasks, setCustomLists, setIsLoading);

  // Load tags when the component mounts
  useEffect(() => {
    loadTags();
  }, []);

  // Use the built-in lists
  const lists = defaultLists;

  const wrappedAddList = (list: Omit<List, 'id'>) => {
    return addList(list.name, list.color, list.icon);
  };

  const wrappedAddTag = (tag: Omit<Tag, 'id'>) => {
    const newTag = addTag(tag.name, tag.color);
    return newTag ? newTag : {} as Tag;
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      lists,
      customLists,
      tags,
      selectedListId,
      sortBy,
      showCompleted,
      searchQuery,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      addList: wrappedAddList,
      updateList,
      deleteList,
      addTag: wrappedAddTag,
      updateTag,
      deleteTag,
      setSelectedListId,
      setSortBy,
      setShowCompleted,
      setSearchQuery,
      filteredTasks,
      isLoading
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
