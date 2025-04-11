
import { HabitLog, HabitStreak } from '@/types/habit';

export const useStreakCalculation = () => {
  const calculateHabitStreak = (habitLogs: HabitLog[], habitId: string): HabitStreak => {
    // Filter logs for this habit and sort by date (oldest first)
    const logsForHabit = habitLogs
      .filter(log => log.habitId === habitId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (logsForHabit.length === 0) {
      return { current: 0, longest: 0 };
    }
    
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;
    
    // Calculate streak based on consecutive days
    logsForHabit.forEach(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        // First log
        currentStreak = 1;
        lastDate = logDate;
      } else {
        const lastDay = new Date(lastDate);
        lastDay.setDate(lastDay.getDate() + 1);
        lastDay.setHours(0, 0, 0, 0);
        
        if (logDate.getTime() === lastDay.getTime()) {
          // Consecutive day
          currentStreak += 1;
          lastDate = logDate;
        } else if (logDate.getTime() > lastDay.getTime()) {
          // Gap detected, reset streak
          currentStreak = 1;
          lastDate = logDate;
        }
        // If date is the same or earlier, ignore duplicate logs
      }
      
      // Update longest streak if current is greater
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    });
    
    // Check if current streak is still active (last log within last day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If the last logged date is before yesterday, the streak is broken
    if (lastDate && lastDate.getTime() < yesterday.getTime()) {
      currentStreak = 0;
    }
    
    return {
      current: currentStreak,
      longest: longestStreak,
      lastLoggedDate: logsForHabit.length > 0 ? logsForHabit[logsForHabit.length - 1].date : undefined
    };
  };
  
  return { calculateHabitStreak };
};
