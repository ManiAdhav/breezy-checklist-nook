
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HabitList from './HabitList';
import AddHabitDialog from './AddHabitDialog';
import { useHabit } from '@/contexts/HabitContext';
import HabitDetail from './HabitDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

// Using React.memo to prevent unnecessary re-renders of the entire component
const HabitTracker: React.FC = () => {
  const { habits, isLoading, loadHabits, getHabitStreak } = useHabit();
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Create ref at component level
  const isFirstRender = React.useRef(true);
  
  // Load habits only once when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadHabits();
      } catch (err) {
        console.error('Error loading habits:', err);
        toast({
          title: "Error loading habits",
          description: "Failed to load habits data. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    // Using the ref to prevent the effect from running multiple times
    if (isFirstRender.current) {
      loadData();
      isFirstRender.current = false;
    }
  }, []); // Remove loadHabits from the dependency array to prevent re-runs
  
  // Prepare habits with streak data for display using useMemo
  const preparedHabits = useMemo(() => {
    // Avoid unnecessary recalculation by memoizing the result
    return habits.map(habit => ({
      ...habit,
      streak: getHabitStreak(habit.id).current
    })).sort((a, b) => {
      // Sort by streak (descending)
      if (a.streak !== b.streak) {
        return b.streak - a.streak;
      }
      // Then by name (ascending)
      return a.name.localeCompare(b.name);
    });
  }, [habits, getHabitStreak]);
  
  // Find the selected habit object - use useMemo to prevent unnecessary recalculations
  const selectedHabit = useMemo(() => {
    if (!selectedHabitId) return null;
    return habits.find(h => h.id === selectedHabitId) || null;
  }, [selectedHabitId, habits]);
  
  // Callbacks for habit actions - memoize all callbacks to prevent re-rendering
  const handleSelectHabit = useCallback((habitId: string) => {
    setSelectedHabitId(habitId);
    setIsDetailOpen(true);
  }, []);
  
  const handleAddHabitClick = useCallback(() => {
    setIsAddHabitOpen(true);
  }, []);
  
  const handleDetailOpenChange = useCallback((open: boolean) => {
    setIsDetailOpen(open);
    if (!open) {
      // Clear selected habit on dialog close to prevent stale state
      setSelectedHabitId(null);
    }
  }, []);

  const handleAddHabitDialogOpenChange = useCallback((open: boolean) => {
    setIsAddHabitOpen(open);
  }, []);

  const handleAddHabitSuccess = useCallback(() => {
    setIsAddHabitOpen(false);
    
    // Don't call loadHabits directly to avoid triggering a new render cycle
    // The HabitContext should manage this internally
    toast({
      title: "Success",
      description: "Habit added successfully",
    });
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
      ) : (
        <HabitList 
          habits={preparedHabits} 
          selectedHabitId={selectedHabitId}
          onSelectHabit={handleSelectHabit}
          onAddHabit={handleAddHabitClick}
        />
      )}
      
      <AddHabitDialog
        open={isAddHabitOpen}
        onOpenChange={handleAddHabitDialogOpenChange}
        onSuccess={handleAddHabitSuccess}
      />
      
      {selectedHabit && (
        <HabitDetail
          key={`habit-detail-${selectedHabitId}`}
          open={isDetailOpen}
          onOpenChange={handleDetailOpenChange}
          habit={selectedHabit}
        />
      )}
    </div>
  );
};

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
export default React.memo(HabitTracker, (prevProps, nextProps) => {
  // Since this component doesn't take any props, we can always return true
  return true;
});
