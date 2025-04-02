
import React from 'react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface ActionTaskItemProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const ActionTaskItem: React.FC<ActionTaskItemProps> = ({ task, toggleTaskCompletion, deleteTask }) => {
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <li className="px-4 py-3 border-b border-border hover:bg-accent/10">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1 mr-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            id={`task-${task.id}`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "text-base font-medium leading-tight block",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </label>
          
          <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center mr-3">
                <span className="text-xs">
                  {format(new Date(task.dueDate), 'dd-MM-yy')}
                </span>
              </div>
            )}
            
            {task.priority && task.priority !== 'none' && (
              <div className="flex items-center space-x-1">
                <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <span className="capitalize">{task.priority}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => deleteTask(task.id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
};

export default ActionTaskItem;
