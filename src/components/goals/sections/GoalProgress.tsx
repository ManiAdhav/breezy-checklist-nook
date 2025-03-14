
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/hooks/useGoalContext';

interface GoalProgressProps {
  goal: ThreeYearGoal;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const { tasks } = useTask();
  const { ninetyDayTargets, plans } = useGoal();
  
  // Find all tasks, milestones, and plans associated with this goal
  const goalTasks = tasks.filter(task => task.goalId === goal.id);
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goal.id);
  const goalPlans = plans.filter(plan => 
    goalMilestones.some(milestone => milestone.id === plan.ninetyDayTargetId)
  );
  
  // Calculate completion percentages
  const completedTasks = goalTasks.filter(task => task.completed).length;
  const taskCompletionPercentage = goalTasks.length > 0 
    ? (completedTasks / goalTasks.length) * 100 
    : 0;
  
  const completedMilestones = goalMilestones.filter(milestone => milestone.status === 'completed').length;
  const milestoneCompletionPercentage = goalMilestones.length > 0 
    ? (completedMilestones / goalMilestones.length) * 100 
    : 0;
  
  const completedPlans = goalPlans.filter(plan => plan.status === 'completed').length;
  const planCompletionPercentage = goalPlans.length > 0 
    ? (completedPlans / goalPlans.length) * 100 
    : 0;
  
  // Calculate overall progress - weighted average
  const progressPercentage = goal.status === 'completed' 
    ? 100 
    : goal.status === 'abandoned' 
      ? 0
      : Math.round((taskCompletionPercentage + milestoneCompletionPercentage * 2 + planCompletionPercentage * 2) / 5);
  
  const getStatusColor = (status: GoalStatus): string => {
    const colors = {
      not_started: 'bg-gray-500',
      in_progress: 'bg-primary',
      completed: 'bg-green-500',
      abandoned: 'bg-red-500',
    };
    return colors[status];
  };
  
  const getStatusLabel = (status: GoalStatus): string => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed',
      abandoned: 'Abandoned',
    };
    return labels[status];
  };
  
  return (
    <div className="p-6 border-b border-border bg-card/50">
      <div className="mb-5">
        {goal.description && (
          <p className="text-muted-foreground">{goal.description}</p>
        )}
      </div>
      
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm">Goal Progress</h3>
          <span className="text-sm font-semibold">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2.5" />
        
        <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-1.5 ${getStatusColor(goal.status)}`}></div>
            <span>{getStatusLabel(goal.status)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground mb-1">Milestones</span>
            <div className="flex items-center">
              <span className="font-medium">{completedMilestones}</span>
              <span className="text-muted-foreground ml-1">/ {goalMilestones.length}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground mb-1">Plans</span>
            <div className="flex items-center">
              <span className="font-medium">{completedPlans}</span>
              <span className="text-muted-foreground ml-1">/ {goalPlans.length}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground mb-1">Tasks</span>
            <div className="flex items-center">
              <span className="font-medium">{completedTasks}</span>
              <span className="text-muted-foreground ml-1">/ {goalTasks.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;
