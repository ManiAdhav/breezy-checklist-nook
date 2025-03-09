
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, Priority } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { Pencil, Trash2, Calendar, Flag, Clock } from 'lucide-react';
import Tag from '@/components/ui/Tag';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask } = useTask();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    toggleTaskCompletion(task.id);
  };

  const getPriorityColor = (priority: Priority): string => {
    const colors = {
      high: 'text-priority-high',
      medium: 'text-priority-medium',
      low: 'text-priority-low',
      none: 'text-priority-none',
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: Priority) => {
    if (priority === 'none') return null;
    
    return (
      <Flag className={`h-3.5 w-3.5 ${getPriorityColor(priority)}`} />
    );
  };

  return (
    <div 
      className={`group p-3 border-b border-border transition-colors duration-150 ${
        isHovered ? 'bg-task-hover' : ''
      } ${task.completed ? 'bg-muted/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggle}
            className={`transition-transform ${task.completed ? 'checkbox-animation' : ''}`}
          />
        </div>
        
        <div className="flex-1 min-w-0 mr-2">
          <div 
            className={`font-medium ${task.completed ? 'task-complete' : ''}`}
          >
            {task.title}
          </div>
          
          {task.notes && (
            <div className={`text-sm text-muted-foreground mt-1 line-clamp-1 ${task.completed ? 'task-complete' : ''}`}>
              {task.notes}
            </div>
          )}
          
          <div className="flex items-center space-x-3 mt-2">
            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
            
            {task.priority !== 'none' && (
              <div className="flex items-center">
                {getPriorityIcon(task.priority)}
              </div>
            )}
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(task.updatedAt), 'MMM d')}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
