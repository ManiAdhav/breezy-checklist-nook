
import React from 'react';
import { cn } from '@/lib/utils';
import { useTask } from '@/contexts/TaskContext';

interface TaskItemHeaderProps {
  title: string;
  listId: string;
  completed: boolean;
  showTaskInfo: () => void;
}

const TaskItemHeader: React.FC<TaskItemHeaderProps> = ({
  title,
  listId,
  completed
}) => {
  const { lists, customLists } = useTask();
  
  // Get the list name based on the listId
  const getListName = () => {
    // First check built-in lists
    const builtInList = lists.find(list => list.id === listId);
    if (builtInList) return builtInList.name;
    
    // Then check custom lists
    const custom = customLists.find(list => list.id === listId);
    if (custom) return custom.name;
    
    // Fallback to list ID if not found
    return listId;
  };

  return (
    <div className="flex items-center justify-between">
      <p className={cn(
        "font-medium text-sm mb-1 break-words",
        completed && "line-through text-muted-foreground"
      )}>
        {title}
      </p>
      
      <div className="text-xs text-muted-foreground/70 flex items-center">
        <span>{getListName()}</span>
      </div>
    </div>
  );
};

export default TaskItemHeader;
