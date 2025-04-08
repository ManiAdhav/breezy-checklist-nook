
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

interface TaskCompletionToggleProps {
  completed: boolean;
  toggleTaskCompletion: (id: string) => void;
  taskId: string;
}

const TaskCompletionToggle: React.FC<TaskCompletionToggleProps> = ({
  completed,
  toggleTaskCompletion,
  taskId
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    e.preventDefault();
    toggleTaskCompletion(taskId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-0 w-6 h-6 mr-3 ${completed ? 'text-green-500' : 'text-gray-400'}`}
      onClick={handleToggle}
      type="button"
    >
      {completed ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <Circle className="h-5 w-5" />
      )}
    </Button>
  );
};

export default TaskCompletionToggle;
