
import React from 'react';
import { format } from 'date-fns';
import { Task } from '@/types/task';
import { CheckCircle2, Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionItemProps {
  action: Task;
  onToggle: (id: string) => void;
  onEdit: (action: Task) => void;
  onDelete: (id: string) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({
  action,
  onToggle,
  onEdit,
  onDelete
}) => {
  // Calculate date range for display
  const startDate = action.startDate ? new Date(action.startDate) : null;
  const dueDate = action.dueDate ? new Date(action.dueDate) : null;
  
  return (
    <div className="flex items-start p-3 border-b last:border-b-0">
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 mr-2 rounded-full ${action.completed ? 'text-green-500' : 'text-gray-400'}`}
        onClick={() => onToggle(action.id)}
      >
        <CheckCircle2 className={`h-5 w-5 ${action.completed ? 'fill-green-500' : ''}`} />
      </Button>
      
      <div className="flex-1 min-w-0">
        <div className={`font-medium ${action.completed ? 'line-through text-muted-foreground' : ''}`}>
          {action.title}
        </div>
        
        {(startDate || dueDate) && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>
              {startDate && format(startDate, 'MMM d')}
              {startDate && dueDate && ' - '}
              {dueDate && format(dueDate, 'MMM d')}
            </span>
          </div>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(action)}>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => onDelete(action.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionItem;
