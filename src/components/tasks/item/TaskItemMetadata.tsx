
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface TaskItemMetadataProps {
  dueDate?: Date | string | null;
  priority: string;
  taskId: string;
  getPriorityColor: (priority: string) => string;
}

const TaskItemMetadata: React.FC<TaskItemMetadataProps> = ({
  dueDate,
  priority,
  getPriorityColor
}) => {
  // Format the due date
  const formattedDate = dueDate 
    ? format(new Date(dueDate), 'MMM d, yyyy') 
    : null;
  
  return (
    <div className="flex flex-wrap gap-2 items-center mt-2 text-xs text-muted-foreground">
      {formattedDate && (
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {formattedDate}
        </div>
      )}
      
      {priority && priority !== 'none' && (
        <div className={`capitalize ${getPriorityColor(priority)}`}>
          {priority} priority
        </div>
      )}
    </div>
  );
};

export default TaskItemMetadata;
