
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Goals, GoalStatus } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/hooks/useGoalContext';
import { useHabit } from '@/contexts/HabitContext';
import { 
  CalendarCheck,
  Target,
  ListChecks, 
  Repeat
} from 'lucide-react';

interface GoalProgressProps {
  goal: Goals;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const { tasks } = useTask();
  const { ninetyDayTargets, plans } = useGoal();
  const { habits, habitLogs } = useHabit();
  
  // Find all tasks, milestones, and plans associated with this goal
  const goalTasks = tasks.filter(task => task.goalId === goal.id);
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goal.id);
  const goalPlans = plans.filter(plan => 
    goalMilestones.some(milestone => milestone.id === plan.ninetyDayTargetId)
  );
  const goalHabits = habits.filter(habit => habit.goalId === goal.id);
  const goalActions = tasks.filter(task => task.isAction && task.goalId === goal.id);
  
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
    
  const completedActions = goalActions.filter(action => action.completed).length;
  const actionCompletionPercentage = goalActions.length > 0
    ? (completedActions / goalActions.length) * 100
    : 0;
    
  // For habits, we consider the consistency percentage
  let habitCompletionPercentage = 0;
  if (goalHabits.length > 0) {
    const habitPercentages = goalHabits.map(habit => {
      const habitLogEntries = habitLogs.filter(log => log.habitId === habit.id);
      // If there are no entries yet, consider it 0%
      if (habitLogEntries.length === 0) return 0;
      
      // For simplicity, just count the percentage of days with log entries
      // This could be improved with more sophisticated streak calculations
      const totalDays = Math.max(1, Math.floor((Date.now() - habit.startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const daysCompleted = new Set(habitLogEntries.map(log => 
        new Date(log.date).toDateString()
      )).size;
      
      return Math.min(100, (daysCompleted / totalDays) * 100);
    });
    
    habitCompletionPercentage = habitPercentages.reduce((sum, val) => sum + val, 0) / goalHabits.length;
  }
  
  // Calculate overall progress - weighted average
  // Give more weight to milestones and plans as they are higher-level items
  const progressPercentage = goal.status === 'completed' 
    ? 100 
    : goal.status === 'abandoned' 
      ? 0
      : Math.round(
          (
            taskCompletionPercentage * 1 + 
            milestoneCompletionPercentage * 2 + 
            planCompletionPercentage * 2 +
            actionCompletionPercentage * 1.5 +
            habitCompletionPercentage * 1.5
          ) / (
            (goalTasks.length > 0 ? 1 : 0) + 
            (goalMilestones.length > 0 ? 2 : 0) + 
            (goalPlans.length > 0 ? 2 : 0) +
            (goalActions.length > 0 ? 1.5 : 0) +
            (goalHabits.length > 0 ? 1.5 : 0) || 1 // Avoid division by zero
          )
        );
  
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
        
        <div className="grid grid-cols-3 gap-4 mt-6 text-xs">
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center text-purple-600">
                  <CalendarCheck className="h-3.5 w-3.5 mr-1.5" />
                  Milestones
                </span>
                <span>{Math.round(milestoneCompletionPercentage)}%</span>
              </div>
              <Progress value={milestoneCompletionPercentage} className="h-1.5" 
                indicatorClassName="bg-purple-500" />
              <div className="flex items-center mt-1 justify-end">
                <span className="font-medium">{completedMilestones}</span>
                <span className="text-muted-foreground ml-1">/ {goalMilestones.length}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center text-blue-600">
                  <Target className="h-3.5 w-3.5 mr-1.5" />
                  Plans
                </span>
                <span>{Math.round(planCompletionPercentage)}%</span>
              </div>
              <Progress value={planCompletionPercentage} className="h-1.5" 
                indicatorClassName="bg-blue-500" />
              <div className="flex items-center mt-1 justify-end">
                <span className="font-medium">{completedPlans}</span>
                <span className="text-muted-foreground ml-1">/ {goalPlans.length}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center text-yellow-600">
                  <ListChecks className="h-3.5 w-3.5 mr-1.5" />
                  Tasks
                </span>
                <span>{Math.round(taskCompletionPercentage)}%</span>
              </div>
              <Progress value={taskCompletionPercentage} className="h-1.5" 
                indicatorClassName="bg-yellow-500" />
              <div className="flex items-center mt-1 justify-end">
                <span className="font-medium">{completedTasks}</span>
                <span className="text-muted-foreground ml-1">/ {goalTasks.length}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center text-red-600">
                  <ListChecks className="h-3.5 w-3.5 mr-1.5" />
                  Actions
                </span>
                <span>{Math.round(actionCompletionPercentage)}%</span>
              </div>
              <Progress value={actionCompletionPercentage} className="h-1.5" 
                indicatorClassName="bg-red-500" />
              <div className="flex items-center mt-1 justify-end">
                <span className="font-medium">{completedActions}</span>
                <span className="text-muted-foreground ml-1">/ {goalActions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center text-green-600">
                <Repeat className="h-3.5 w-3.5 mr-1.5" />
                Habits
              </span>
              <span>{Math.round(habitCompletionPercentage)}%</span>
            </div>
            <Progress value={habitCompletionPercentage} className="h-1.5" 
              indicatorClassName="bg-green-500" />
            <div className="flex items-center mt-1 justify-end">
              <span className="font-medium">{goalHabits.length}</span>
              <span className="text-muted-foreground ml-1">habits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;
