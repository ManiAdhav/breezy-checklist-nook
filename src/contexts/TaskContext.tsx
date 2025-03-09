
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, List, Priority } from '@/types/task';
import { generateId, sortTasks, filterTasks } from '@/utils/taskUtils';
import { toast } from '@/hooks/use-toast';

// Default lists
const defaultLists: List[] = [
  { id: 'inbox', name: 'Inbox', icon: 'inbox' },
  { id: 'today', name: 'Today', icon: 'calendar' },
  { id: 'planned', name: 'Planned', icon: 'calendar-clock' },
];

// Sample tasks for demonstration
const sampleTasks: Task[] = [
  {
    id: generateId(),
    title: 'Welcome to Todo App',
    completed: false,
    priority: 'high',
    listId: 'inbox',
    notes: 'This is a sample task to help you get started.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Create your first task',
    completed: false,
    priority: 'medium',
    listId: 'today',
    dueDate: new Date(),
    notes: 'Click the "+" button to add a new task.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Plan your week',
    completed: false,
    priority: 'low',
    listId: 'planned',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Custom lists (user created)
const sampleCustomLists: List[] = [
  { id: generateId(), name: 'Work', color: '#4095EB', icon: 'briefcase' },
  { id: generateId(), name: 'Personal', color: '#E25C3D', icon: 'user' },
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
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [lists] = useState<List[]>(defaultLists);
  const [customLists, setCustomLists] = useState<List[]>(sampleCustomLists);
  const [selectedListId, setSelectedListId] = useState<string>('inbox');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'createdAt'>('createdAt');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCustomLists = localStorage.getItem('customLists');
    const savedSelectedListId = localStorage.getItem('selectedListId');
    const savedSortBy = localStorage.getItem('sortBy');
    const savedShowCompleted = localStorage.getItem('showCompleted');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCustomLists) setCustomLists(JSON.parse(savedCustomLists));
    if (savedSelectedListId) setSelectedListId(savedSelectedListId);
    if (savedSortBy) setSortBy(savedSortBy as any);
    if (savedShowCompleted) setShowCompleted(JSON.parse(savedShowCompleted));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('customLists', JSON.stringify(customLists));
    localStorage.setItem('selectedListId', selectedListId);
    localStorage.setItem('sortBy', sortBy);
    localStorage.setItem('showCompleted', JSON.stringify(showCompleted));
  }, [tasks, customLists, selectedListId, sortBy, showCompleted]);

  // Filter and sort tasks based on current state
  const filteredTasks = sortTasks(filterTasks(tasks, selectedListId === 'all' ? undefined : selectedListId, searchQuery, showCompleted), sortBy);

  // Task operations
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
      title: "Task added",
      description: "Your task was added successfully.",
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() } 
          : task
      )
    );
    toast({
      title: "Task updated",
      description: "Your task was updated successfully.",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task was deleted successfully.",
      variant: "destructive",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed, updatedAt: new Date() } 
          : task
      )
    );
  };

  // List operations
  const addList = (list: Omit<List, 'id'>) => {
    const newList: List = {
      ...list,
      id: generateId()
    };
    
    setCustomLists(prevLists => [...prevLists, newList]);
    setSelectedListId(newList.id);
    toast({
      title: "List added",
      description: `"${list.name}" was added successfully.`,
    });
  };

  const updateList = (id: string, updates: Partial<List>) => {
    setCustomLists(prevLists => 
      prevLists.map(list => 
        list.id === id 
          ? { ...list, ...updates } 
          : list
      )
    );
    toast({
      title: "List updated",
      description: "Your list was updated successfully.",
    });
  };

  const deleteList = (id: string) => {
    // Find the list name before deletion for the toast
    const listToDelete = customLists.find(list => list.id === id);
    
    setCustomLists(prevLists => prevLists.filter(list => list.id !== id));
    
    // If the deleted list was selected, switch to inbox
    if (selectedListId === id) {
      setSelectedListId('inbox');
    }
    
    // Delete all tasks in that list or move them to inbox (user preference could be added)
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
      filteredTasks
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
