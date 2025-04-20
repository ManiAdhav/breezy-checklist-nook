
import { useState, useEffect } from 'react';
import { useGoal } from '@/hooks/useGoalContext';
import { useTask } from '@/contexts/TaskContext';
import { useHabit } from '@/contexts/HabitContext';

export const useGoalDetail = (goalId: string) => {
  const { threeYearGoals, ninetyDayTargets } = useGoal();
  const { tasks } = useTask();
  const { habits } = useHabit();
  
  // State for tabs and dialogs
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  // Count associated items
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goalId);
  const milestoneCount = goalMilestones.length;
  
  const goalTasks = tasks.filter(task => task.goalId === goalId);
  const taskCount = goalTasks.length;
  
  const goalActions = tasks.filter(task => task.isAction && task.goalId === goalId);
  const actionCount = goalActions.length;
  
  // Filter habits associated with this goal
  const goalHabits = habits.filter(habit => habit.goalId === goalId);
  const habitCount = goalHabits.length;
  
  // When active tab is clicked again, default to overview
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
    taskCount,
    actionCount,
    habitCount,
    handleTabChange
  };
};
