
import React from 'react';
import { Goals } from '@/types/task';
import { useGoalProgress } from './progress/useGoalProgress';
import StatusIndicator from './progress/StatusIndicator';
import MainProgressBar from './progress/MainProgressBar';
import ProgressCategories from './progress/ProgressCategories';

interface GoalProgressProps {
  goal: Goals;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const {
    goalMilestones,
    goalPlans,
    goalTasks,
    goalHabits,
    goalActions,
    completedTasks,
    completedMilestones,
    completedPlans,
    completedActions,
    taskCompletionPercentage,
    milestoneCompletionPercentage,
    planCompletionPercentage,
    actionCompletionPercentage,
    habitCompletionPercentage,
    progressPercentage,
    getStatusColor,
    getStatusLabel
  } = useGoalProgress(goal);
  
  return (
    <div className="p-6 border-b border-border bg-card/50">
      <div className="mb-5">
        {goal.description && (
          <p className="text-muted-foreground">{goal.description}</p>
        )}
      </div>
      
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
        <MainProgressBar progressPercentage={progressPercentage} />
        
        <StatusIndicator 
          status={goal.status} 
          getStatusColor={getStatusColor} 
          getStatusLabel={getStatusLabel} 
        />
        
        <ProgressCategories 
          milestoneCompletionPercentage={milestoneCompletionPercentage}
          completedMilestones={completedMilestones}
          goalMilestonesLength={goalMilestones.length}
          planCompletionPercentage={planCompletionPercentage}
          completedPlans={completedPlans}
          goalPlansLength={goalPlans.length}
          taskCompletionPercentage={taskCompletionPercentage}
          completedTasks={completedTasks}
          goalTasksLength={goalTasks.length}
          actionCompletionPercentage={actionCompletionPercentage}
          completedActions={completedActions}
          goalActionsLength={goalActions.length}
          habitCompletionPercentage={habitCompletionPercentage}
          goalHabitsLength={goalHabits.length}
        />
      </div>
    </div>
  );
};

export default GoalProgress;
