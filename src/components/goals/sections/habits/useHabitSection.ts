
import { useState } from 'react';
import { useHabit } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { toast } from '@/hooks/use-toast';

interface UseHabitSectionProps {
  goalId: string;
  limit?: number;
}

export const useHabitSection = ({ goalId, limit }: UseHabitSectionProps) => {
  const { habits, habitLogs, logProgress, getHabitStreak, addHabit } = useHabit();
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Filter habits for this goal
  const goalHabits = habits.filter(habit => habit.goalId === goalId);
  
  // Apply limit if specified
  const displayHabits = limit ? goalHabits.slice(0, limit) : goalHabits;
  const hasMoreHabits = limit && goalHabits.length > limit;
  
  const isCompletedToday = (habit: Habit) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return habitLogs.some(log => {
      const logDate = new Date(log.date).setHours(0, 0, 0, 0);
      return logDate === today && log.habitId === habit.id;
    });
  };
  
  const calculateProgress = (habit: Habit) => {
    // Calculate based on consistency - last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.setHours(0, 0, 0, 0);
    });
    
    const completedDays = last7Days.filter(day => 
      habitLogs.some(log => 
        log.habitId === habit.id && 
        new Date(log.date).setHours(0, 0, 0, 0) === day
      )
    ).length;
    
    return Math.round((completedDays / 7) * 100);
  };
  
  const toggleHabitCompletion = (habit: Habit) => {
    const completed = isCompletedToday(habit);
    
    if (completed) {
      // Remove today's log (simplified - in a real app, you'd want to delete the specific log)
      toast({
        title: "Cannot undo habit completion",
        description: "This feature is not implemented yet.",
        variant: "destructive"
      });
      return;
    }
    
    // Add a log for today
    logProgress({
      habitId: habit.id,
      date: new Date(),
      value: habit.metric === 'boolean' ? 1 : 1, // Convert boolean to number for consistency
      notes: ''
    });
    
    toast({
      title: "Habit logged for today",
      description: `You've completed "${habit.name}" for today!`,
    });
  };
  
  const handleAddHabit = () => {
    setIsAddHabitDialogOpen(true);
  };
  
  const handleViewHabitDetail = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsHabitDetailOpen(true);
  };
  
  const handleAddBasicHabit = () => {
    // This is a simplified version, in a real app you'd want to collect more information
    const newHabit = {
      name: "New Habit",
      description: "Track your new daily habit",
      frequency: "daily" as 'daily' | 'weekly' | 'monthly',
      metric: "boolean",
      target: 1,
      goalId: goalId,
      startDate: new Date(),
      icon: "activity",
      tags: [], 
      selectedDays: [], 
      timeOfDay: "", 
      reminders: []
    };
    
    addHabit(newHabit)
      .then(() => {
        setIsAddHabitDialogOpen(false);
        toast({
          title: "Habit created",
          description: "Your new habit has been created successfully.",
        });
      })
      .catch(error => {
        console.error("Error creating habit:", error);
        toast({
          title: "Error creating habit",
          description: "There was a problem creating your habit.",
          variant: "destructive"
        });
      });
  };

  return {
    goalHabits,
    displayHabits,
    hasMoreHabits,
    isAddHabitDialogOpen,
    setIsAddHabitDialogOpen,
    isHabitDetailOpen,
    setIsHabitDetailOpen,
    selectedHabit,
    isCompletedToday,
    calculateProgress,
    toggleHabitCompletion,
    handleAddHabit,
    handleViewHabitDetail,
    handleAddBasicHabit,
    getHabitStreak,
    habitLogs
  };
};
