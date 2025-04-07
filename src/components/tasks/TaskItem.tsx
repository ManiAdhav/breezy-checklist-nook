
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Calendar, Tag as TagIcon, TrashIcon, Pencil, Info } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTask } from '@/contexts/TaskContext';
import TagBadge from '@/components/tags/TagBadge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask, tags } = useTask();
  
  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-400';
      case 'low':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  // Format the due date
  const formattedDate = task.dueDate 
    ? format(new Date(task.dueDate), 'MMM d, yyyy') 
    : null;
  
  // Debug info for the task
  const showTaskInfo = () => {
    console.log('Task details:', task);
    alert(`Task ID: ${task.id}\nList ID: ${task.listId}\nCreated: ${task.createdAt}\nTags: ${task.tags?.join(', ') || 'None'}`);
  };
  
  return (
    <div 
      className={cn(
        "p-3 flex items-start rounded-md border border-border mb-2 transition-all",
        "hover:bg-accent/10 relative group",
        task.completed && "bg-accent/5 opacity-75"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className={`p-0 w-6 h-6 mr-3 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
        onClick={() => toggleTaskCompletion(task.id)}
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </Button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={cn(
            "font-medium text-sm mb-1 break-words",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          
          <div className="text-xs text-muted-foreground/70 flex items-center">
            <span>List: {task.listId}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-5 w-5 ml-1 p-0"
                    onClick={showTaskInfo}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show task details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center mt-2 text-xs text-muted-foreground">
          {formattedDate && (
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formattedDate}
            </div>
          )}
          
          {task.priority && task.priority !== 'none' && (
            <div className={`capitalize ${getPriorityColor(task.priority)}`}>
              {task.priority} priority
            </div>
          )}
          
          {/* Display task ID for debugging */}
          <div className="text-xs text-muted-foreground/50 inline-flex">
            ID: {task.id.substring(0, 6)}...
          </div>
        </div>
        
        {/* Display tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map(tagId => (
              <TagBadge key={tagId} tagId={tagId} />
            ))}
          </div>
        )}
        
        {task.notes && (
          <p className="text-xs text-muted-foreground mt-2 break-words line-clamp-2">
            {task.notes}
          </p>
        )}
      </div>
      
      <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-destructive" 
          onClick={() => deleteTask(task.id)}
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
