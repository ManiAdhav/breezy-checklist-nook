
import { useState, useEffect, useMemo } from 'react';
import { Task } from '@/types/task';
import { filterTasks, sortTasks } from '@/utils/taskUtils';

export const useTaskPreferences = (tasks: Task[]) => {
  const [selectedListId, setSelectedListId] = useState<string>('inbox');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'createdAt'>('createdAt');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use useMemo to compute filtered tasks to avoid unnecessary re-filtering
  const filteredTasks = useMemo(() => {
    // Filter tasks based on selected list, search query, and showCompleted preference
    const filtered = filterTasks(tasks, selectedListId, searchQuery, showCompleted);
    
    // Sort the filtered tasks
    return sortTasks(filtered, sortBy);
  }, [tasks, selectedListId, sortBy, showCompleted, searchQuery]);

  // Log changes to tasks or filtered tasks for debugging
  useEffect(() => {
    console.log(`Tasks count: ${tasks.length}, filtered count: ${filteredTasks.length}`);
    console.log('Current filters:', {
      selectedListId,
      sortBy, 
      showCompleted,
      searchQuery: searchQuery || '(none)',
    });
    
    // Enhanced debugging for task content
    if (tasks.length > 0) {
      console.log('First 3 tasks sample:', tasks.slice(0, 3));
      
      // Log lists represented in tasks
      const listIds = [...new Set(tasks.map(task => task.listId))];
      console.log('Lists present in tasks:', listIds);
    }
  }, [tasks.length, filteredTasks.length, selectedListId, sortBy, showCompleted, searchQuery, tasks]);

  return {
    selectedListId,
    setSelectedListId,
    sortBy,
    setSortBy,
    showCompleted,
    setShowCompleted,
    searchQuery,
    setSearchQuery,
    filteredTasks,
  };
};
