
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyTaskStateProps {
  onAddTask: () => void;
}

const EmptyTaskState: React.FC<EmptyTaskStateProps> = ({ onAddTask }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
      <p className="text-muted-foreground mb-2">No tasks yet</p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onAddTask}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Your First Task
      </Button>
    </div>
  );
};

export default EmptyTaskState;
