
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddActionDialog from './actions/AddActionDialog';
import ActionCard from './actions/ActionCard';

interface ActionsSectionProps {
  goalId: string;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ goalId }) => {
  const { tasks, toggleTaskCompletion } = useTask();
  
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  
  // Filter actions for this goal
  const goalActions = tasks.filter(task => {
    // Check if the task is an action and has the correct goalId
    return task.isAction && task.goalId === goalId;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">Actions</h3>
          <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {goalActions.length}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8" 
          onClick={() => setIsAddActionOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Action
        </Button>
      </div>
      
      <div className="space-y-2">
        {goalActions.length > 0 ? (
          goalActions.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              onToggleTaskCompletion={toggleTaskCompletion}
            />
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No actions created yet. Add one to get started.
          </div>
        )}
      </div>
      
      <AddActionDialog 
        goalId={goalId}
        isOpen={isAddActionOpen}
        onOpenChange={setIsAddActionOpen}
      />
    </div>
  );
};

export default ActionsSection;
