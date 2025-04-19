
import { useState } from 'react';
import { useGoal } from '@/hooks/useGoalContext';
import { useTask } from '@/contexts/TaskContext';
import { useHabit } from '@/contexts/HabitContext';

export const useGoalDetailView = (goalId: string) => {
  const { threeYearGoals, ninetyDayTargets, plans } = useGoal();
  const { tasks } = useTask();
  const { habits } = useHabit();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  // Count associated items
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goalId);
  const milestoneCount = goalMilestones.length;
  
  const goalPlans = plans.filter(plan => 
    goalMilestones.some(milestone => milestone.id === plan.ninetyDayTargetId)
  );
  const planCount = goalPlans.length;
  
  const goalTasks = tasks.filter(task => task.goalId === goalId);
  const taskCount = goalTasks.length;
  
  const goalActions = tasks.filter(task => task.isAction && task.goalId === goalId);
  const actionCount = goalActions.length;
  
  const goalHabits = habits.filter(habit => habit.goalId === goalId);
  const habitCount = goalHabits.length;
  
  const handleTabChange = (value: string) => {
    if (value === activeTab) {
      setActiveTab("overview");
    } else {
      setActiveTab(value);
    }
  };

  return {
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
  };
};
