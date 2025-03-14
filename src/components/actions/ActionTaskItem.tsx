
import React from 'react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ActionTaskItemProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const ActionTaskItem: React.FC<ActionTaskItemProps> = ({ task, toggleTaskCompletion, deleteTask }) => {
  return (
    <li className="px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            id={`task-${task.id}`}
            className="mt-0.5"
          />
          <div className="ml-3">
            <label
              htmlFor={`task-${task.id}`}
              className={`text-sm leading-tight ${task.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {task.title}
            </label>
            
            {(task.startDate || task.dueDate) && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {task.startDate && format(new Date(task.startDate), 'MMM d')}
                  {task.startDate && task.dueDate && ' - '}
                  {task.dueDate && format(new Date(task.dueDate), 'MMM d')}
                </span>
              </div>
            )}
          </div>
        </div>
        
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
    </li>
  );
};

export default ActionTaskItem;
