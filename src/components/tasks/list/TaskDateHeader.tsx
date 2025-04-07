
import React from 'react';

interface TaskDateHeaderProps {
  selectedListId: string;
  title: string;
}

const TaskDateHeader: React.FC<TaskDateHeaderProps> = ({ 
  selectedListId, 
  title 
}) => {
  // Don't show Today and Planned additional information for regular lists
  const showDateHeader = selectedListId === 'today' || selectedListId === 'planned';
  
  if (!showDateHeader) return null;

  return (
    <div className="text-sm font-medium text-foreground mb-2">
      {title}
    </div>
  );
};

export default TaskDateHeader;
