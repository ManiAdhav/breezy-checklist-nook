
import React from 'react';
import { Button } from '@/components/ui/button';
import { ActivitySquare, Plus } from 'lucide-react';

interface EmptyHabitStateProps {
  onAddHabit: () => void;
}

const EmptyHabitState: React.FC<EmptyHabitStateProps> = ({ onAddHabit }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <ActivitySquare className="h-16 w-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold mb-2">No habits created yet</h2>
      <p className="text-gray-500 max-w-md mb-6">
        Start tracking your daily habits to build consistency and achieve your goals.
      </p>
      <Button onClick={onAddHabit} className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        Create Your First Habit
      </Button>
    </div>
  );
};

export default EmptyHabitState;
