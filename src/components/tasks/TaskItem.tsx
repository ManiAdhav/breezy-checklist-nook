
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, Priority } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion } = useTask();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    toggleTaskCompletion(task.id);
  };
  
  const getPriorityColor = (priority: Priority): string => {
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
    <div 
      className={cn(
        "flex flex-col border-b border-border py-3 px-2 hover:bg-accent/10 rounded-md transition-colors duration-150",
        task.completed && "opacity-70"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1 mr-3" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggle}
            className={`transition-transform ${task.completed ? 'checkbox-animation' : ''}`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={cn(
            "font-medium text-base",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </div>
          
          <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center mr-3">
                <span className="text-xs">
                  {format(new Date(task.dueDate), 'dd-MM-yy')}
                </span>
              </div>
            )}
            
            {task.listId && task.listId !== 'inbox' && task.listId !== 'today' && task.listId !== 'planned' && (
              <div className="flex items-center mr-2">
                <span className="flex items-center text-xs">
                  {task.listId === '1' ? 'Subtasks' : ''}
                </span>
              </div>
            )}
            
            {task.priority !== 'none' && (
              <div className="flex items-center space-x-1">
                <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <span className="capitalize">{task.priority}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-60" />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
