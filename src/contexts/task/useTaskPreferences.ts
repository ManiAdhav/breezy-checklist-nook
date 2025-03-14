
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { filterTasks, sortTasks } from '@/utils/taskUtils';

export const useTaskPreferences = (tasks: Task[]) => {
  const [selectedListId, setSelectedListId] = useState<string>('inbox');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'createdAt'>('createdAt');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load preferences from localStorage when component mounts
  useEffect(() => {
    const savedSelectedListId = localStorage.getItem('selectedListId');
    const savedSortBy = localStorage.getItem('sortBy');
    const savedShowCompleted = localStorage.getItem('showCompleted');

    if (savedSelectedListId) setSelectedListId(savedSelectedListId);
    if (savedSortBy) setSortBy(savedSortBy as any);
    if (savedShowCompleted) setShowCompleted(JSON.parse(savedShowCompleted));
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedListId', selectedListId);
    localStorage.setItem('sortBy', sortBy);
    localStorage.setItem('showCompleted', JSON.stringify(showCompleted));
  }, [selectedListId, sortBy, showCompleted]);

  // Filter and sort tasks based on current preferences
  const filteredTasks = sortTasks(
    filterTasks(
      tasks, 
      selectedListId === 'all' ? undefined : selectedListId, 
      searchQuery, 
      showCompleted
    ), 
    sortBy
  );

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
