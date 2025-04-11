
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HabitList from './HabitList';
import AddHabitDialog from './AddHabitDialog';
import { useHabit } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import HabitDetail from './HabitDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

const HabitTracker: React.FC = () => {
  const { habits, isLoading } = useHabit();
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  useEffect(() => {
    // Set filtered habits when habits change
    if (habits) {
      console.log('HabitTracker: Setting filtered habits', habits);
      setFilteredHabits(habits);
      
      // If we have habits but none selected, select the first one
      if (habits.length > 0 && !selectedHabitId) {
        setSelectedHabitId(habits[0].id);
      } else if (habits.length === 0) {
        setSelectedHabitId(null);
      }
    }
  }, [habits, selectedHabitId]);

  useEffect(() => {
    // Log when component mounts to help with debugging
    console.log('HabitTracker mounted, habits count:', habits.length);
    
    if (habits.length > 0) {
      toast({
        title: "Habits loaded",
        description: `${habits.length} habits loaded successfully`,
      });
    }
    
    return () => {
      console.log('HabitTracker unmounted');
    };
  }, []);

  const handleSelectHabit = (habitId: string) => {
    setSelectedHabitId(habitId);
    setIsDetailOpen(true);
  };

  const selectedHabit = selectedHabitId 
    ? habits.find(h => h.id === selectedHabitId) || null
    : null;

  console.log('HabitTracker rendering, habits count:', habits.length);

  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Habits</h1>
          <p className="text-muted-foreground">Track your daily habits and build consistency</p>
        </div>
        <Button onClick={() => setIsAddHabitOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <HabitList 
          habits={filteredHabits} 
          selectedHabitId={selectedHabitId}
          onSelectHabit={handleSelectHabit}
          onAddHabit={() => setIsAddHabitOpen(true)}
        />
      )}
      
      <AddHabitDialog
        open={isAddHabitOpen}
        onOpenChange={setIsAddHabitOpen}
      />
      
      <HabitDetail
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        habit={selectedHabit}
      />
    </div>
  );
};

export default HabitTracker;
