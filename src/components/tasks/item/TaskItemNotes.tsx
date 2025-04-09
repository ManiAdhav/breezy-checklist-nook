
import React from 'react';

interface TaskItemNotesProps {
  notes?: string;
}

const TaskItemNotes: React.FC<TaskItemNotesProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <p className="text-xs text-muted-foreground mt-1.5 break-words whitespace-pre-wrap">
      {notes}
    </p>
  );
};

export default TaskItemNotes;
