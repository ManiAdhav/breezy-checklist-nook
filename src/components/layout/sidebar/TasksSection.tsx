
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Inbox, Clock, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTask } from '@/contexts/TaskContext';

const TasksSection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedListId, setSelectedListId } = useTask();
  const [showTasks, setShowTasks] = useState(true);

  const handleListClick = (listId: string) => {
    setSelectedListId(listId);
    navigate('/');
  };

  return (
    <div className="mb-2 space-y-0.5">
      <div className="flex items-center px-2 py-1 text-xs font-medium text-foreground cursor-pointer mt-2 hover:bg-accent/30 rounded-md" onClick={() => setShowTasks(!showTasks)}>
        {showTasks ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
        <span>Tasks</span>
      </div>
      
      {showTasks && (
        <div className="ml-1 space-y-0.5">
          <Button 
            variant="ghost" 
            className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'inbox' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
            onClick={() => handleListClick('inbox')}
          >
            <Inbox className="h-4 w-4 mr-2" />
            <span>Inbox</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'today' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
            onClick={() => handleListClick('today')}
          >
            <Clock className="h-4 w-4 mr-2" />
            <span>Today</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item ${selectedListId === 'planned' && location.pathname === '/' ? 'sidebar-item-active' : ''}`}
            onClick={() => handleListClick('planned')}
          >
            <CalendarClock className="h-4 w-4 mr-2" />
            <span>Planned</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TasksSection;
