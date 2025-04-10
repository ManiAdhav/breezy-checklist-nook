
import React from 'react';
import { Habit } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import HabitCard from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  selectedHabitId: string | null;
  onSelectHabit: (habitId: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ 
  habits, 
  selectedHabitId, 
  onSelectHabit 
}) => {
  const { getHabitStreak } = useHabit();

  // Sort habits by streak (descending) and then by name
  const sortedHabits = [...habits].sort((a, b) => {
    const streakA = getHabitStreak(a.id).current;
    const streakB = getHabitStreak(b.id).current;
    
    if (streakA !== streakB) {
      return streakB - streakA; // Sort by streak (descending)
    }
    
    return a.name.localeCompare(b.name); // Then by name
  });

  return (
    <div className="space-y-3">
      {sortedHabits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isSelected={selectedHabitId === habit.id}
          onClick={() => onSelectHabit(habit.id)}
        />
      ))}
    </div>
  );
};

export default HabitList;
