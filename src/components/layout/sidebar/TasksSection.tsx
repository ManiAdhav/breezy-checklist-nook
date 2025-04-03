
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Inbox, Clock, CalendarClock, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTask } from '@/contexts/TaskContext';

const TasksSection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedListId, setSelectedListId, tasks } = useTask();

  const handleListClick = (listId: string) => {
    setSelectedListId(listId);
    navigate('/');
  };
  
  // Count tasks for each list category
  const getTaskCountForList = (listId: string) => {
    return tasks.filter(task => {
      if (listId === 'all') {
        return !task.completed;
      }
      
      if (listId === 'inbox') {
        return task.listId === 'inbox' && !task.completed;
      }

      if (listId === 'today') {
        // Special handling for today list via the filtering mechanism
        const today = new Date();
        const isToday = task.dueDate && 
          new Date(task.dueDate).toDateString() === today.toDateString();
        return isToday && !task.completed;
      }
      
      if (listId === 'planned') {
        // Tasks with a future due date that aren't due today
        if (!task.dueDate || task.completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate > today;
      }
      
      return task.listId === listId && !task.completed;
    }).length;
  };

  return (
    <div className="mb-2 space-y-0.5">
      <div className="flex items-center px-2 py-1 text-xs font-medium text-foreground mt-2">
        <span>Tasks</span>
      </div>
      
      <div className="ml-1 space-y-0.5">
        <Button 
          variant="ghost" 
          className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'all' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
          onClick={() => handleListClick('all')}
        >
          <ListTodo className="h-4 w-4 mr-2" />
          <span>All Tasks</span>
          {getTaskCountForList('all') > 0 && (
            <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center ml-auto">
              {getTaskCountForList('all')}
            </span>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'inbox' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
          onClick={() => handleListClick('inbox')}
        >
          <Inbox className="h-4 w-4 mr-2" />
          <span>Inbox</span>
          {getTaskCountForList('inbox') > 0 && (
            <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center ml-auto">
              {getTaskCountForList('inbox')}
            </span>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'today' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
          onClick={() => handleListClick('today')}
        >
          <Clock className="h-4 w-4 mr-2" />
          <span>Today</span>
          {getTaskCountForList('today') > 0 && (
            <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center ml-auto">
              {getTaskCountForList('today')}
            </span>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'planned' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
          onClick={() => handleListClick('planned')}
        >
          <CalendarClock className="h-4 w-4 mr-2" />
          <span>Planned</span>
          {getTaskCountForList('planned') > 0 && (
            <span className="text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center ml-auto">
              {getTaskCountForList('planned')}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TasksSection;
