
import { Priority, Task } from '@/types/task';
import { startOfDay, endOfDay, isWithinInterval, isPast, isFuture } from 'date-fns';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const priorityToLabel = (priority: Priority): string => {
  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    none: 'None'
  };
  return labels[priority];
};

export const sortTasks = (tasks: Task[], sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt' = 'createdAt'): Task[] => {
  return [...tasks].sort((a, b) => {
    // Always put completed tasks at the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    switch (sortBy) {
      case 'dueDate':
        // Tasks without due date come after those with due date
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && !b.dueDate) return 0;
        return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
      
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
        
      case 'title':
        return a.title.localeCompare(b.title);
      
      case 'createdAt':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
};

export const filterTasks = (
  tasks: Task[], 
  listId?: string,
  searchQuery: string = '',
  showCompleted: boolean = true
): Task[] => {
  return tasks.filter(task => {
    // Filter by completion status
    if (!showCompleted && task.completed) {
      return false;
    }
    
    // Special handling for "today" list
    if (listId === 'today') {
      const today = new Date();
      const dayStart = startOfDay(today);
      const dayEnd = endOfDay(today);
      
      // Include tasks that are due today
      if (task.dueDate) {
        const taskDueDate = new Date(task.dueDate);
        return isWithinInterval(taskDueDate, { start: dayStart, end: dayEnd });
      }
      return false;
    }
    
    // Special handling for "planned" list - show all tasks with a due date in the future
    if (listId === 'planned') {
      if (task.dueDate) {
        const taskDueDate = new Date(task.dueDate);
        return isFuture(taskDueDate);
      }
      return false;
    }
    
    // Filter by standard list
    if (listId && listId !== 'all' && task.listId !== listId) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};
