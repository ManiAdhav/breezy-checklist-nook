
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddActionDialog from './actions/AddActionDialog';
import ActionCard from './actions/ActionCard';

interface ActionsSectionProps {
  goalId: string;
  limit?: number;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ goalId, limit }) => {
  const { tasks, toggleTaskCompletion } = useTask();
  
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  
  // Filter actions for this goal
  const goalActions = tasks.filter(task => {
    // Check if the task is an action and has the correct goalId
    return task.isAction && task.goalId === goalId;
  });
  
  // Apply limit if specified
  const displayActions = limit ? goalActions.slice(0, limit) : goalActions;
  const hasMoreActions = limit && goalActions.length > limit;
  
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
      
      <div className="grid gap-3">
        {displayActions.length > 0 ? (
          <>
            {displayActions.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                onToggleTaskCompletion={toggleTaskCompletion}
              />
            ))}
            {hasMoreActions && (
              <Button variant="ghost" className="w-full text-sm text-muted-foreground">
                +{goalActions.length - limit} more actions
              </Button>
            )}
          </>
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
