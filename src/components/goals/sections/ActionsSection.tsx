
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddActionDialog from './actions/AddActionDialog';
import ActionItem from './actions/ActionItem';

interface ActionsSectionProps {
  goalId: string;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ goalId }) => {
  const { tasks, toggleTaskCompletion } = useTask();
  
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('milestones');
  
  // Filter actions for this goal
  const goalActions = tasks.filter(task => {
    if (task.isAction && task.planId) {
      return task.goalId === goalId;
    }
    return false;
  });
  
  const toggleTaskDetails = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Actions</h3>
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
            <ActionItem
              key={action.id}
              action={action}
              expandedTaskId={expandedTaskId}
              selectedTab={selectedTab}
              onToggleTaskCompletion={toggleTaskCompletion}
              onToggleTaskDetails={toggleTaskDetails}
              onTabChange={setSelectedTab}
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
