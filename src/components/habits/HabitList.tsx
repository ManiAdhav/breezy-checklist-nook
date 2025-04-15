
import React, { memo } from 'react';
import { Habit } from '@/types/habit';
import HabitCard from './HabitCard';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HabitListProps {
  habits: Array<Habit & { streak: number }>;
  selectedHabitId: string | null;
  onSelectHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

const HabitList = memo(({ 
  habits, 
  selectedHabitId, 
  onSelectHabit,
  onAddHabit 
}: HabitListProps) => {
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
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onClick={() => onSelectHabit(habit.id)}
          isSelected={selectedHabitId === habit.id}
        />
      ))}
      
      <div className="mt-6 text-center">
        <Button onClick={onAddHabit} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Habit
        </Button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  if (prevProps.selectedHabitId !== nextProps.selectedHabitId) return false;
  if (prevProps.habits.length !== nextProps.habits.length) return false;
  
  // Compare habit IDs to see if the array contents have changed
  const prevIds = prevProps.habits.map(h => h.id).sort().join(',');
  const nextIds = nextProps.habits.map(h => h.id).sort().join(',');
  
  return prevIds === nextIds;
});

HabitList.displayName = 'HabitList';

export default HabitList;
