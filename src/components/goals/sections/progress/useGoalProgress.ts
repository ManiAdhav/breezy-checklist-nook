
import { GoalStatus, Goals } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/hooks/useGoalContext';
import { useHabit } from '@/contexts/HabitContext';

export const useGoalProgress = (goal: Goals) => {
  const { tasks } = useTask();
  const { ninetyDayTargets } = useGoal();
  const { habits, habitLogs } = useHabit();
  
  // Find all tasks, milestones, and plans associated with this goal
  const goalTasks = tasks.filter(task => task.goalId === goal.id);
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goal.id);
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
  // Give more weight to milestones as they are higher-level items
  const progressPercentage = goal.status === 'completed' 
    ? 100 
    : goal.status === 'abandoned' 
      ? 0
      : Math.round(
          (
            taskCompletionPercentage * 1 + 
            milestoneCompletionPercentage * 2 + 
            actionCompletionPercentage * 1.5 +
            habitCompletionPercentage * 1.5
          ) / (
            (goalTasks.length > 0 ? 1 : 0) + 
            (goalMilestones.length > 0 ? 2 : 0) +
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
  
  return {
    goalTasks,
    goalMilestones,
    goalHabits,
    goalActions,
    completedTasks,
    completedMilestones,
    completedActions,
    taskCompletionPercentage,
    milestoneCompletionPercentage,
    actionCompletionPercentage,
    habitCompletionPercentage,
    progressPercentage,
    getStatusColor,
    getStatusLabel
  };
};
