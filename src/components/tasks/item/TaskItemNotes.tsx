
import React from 'react';

interface TaskItemNotesProps {
  notes?: string;
}

const TaskItemNotes: React.FC<TaskItemNotesProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <p className="text-xs text-muted-foreground mt-2 break-words line-clamp-2">
      {notes}
    </p>
  );
};

export default TaskItemNotes;
