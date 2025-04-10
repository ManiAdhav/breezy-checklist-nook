
import { HabitLog, HabitStreak } from '@/types/habit';

export const useStreakCalculation = () => {
  const calculateHabitStreak = (logs: HabitLog[], habitId: string): HabitStreak => {
    if (logs.length === 0) {
      return { current: 0, longest: 0 };
    }
    
    // Sort logs by date in ascending order
    const habitLogs = logs.filter(log => log.habitId === habitId);
    const sortedLogs = [...habitLogs].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Initialize variables
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;
    
    // Calculate streak
    sortedLogs.forEach(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        // First log
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const dayDiff = Math.floor((logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (dayDiff > 1) {
          // Break in streak
          currentStreak = 1;
        }
      }
      
      lastDate = logDate;
    });
    
    // Check if the streak is current (last log is from today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastLogDate = habitLogs[0]?.date;
    if (lastLogDate) {
      const lastLogDay = new Date(lastLogDate);
      lastLogDay.setHours(0, 0, 0, 0);
      
      const daysSinceLastLog = Math.floor((today.getTime() - lastLogDay.getTime()) / (1000 * 60 * 60 * 24));
      
      // If the last log is older than yesterday, reset current streak
      if (daysSinceLastLog > 1) {
        currentStreak = 0;
      }
    }
    
    return {
      current: currentStreak,
      longest: longestStreak,
      lastLoggedDate: habitLogs[0]?.date
    };
  };

  return { calculateHabitStreak };
};
