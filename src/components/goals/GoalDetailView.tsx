
import React from 'react';
import { useGoalDetailView } from './hooks/useGoalDetailView';
import GoalHeader from './sections/GoalHeader';
import GoalDetailContent from './detail/GoalDetailContent';
import GoalNotFound from './detail/GoalNotFound';
import GoalActionButton from './detail/GoalActionButton';
import EditGoalDialog from './dialogs/EditGoalDialog';

interface GoalDetailViewProps {
  goalId: string;
  onBack: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ goalId, onBack }) => {
  const {
    goal,
    activeTab,
    isEditGoalDialogOpen,
    setIsEditGoalDialogOpen,
    taskCount,
    actionCount,
    habitCount,
    handleTabChange
  } = useGoalDetailView(goalId);
  
  if (!goal) {
    return <GoalNotFound onBack={onBack} />;
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Header - Fixed height section */}
      <div className="flex-shrink-0">
        <GoalHeader 
          goal={goal} 
          onBack={onBack} 
          onEdit={() => setIsEditGoalDialogOpen(true)}
          taskCount={taskCount}
          actionCount={actionCount}
          habitCount={habitCount}
        />
      </div>
      
      {/* Content - Takes all available space and enables scrolling */}
      <div className="flex-1 overflow-hidden">
        <GoalDetailContent
          goal={goal}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          goalId={goalId}
          taskCount={taskCount}
          habitCount={habitCount}
        />
      </div>
      
      {/* Edit Goal Dialog */}
      {goal && <EditGoalDialog 
        goal={goal} 
        isOpen={isEditGoalDialogOpen} 
        onOpenChange={setIsEditGoalDialogOpen} 
      />}
      
      {/* Floating Action Button */}
      <GoalActionButton />
    </div>
  );
};

export default GoalDetailView;
