
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, Priority } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { Pencil, Trash2 } from 'lucide-react';
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

  return (
    <div 
      className={`group p-3 border-b border-border transition-colors duration-150 ${
        isHovered ? 'bg-task-hover' : ''
      } ${task.completed ? 'bg-muted/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggle}
            className={`mr-3 transition-transform ${task.completed ? 'checkbox-animation' : ''}`}
          />
          
          <div className={`font-medium ${task.completed ? 'task-complete' : ''}`}>
            {task.title}
          </div>
        </div>
        
        <div className="flex items-center">
          {task.dueDate && (
            <div className="text-sm text-muted-foreground mr-4">
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
          
          <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
