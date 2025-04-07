
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, TrashIcon } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskItemActionsProps {
  onEdit: (task: Task) => void;
  deleteTask: (id: string) => void;
  task: Task;
}

const TaskItemActions: React.FC<TaskItemActionsProps> = ({
  onEdit,
  deleteTask,
  task
}) => {
  return (
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
  );
};

export default TaskItemActions;
