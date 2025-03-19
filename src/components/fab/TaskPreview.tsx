
import React from 'react';
import { format } from 'date-fns';

interface TaskPreviewProps {
  dueDate: Date | null;
  recurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const TaskPreview: React.FC<TaskPreviewProps> = ({ 
  dueDate, 
  recurring, 
  recurringPattern 
}) => {
  if (!dueDate) return null;
  
  return (
    <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-md p-3 shadow-sm animate-fade-in absolute bottom-full mb-2 left-0 right-0">
      <div className="text-sm text-gray-500">Task will be scheduled for:</div>
      <div className="font-medium">
        {format(dueDate, 'PPP')}
        {dueDate.getHours() !== 0 && (
          <span className="ml-2">{format(dueDate, 'p')}</span>
        )}
      </div>
      {recurring && (
        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mt-1">
          Recurring: {recurringPattern}
        </div>
      )}
    </div>
  );
};

export default TaskPreview;
