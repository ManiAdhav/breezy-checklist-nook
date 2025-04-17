
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Repeat } from 'lucide-react';

interface EmptyHabitStateProps {
  onAddHabit: () => void;
}

const EmptyHabitState: React.FC<EmptyHabitStateProps> = ({ onAddHabit }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
      <Repeat className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
      <p className="text-muted-foreground mb-2">No habits yet</p>
      <Button variant="outline" size="sm" onClick={onAddHabit}>
        <Plus className="h-4 w-4 mr-1" />
        Add Your First Habit
      </Button>
    </div>
  );
};

export default EmptyHabitState;
