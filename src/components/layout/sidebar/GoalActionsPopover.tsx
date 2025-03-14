
import React from 'react';
import { ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { Task } from '@/types/task';
import { ThreeYearGoal } from '@/contexts/goal/types';

interface GoalActionsPopoverProps {
  goal: ThreeYearGoal;
  goalTasks: Task[];
}

const GoalActionsPopover: React.FC<GoalActionsPopoverProps> = ({ goal, goalTasks }) => {
  const navigate = useNavigate();
  const { toggleTaskCompletion } = useTask();
  
  return (
    <div className="ml-4 mt-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start h-6 px-2 py-0.5 text-[10px] sidebar-item"
          >
            <ListChecks className="h-3 w-3 mr-1.5 text-muted-foreground" />
            <span className="truncate">{goal.title}</span>
            <span className="ml-1 text-[8px] bg-secondary/70 rounded-full px-1 min-w-3 text-center">
              {goalTasks.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0" align="start">
          <div className="bg-white rounded-md shadow-md border overflow-hidden">
            <div className="px-2 py-1.5 border-b bg-muted/30">
              <h3 className="text-xs font-medium truncate">{goal.title}</h3>
            </div>
            <div className="max-h-[200px] overflow-y-auto p-1">
              {goalTasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-start p-1.5 hover:bg-accent/20 rounded-md cursor-pointer text-xs"
                  onClick={() => navigate(`/goals?goalId=${goal.id}`)}
                >
                  <Checkbox 
                    checked={task.completed}
                    className="mt-0.5 mr-2"
                    onCheckedChange={() => {
                      toggleTaskCompletion(task.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>{task.title}</div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GoalActionsPopover;
