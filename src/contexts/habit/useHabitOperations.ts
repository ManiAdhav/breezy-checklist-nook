
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitLog } from '@/types/habit';

export const useHabitOperations = (
  habits: Habit[], 
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
  habitLogs: HabitLog[],
  setHabitLogs: React.Dispatch<React.SetStateAction<HabitLog[]>>
) => {
  const getHabitById = (id: string) => {
    return habits.find(habit => habit.id === id);
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setHabits(prevHabits => [...prevHabits, newHabit]);
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id 
          ? { ...habit, ...updates, updatedAt: new Date() } 
          : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
    setHabitLogs(prevLogs => prevLogs.filter(log => log.habitId !== id));
  };

  const logProgress = (log: Omit<HabitLog, 'id'>) => {
    const newLog: HabitLog = {
      ...log,
      id: uuidv4(),
    };
    
    setHabitLogs(prevLogs => [...prevLogs, newLog]);
  };

  const getHabitLogs = (habitId: string) => {
    return habitLogs
      .filter(log => log.habitId === habitId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  return {
    getHabitById,
    addHabit,
    updateHabit,
    deleteHabit,
    logProgress,
    getHabitLogs
  };
};
