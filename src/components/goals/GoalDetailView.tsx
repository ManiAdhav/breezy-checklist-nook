
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
    milestoneCount,
    planCount,
    taskCount,
    actionCount,
    habitCount,
    handleTabChange
  } = useGoalDetailView(goalId);
  
  if (!goal) {
    return <GoalNotFound onBack={onBack} />;
  }
  
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header - Fixed at top */}
      <GoalHeader 
        goal={goal} 
        onBack={onBack} 
        onEdit={() => setIsEditGoalDialogOpen(true)}
        milestoneCount={milestoneCount}
        planCount={planCount}
        taskCount={taskCount}
        actionCount={actionCount}
        habitCount={habitCount}
      />
      
      {/* Content - Flexible container that takes remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <GoalDetailContent
          goal={goal}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          goalId={goalId}
          milestoneCount={milestoneCount}
          planCount={planCount}
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
