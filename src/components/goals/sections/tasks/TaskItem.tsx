
import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  MoreHorizontal,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, Priority } from '@/types/task';

interface TaskItemProps {
  task: Task;
  index: number;
  totalTasks: number;
  toggleTaskStatus: (id: string) => void;
  moveTask: (id: string, direction: 'up' | 'down') => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  getPriorityClasses: (priority: Priority) => string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  totalTasks,
  toggleTaskStatus,
  moveTask,
  onEdit,
  onDelete,
  getPriorityClasses
}) => {
  return (
    <div 
      className="flex items-start p-3 border border-border rounded-md bg-card"
    >
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 mr-2 rounded-full ${
          task.completed ? 'text-green-500' : 'text-gray-500'
        }`}
        onClick={() => toggleTaskStatus(task.id)}
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 fill-green-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </Button>
      
      <div className="flex-1 min-w-0">
        <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </div>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        )}
        
        <div className="flex items-center mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityClasses(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-1 mr-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full"
          disabled={index === 0}
          onClick={() => moveTask(task.id, 'up')}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full"
          disabled={index === totalTasks - 1}
          onClick={() => moveTask(task.id, 'down')}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskItem;
