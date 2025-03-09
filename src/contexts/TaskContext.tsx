
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, List, Priority } from '@/types/task';
import { sortTasks, filterTasks } from '@/utils/taskUtils';
import { toast } from '@/hooks/use-toast';
import * as TaskService from '@/api/taskService';

// Default lists
const defaultLists: List[] = [
  { id: 'inbox', name: 'Inbox', icon: 'inbox' },
  { id: 'today', name: 'Today', icon: 'calendar' },
  { id: 'planned', name: 'Planned', icon: 'calendar-clock' },
];

interface TaskContextType {
  tasks: Task[];
  lists: List[];
  customLists: List[];
  selectedListId: string;
  sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt';
  showCompleted: boolean;
  searchQuery: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addList: (list: Omit<List, 'id'>) => void;
  updateList: (id: string, updates: Partial<List>) => void;
  deleteList: (id: string) => void;
  setSelectedListId: (id: string) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt') => void;
  setShowCompleted: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  filteredTasks: Task[];
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists] = useState<List[]>(defaultLists);
  const [customLists, setCustomLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('inbox');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'createdAt'>('createdAt');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tasksResponse, listsResponse] = await Promise.all([
          TaskService.getTasks(),
          TaskService.getLists()
        ]);
        
        if (tasksResponse.success && tasksResponse.data) {
          setTasks(tasksResponse.data);
        }
        
        if (listsResponse.success && listsResponse.data) {
          setCustomLists(listsResponse.data);
        }
        
        // Load preferences from localStorage
        const savedSelectedListId = localStorage.getItem('selectedListId');
        const savedSortBy = localStorage.getItem('sortBy');
        const savedShowCompleted = localStorage.getItem('showCompleted');

        if (savedSelectedListId) setSelectedListId(savedSelectedListId);
        if (savedSortBy) setSortBy(savedSortBy as any);
        if (savedShowCompleted) setShowCompleted(JSON.parse(savedShowCompleted));
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks and lists",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedListId', selectedListId);
    localStorage.setItem('sortBy', sortBy);
    localStorage.setItem('showCompleted', JSON.stringify(showCompleted));
  }, [selectedListId, sortBy, showCompleted]);

  // Filter and sort tasks based on current state
  const filteredTasks = sortTasks(filterTasks(tasks, selectedListId === 'all' ? undefined : selectedListId, searchQuery, showCompleted), sortBy);

  // Task operations
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.createTask(task);
      
      if (response.success && response.data) {
        setTasks(prevTasks => [...prevTasks, response.data!]);
        toast({
          title: "Task added",
          description: "Your task was added successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.updateTask(id, updates);
      
      if (response.success && response.data) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? response.data! : task
          )
        );
        toast({
          title: "Task updated",
          description: "Your task was updated successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await TaskService.deleteTask(id);
      
      if (response.success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        toast({
          title: "Task deleted",
          description: "Your task was deleted successfully.",
          variant: "destructive",
        });
      } else {
        throw new Error(response.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const response = await TaskService.toggleTaskCompletion(id);
      
      if (response.success && response.data) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? response.data! : task
          )
        );
      } else {
        throw new Error(response.error || 'Failed to toggle task completion');
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  // List operations
  const addList = async (list: Omit<List, 'id'>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.createList(list);
      
      if (response.success && response.data) {
        setCustomLists(prevLists => [...prevLists, response.data!]);
        setSelectedListId(response.data!.id);
        toast({
          title: "List added",
          description: `"${list.name}" was added successfully.`,
        });
      } else {
        throw new Error(response.error || 'Failed to add list');
      }
    } catch (error) {
      console.error('Error adding list:', error);
      toast({
        title: "Error",
        description: "Failed to add list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateList = async (id: string, updates: Partial<List>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.updateList(id, updates);
      
      if (response.success && response.data) {
        setCustomLists(prevLists => 
          prevLists.map(list => 
            list.id === id ? response.data! : list
          )
        );
        toast({
          title: "List updated",
          description: "Your list was updated successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to update list');
      }
    } catch (error) {
      console.error('Error updating list:', error);
      toast({
        title: "Error",
        description: "Failed to update list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteList = async (id: string) => {
    // Find the list name before deletion for the toast
    const listToDelete = customLists.find(list => list.id === id);
    
    setIsLoading(true);
    try {
      const response = await TaskService.deleteList(id);
      
      if (response.success) {
        setCustomLists(prevLists => prevLists.filter(list => list.id !== id));
        
        // If the deleted list was selected, switch to inbox
        if (selectedListId === id) {
          setSelectedListId('inbox');
        }
        
        // Update task references in the state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.listId === id 
              ? { ...task, listId: 'inbox' } 
              : task
          )
        );
        
        toast({
          title: "List deleted",
          description: `"${listToDelete?.name}" was deleted and its tasks moved to Inbox.`,
          variant: "destructive",
        });
      } else {
        throw new Error(response.error || 'Failed to delete list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: "Error",
        description: "Failed to delete list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
