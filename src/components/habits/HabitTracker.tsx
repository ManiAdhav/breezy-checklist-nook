
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  
  // Reference to track if the component is mounted
  const isMounted = useRef(true);
  
  // Load habits only once when component mounts
  useEffect(() => {
    console.log('HabitTracker: Initial load of habits data');
    
    const initialLoad = async () => {
      try {
        await loadHabits();
        if (isMounted.current) {
          console.log('HabitTracker: Initial habits load complete');
          setInitialLoadDone(true);
        }
      } catch (err) {
        console.error('Error loading habits in HabitTracker:', err);
        if (isMounted.current) {
          toast({
            title: "Error loading habits",
            description: "Failed to load habits data. Please refresh the page.",
            variant: "destructive"
          });
        }
      }
    };
    
    initialLoad();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
      console.log('HabitTracker unmounted');
    };
  }, [loadHabits]);
  
  // Memoize the sorted habits to prevent unnecessary recalculations
  const sortedHabits = useMemo(() => {
    if (!habits || habits.length === 0) return [];
    console.log('HabitTracker: Creating sorted habits list', habits.length);
    // Create a new array to avoid modifying the original
    return [...habits];
  }, [habits]);
  
  // Set filtered habits only when sorted habits change and component is mounted
  useEffect(() => {
    if (sortedHabits.length > 0 && isMounted.current) {
      console.log('HabitTracker: Setting filtered habits', sortedHabits.length);
      setFilteredHabits(sortedHabits);
      
      // Only set the selected habit on initial load if none is selected
      if (initialLoadDone && sortedHabits.length > 0 && !selectedHabitId && !isDetailOpen) {
        setSelectedHabitId(sortedHabits[0].id);
      } else if (sortedHabits.length === 0) {
        setSelectedHabitId(null);
      }
    }
  }, [sortedHabits, selectedHabitId, isDetailOpen, initialLoadDone]);

  // Strictly memoize all handler functions
  const handleSelectHabit = useCallback((habitId: string) => {
    setSelectedHabitId(previousId => {
      if (previousId === habitId) {
        // If the same habit is clicked, just toggle the detail view
        setIsDetailOpen(prev => !prev);
        return previousId;
      } else {
        // If a different habit is clicked, select it and open detail view
        setIsDetailOpen(true);
        return habitId;
      }
    });
  }, []);
  
  const handleAddHabitSuccess = useCallback(async () => {
    setIsAddHabitOpen(false);
    // Reload habits after adding a new one
    console.log('HabitTracker: Habit added, reloading habits');
    await loadHabits();
    
    toast({
      title: "Success",
      description: "Habit added successfully",
    });
  }, [loadHabits]);

  // Find the selected habit only when needed, and memoize the result
  const selectedHabit = useMemo(() => {
    if (!isDetailOpen || !selectedHabitId || !habits.length) return null;
    return habits.find(h => h.id === selectedHabitId) || null;
  }, [habits, selectedHabitId, isDetailOpen]);

  // Memoize the dialog open state change handler
  const handleDetailOpenChange = useCallback((open: boolean) => {
    setIsDetailOpen(open);
  }, []);

  // Memoize the add habit dialog handler
  const handleAddHabitClick = useCallback(() => {
    setIsAddHabitOpen(true);
  }, []);

  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Habits</h1>
          <p className="text-muted-foreground">Track your daily habits and build consistency</p>
        </div>
        <Button onClick={handleAddHabitClick}>
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
          <Button onClick={handleAddHabitClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Habit
          </Button>
        </div>
      ) : (
        <HabitList 
          habits={filteredHabits} 
          selectedHabitId={selectedHabitId}
          onSelectHabit={handleSelectHabit}
          onAddHabit={handleAddHabitClick}
        />
      )}
      
      <AddHabitDialog
        open={isAddHabitOpen}
        onOpenChange={setIsAddHabitOpen}
        onSuccess={handleAddHabitSuccess}
      />
      
      {selectedHabit && (
        <HabitDetail
          key={`habit-detail-${selectedHabit.id}`}
          open={isDetailOpen}
          onOpenChange={handleDetailOpenChange}
          habit={selectedHabit}
        />
      )}
    </div>
  );
};

export default React.memo(HabitTracker);
