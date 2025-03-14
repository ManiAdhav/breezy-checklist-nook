
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ThreeYearGoal, GoalStatus } from '@/types/task';

interface GoalProgressProps {
  goal: ThreeYearGoal;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  // Simple progress calculation for demo purposes
  const progressPercentage = 
    goal?.status === 'completed' ? 100 :
    goal?.status === 'in_progress' ? 65 : // Example value
    goal?.status === 'not_started' ? 0 : 5;
  
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
      </div>
    </div>
  );
};

export default GoalProgress;
