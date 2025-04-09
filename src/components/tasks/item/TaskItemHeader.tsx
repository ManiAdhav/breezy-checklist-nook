
import React from 'react';
import { cn } from '@/lib/utils';

interface TaskItemHeaderProps {
  title: string;
  listId: string;
  completed: boolean;
  showTaskInfo: () => void;
}

const TaskItemHeader: React.FC<TaskItemHeaderProps> = ({
  title,
  completed
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className={cn(
        "font-medium text-sm mb-1 break-words",
        completed && "line-through text-muted-foreground"
      )}>
        {title}
      </p>
      
      <div className="text-xs text-muted-foreground/70 flex items-center">
        <span>Inbox</span>
      </div>
    </div>
  );
};

export default TaskItemHeader;
