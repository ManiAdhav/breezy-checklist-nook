
import React from 'react';
import { Habit } from '@/types/habit';
import HabitCard from './HabitCard';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import isEqual from 'lodash.isequal';

interface HabitListProps {
  habits: Array<Habit & { streak: number }>;
  selectedHabitId: string | null;
  onSelectHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

function HabitList({ 
  habits, 
  selectedHabitId, 
  onSelectHabit,
  onAddHabit 
}: HabitListProps) {
  console.log('HabitList re-rendered'); // Debugging

  // Empty state
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

  // Render list of habits
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
}

// Optimize memo comparison to prevent unnecessary re-renders
export default React.memo(HabitList, (prevProps, nextProps) => {
  return (
    prevProps.selectedHabitId === nextProps.selectedHabitId &&
    isEqual(prevProps.habits, nextProps.habits)
  );
});
