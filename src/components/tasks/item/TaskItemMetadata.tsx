
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Target } from 'lucide-react';
import { useGoal } from '@/hooks/useGoalContext';

interface TaskItemMetadataProps {
  dueDate?: Date | string | null;
  priority: string;
  taskId: string;
  getPriorityColor: (priority: string) => string;
  goalId?: string;
}

const TaskItemMetadata: React.FC<TaskItemMetadataProps> = ({
  dueDate,
  priority,
  getPriorityColor,
  goalId
}) => {
  // Get goals from context
  const { threeYearGoals } = useGoal();
  
  // Format the due date
  const formattedDate = dueDate 
    ? format(new Date(dueDate), 'MMM d, yyyy') 
    : null;
  
  // Find the goal name if goalId is provided
  const goal = goalId && threeYearGoals ? threeYearGoals.find(g => g.id === goalId) : null;
  
  return (
    <div className="flex flex-wrap gap-2 items-center mt-2 text-xs text-muted-foreground">
      {formattedDate && (
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {formattedDate}
        </div>
      )}
      
      {/* Display goal name if exists */}
      {goal && (
        <div className="flex items-center">
          <Target className="h-3.5 w-3.5 mr-1" />
          {goal.title}
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
