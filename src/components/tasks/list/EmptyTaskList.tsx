
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';

interface EmptyTaskListProps {
  handleAddTask: () => void;
}

const EmptyTaskList: React.FC<EmptyTaskListProps> = ({ handleAddTask }) => {
  const { tasks, setSearchQuery, setShowCompleted } = useTask();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="bg-muted rounded-full p-6 mb-4">
        <Check className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium">No tasks here</h3>
      <p className="text-muted-foreground mt-2 max-w-sm">
        {tasks.length > 0 
          ? "Try changing your filters to see more tasks."
          : "Add a new task to get started."}
      </p>
      <div className="flex mt-6 gap-2">
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Task</span>
        </Button>
        {tasks.length > 0 && (
          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setShowCompleted(true);
          }}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyTaskList;
