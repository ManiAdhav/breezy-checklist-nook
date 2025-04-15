
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HabitList from './HabitList';
import AddHabitDialog from './AddHabitDialog';
import { useHabit } from '@/contexts/HabitContext';
import HabitDetail from './HabitDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

const HabitTracker: React.FC = () => {
  const { habits, isLoading, loadHabits, getHabitStreak } = useHabit();
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Load habits only once when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadHabits();
      } catch (err) {
        toast({
          title: "Error loading habits",
          description: "Failed to load habits data. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [loadHabits]);
  
  // Prepare habits with streak data for display
  const preparedHabits = habits.map(habit => ({
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
  
  // Find the selected habit object
  const selectedHabit = selectedHabitId 
    ? habits.find(h => h.id === selectedHabitId) 
    : null;
  
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
        onOpenChange={setIsAddHabitOpen}
        onSuccess={async () => {
          setIsAddHabitOpen(false);
          await loadHabits();
          toast({
            title: "Success",
            description: "Habit added successfully",
          });
        }}
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

export default HabitTracker;
