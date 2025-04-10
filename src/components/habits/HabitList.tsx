
import React from 'react';
import { Habit } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import HabitCard from './HabitCard';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HabitListProps {
  habits: Habit[];
  selectedHabitId: string | null;
  onSelectHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

const HabitList: React.FC<HabitListProps> = ({ 
  habits, 
  selectedHabitId, 
  onSelectHabit,
  onAddHabit 
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

  if (habits.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
        <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No habits yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new habit to track</p>
        <div className="mt-6">
          <Button onClick={onAddHabit}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedHabits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onClick={() => onSelectHabit(habit.id)}
          isSelected={selectedHabitId === habit.id}
        />
      ))}
    </div>
  );
};

export default HabitList;
