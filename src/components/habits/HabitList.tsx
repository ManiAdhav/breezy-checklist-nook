
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
        <div 
          key={habit.id}
          onClick={() => onSelectHabit(habit.id)}
          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedHabitId === habit.id ? 'ring-2 ring-primary shadow-md' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{habit.name}</h3>
              <p className="text-sm text-gray-500">{habit.metric}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold">{habit.streak || 0}</div>
              <div className="text-xs text-gray-500">day streak</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;
