
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
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  
  // Load habits when component mounts
  useEffect(() => {
    const loadHabitsData = async () => {
      console.log('HabitTracker - Initial load');
      
      if (hasAttemptedLoad) {
        console.log('Already attempted to load habits, skipping');
        return;
      }
      
      setHasAttemptedLoad(true);
      
      try {
        console.log('HabitTracker - Calling loadHabits()');
        await loadHabits();
        console.log('HabitTracker - Habits loaded successfully, count:', habits.length);
      } catch (err) {
        console.error('Error loading habits in HabitTracker:', err);
        toast({
          title: "Error loading habits",
          description: "Failed to load habits data. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    loadHabitsData();
  }, [loadHabits, hasAttemptedLoad]);
  
  // Log whenever habits change
  useEffect(() => {
    console.log('HabitTracker - Habits changed, new count:', habits.length);
  }, [habits]);
  
  // Prepare habits with streak data for display using useMemo
  const preparedHabits = useMemo(() => {
    console.log('HabitTracker - Preparing habits for display', habits.length);
    if (habits.length === 0) {
      console.log('No habits found to prepare');
      return [];
    }
    
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
  
  // Find the selected habit object
  const selectedHabit = useMemo(() => {
    if (!selectedHabitId) return null;
    return habits.find(h => h.id === selectedHabitId) || null;
  }, [selectedHabitId, habits]);
  
  // Callbacks for habit actions
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
      // Clear selected habit on dialog close
      setSelectedHabitId(null);
    }
  }, []);

  const handleAddHabitDialogOpenChange = useCallback((open: boolean) => {
    setIsAddHabitOpen(open);
  }, []);

  const handleAddHabitSuccess = useCallback(async () => {
    setIsAddHabitOpen(false);
    
    // After adding a habit, reload habits to ensure the list is up-to-date
    console.log("New habit added, refreshing habits list");
    await loadHabits();
    
    toast({
      title: "Success",
      description: "Habit added successfully",
    });
  }, [loadHabits]);

  const actualIsLoading = isLoading || (!hasAttemptedLoad);
  
  console.log('HabitTracker - Rendering with', preparedHabits.length, 'habits, loading:', actualIsLoading);

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
      
      {actualIsLoading ? (
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
