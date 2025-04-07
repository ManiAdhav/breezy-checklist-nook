
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTask } from '@/contexts/TaskContext';

interface TaskListHeaderProps {
  getSelectedListName: () => string;
  activeFilters: string[];
  handleAddTask: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  getSelectedListName,
  activeFilters,
  handleAddTask,
  showFilters,
  setShowFilters
}) => {
  const { 
    setSortBy, 
    setShowCompleted 
  } = useTask();

  return (
    <div className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">{getSelectedListName()}</h1>
        {activeFilters.length > 0 && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="mr-1">Filtered by:</span>
            {activeFilters.map((filter, index) => (
              <span key={index} className="mr-1">
                {index > 0 && ', '}
                {filter}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className={showFilters ? 'bg-accent/50' : ''}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filter
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('dueDate')}>
              <DynamicIcon name="calendar" className="h-4 w-4 mr-2" />
              Due date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('priority')}>
              <DynamicIcon name="flag" className="h-4 w-4 mr-2" />
              Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('title')}>
              <DynamicIcon name="align-left" className="h-4 w-4 mr-2" />
              Alphabetically
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('createdAt')}>
              <DynamicIcon name="clock" className="h-4 w-4 mr-2" />
              Creation date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCompleted(prev => !prev)}>
              <DynamicIcon name="check" className="h-4 w-4 mr-2" />
              Show/hide completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button size="sm" onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default TaskListHeader;
