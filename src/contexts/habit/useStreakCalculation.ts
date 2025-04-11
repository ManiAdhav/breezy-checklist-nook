
import { HabitLog, HabitStreak } from '@/types/habit';

export const useStreakCalculation = () => {
  // Helper to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Helper to check if a date is yesterday relative to another date
  const isYesterday = (date: Date, relativeTo: Date): boolean => {
    const yesterday = new Date(relativeTo);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
  };

  const calculateHabitStreak = (habitLogs: HabitLog[], habitId: string): HabitStreak => {
    // Filter logs for this habit and sort by date (newest first)
    const logsForHabit = habitLogs
      .filter(log => log.habitId === habitId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Calculating streak for habit ${habitId}, found ${logsForHabit.length} logs`, logsForHabit);
    
    if (logsForHabit.length === 0) {
      return { current: 0, longest: 0 };
    }
    
    // Get today and yesterday dates for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    // Check if the most recent log is from today or yesterday
    const mostRecentLog = new Date(logsForHabit[0].date);
    mostRecentLog.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    // Only continue calculating streak if the most recent log is from today or yesterday
    const streakIsActive = isSameDay(mostRecentLog, today) || isSameDay(mostRecentLog, yesterday);
    
    if (streakIsActive) {
      // Create a set of log dates for faster lookup
      const logDatesSet = new Set();
      
      // Group logs by date (to handle multiple logs on the same day)
      const uniqueDates: Date[] = [];
      const dateMap = new Map<string, Date>();
      
      logsForHabit.forEach(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        const dateString = logDate.toISOString().split('T')[0];
        
        if (!dateMap.has(dateString)) {
          dateMap.set(dateString, logDate);
          uniqueDates.push(logDate);
          logDatesSet.add(dateString);
        }
      });
      
      // Sort unique dates in descending order (newest first)
      uniqueDates.sort((a, b) => b.getTime() - a.getTime());
      
      // Calculate the current streak
      currentStreak = 1; // Start with 1 for the most recent day
      
      // Start from yesterday relative to the most recent log
      let checkDate = new Date(uniqueDates[0]);
      checkDate.setDate(checkDate.getDate() - 1);
      
      // Check each previous day
      while (true) {
        const dateString = checkDate.toISOString().split('T')[0];
        
        if (logDatesSet.has(dateString)) {
          currentStreak++;
        } else {
          break; // Break the streak
        }
        
        // Move to the previous day
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      // Calculate longest streak
      longestStreak = currentStreak;
      let tempStreak = 0;
      
      // Reset check date to oldest log and move forward
      uniqueDates.reverse(); // Now oldest first
      
      for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
          continue;
        }
        
        const prevDate = new Date(uniqueDates[i-1]);
        prevDate.setDate(prevDate.getDate() + 1);
        
        if (isSameDay(prevDate, uniqueDates[i]) || isYesterday(uniqueDates[i-1], uniqueDates[i])) {
          tempStreak++;
        } else {
          tempStreak = 1; // Reset streak
        }
        
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      }
    }
    
    console.log(`Streak calculation result for habit ${habitId}: current=${currentStreak}, longest=${longestStreak}`);
    
    return {
      current: currentStreak,
      longest: longestStreak,
      lastLoggedDate: logsForHabit.length > 0 ? logsForHabit[0].date : undefined
    };
  };
  
  return { calculateHabitStreak };
};
