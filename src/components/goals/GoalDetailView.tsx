
import React from 'react';
import { useGoalDetail } from './detail/useGoalDetail';
import GoalHeader from './sections/GoalHeader';
import GoalProgress from './sections/GoalProgress';
import GoalTabs from './detail/GoalTabs';
import GoalNotFound from './detail/GoalNotFound';
import GoalActionButton from './detail/GoalActionButton';
import EditGoalDialog from './dialogs/EditGoalDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  } = useGoalDetail(goalId);
  
  if (!goal) {
    return <GoalNotFound onBack={onBack} />;
  }
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
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
      
      <ScrollArea className="flex-1">
        {/* Goal Description and Progress */}
        <GoalProgress goal={goal} />
        
        {/* Tabs for different sections */}
        <div className="px-6 py-4 pb-20">
          <GoalTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            goalId={goalId}
            milestoneCount={milestoneCount}
            planCount={planCount}
            taskCount={taskCount}
            habitCount={habitCount}
          />
        </div>
      </ScrollArea>
      
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
