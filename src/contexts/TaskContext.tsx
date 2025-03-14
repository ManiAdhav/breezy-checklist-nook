
import React, { createContext, useContext } from 'react';
import { TaskContextType, defaultLists } from './task/types';
import { useTaskOperations } from './task/useTaskOperations';
import { useListOperations } from './task/useListOperations';
import { useTaskPreferences } from './task/useTaskPreferences';
import { useTaskData } from './task/useTaskData';

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
  const { addList, updateList, deleteList } = useListOperations(
    setCustomLists, 
    setTasks, 
    setSelectedListId,
    setIsLoading,
    customLists, // Pass customLists as a parameter
    selectedListId // Pass selectedListId as a parameter
  );

  // Data fetching
  useTaskData(setTasks, setCustomLists, setIsLoading);

  // Use the built-in lists
  const lists = defaultLists;

  return (
    <TaskContext.Provider value={{
      tasks,
      lists,
      customLists,
      selectedListId,
      sortBy,
      showCompleted,
      searchQuery,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      addList,
      updateList,
      deleteList,
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
