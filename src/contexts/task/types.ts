
import { Task, List, Priority, Tag } from '@/types/task';

export interface TaskContextType {
  tasks: Task[];
  lists: List[];
  customLists: List[];
  tags: Tag[];
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
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  setSelectedListId: (id: string) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt') => void;
  setShowCompleted: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  filteredTasks: Task[];
  isLoading: boolean;
}

// Default lists that will be used by the task context
export const defaultLists: List[] = [
  { id: 'all', name: 'All Tasks', icon: 'list-todo' },
  { id: 'inbox', name: 'Inbox', icon: 'inbox' },
  { id: 'today', name: 'Today', icon: 'calendar' },
  { id: 'planned', name: 'Planned', icon: 'calendar-clock' },
];
