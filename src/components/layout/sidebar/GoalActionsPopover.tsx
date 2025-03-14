
import React from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Task } from '@/types/task';
import { ChevronRight, CircleCheck } from 'lucide-react';

// Import the type directly from the context to avoid the error
import { useGoal } from '@/contexts/GoalContext';

interface GoalActionsPopoverProps {
  goal: {
    id: string;
    title: string;
  };
  goalTasks: Task[];
}

const GoalActionsPopover: React.FC<GoalActionsPopoverProps> = ({ goal, goalTasks }) => {
  const { toggleTaskCompletion } = useTask();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start h-7 px-2 py-0.5 text-xs sidebar-item"
        >
          <ChevronRight className="h-3.5 w-3.5 mr-1" />
          <span className="truncate">{goal.title}</span>
          <span className="ml-auto text-[9px] bg-secondary rounded-full px-1 py-0.5 min-w-4 text-center">
            {goalTasks.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-64 p-2">
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          <div className="text-xs font-medium mb-1.5">{goal.title} Actions</div>
          {goalTasks.map(task => (
            <div key={task.id} className="flex gap-2 items-start text-xs p-1 hover:bg-accent/20 rounded">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0" 
                onClick={() => toggleTaskCompletion(task.id)}
              >
                <CircleCheck className={`h-4 w-4 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
              <span className="line-clamp-2">{task.title}</span>
            </div>
          ))}
          <Link to="/actions" className="block">
            <Button variant="outline" size="sm" className="w-full mt-1 text-xs h-7">
              View All
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GoalActionsPopover;
