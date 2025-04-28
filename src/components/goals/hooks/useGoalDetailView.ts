
import { useState, useEffect } from 'react';
import { useGoal } from '@/hooks/useGoalContext';
import { useTask } from '@/contexts/TaskContext';
import { useHabit } from '@/contexts/HabitContext';

export const useGoalDetailView = (goalId: string) => {
  const { threeYearGoals } = useGoal();
  const { tasks } = useTask();
  const { habits } = useHabit();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  const goalTasks = tasks.filter(task => task.goalId === goalId);
  const taskCount = goalTasks.length;
  
  const goalActions = tasks.filter(task => task.isAction && task.goalId === goalId);
  const actionCount = goalActions.length;
  
  const goalHabits = habits.filter(habit => habit.goalId === goalId);
  const habitCount = goalHabits.length;
  
  useEffect(() => {
    console.log(`Loading goal details for: ${goalId}`);
    console.log(`Found: ${goalTasks.length} tasks, ${goalHabits.length} habits`);
  }, [goalId, tasks, habits, goalTasks.length, goalHabits.length]);
  
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
    taskCount,
    actionCount,
    habitCount,
    handleTabChange
  };
};
