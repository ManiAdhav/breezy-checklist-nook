
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
  const { habits, isLoading, loadHabits } = useHabit();
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Load habits when component mounts
  useEffect(() => {
    console.log('HabitTracker: Initial load of habits data');
    
    const initialLoad = async () => {
      try {
        await loadHabits();
        console.log('HabitTracker: Initial habits load complete');
        setInitialLoadDone(true);
      } catch (err) {
        console.error('Error loading habits in HabitTracker:', err);
        toast({
          title: "Error loading habits",
          description: "Failed to load habits data. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    initialLoad();
    
    return () => {
      console.log('HabitTracker unmounted');
    };
  }, [loadHabits]);
  
  // Update filtered habits when habits array changes
  useEffect(() => {
    if (habits) {
      console.log('HabitTracker: Setting filtered habits', habits.length);
      setFilteredHabits(habits);
      
      // Only set the selected habit on initial load if none is selected
      if (habits.length > 0 && !selectedHabitId && !isDetailOpen) {
        setSelectedHabitId(habits[0].id);
      } else if (habits.length === 0) {
        setSelectedHabitId(null);
      }
    }
  }, [habits, selectedHabitId, isDetailOpen]);

  const handleSelectHabit = (habitId: string) => {
    if (selectedHabitId === habitId) {
      // If the same habit is clicked, just toggle the detail view
      setIsDetailOpen(!isDetailOpen);
    } else {
      // If a different habit is clicked, select it and open detail view
      setSelectedHabitId(habitId);
      setIsDetailOpen(true);
    }
  };
  
  const handleAddHabitSuccess = async () => {
    setIsAddHabitOpen(false);
    // Reload habits after adding a new one
    console.log('HabitTracker: Habit added, reloading habits');
    await loadHabits();
    
    toast({
      title: "Success",
      description: "Habit added successfully",
    });
  };

  // Only find the selected habit when needed
  const selectedHabit = isDetailOpen && selectedHabitId
    ? habits.find(h => h.id === selectedHabitId) || null
    : null;

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
      ) : habits.length === 0 && initialLoadDone ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No habits created yet</h3>
          <p className="text-muted-foreground mb-4">Start tracking your habits to build consistency</p>
          <Button onClick={() => setIsAddHabitOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Habit
          </Button>
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
        onSuccess={handleAddHabitSuccess}
      />
      
      {selectedHabit && (
        <HabitDetail
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          habit={selectedHabit}
        />
      )}
    </div>
  );
};

export default HabitTracker;
