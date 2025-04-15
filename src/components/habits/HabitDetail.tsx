
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import { Habit, HabitLog } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import { useGoal } from '@/contexts/GoalContext';
import AddHabitDialog from './AddHabitDialog';
import HabitLogList from './HabitLogList';
import HabitDetailHeader from './detail/HabitDetailHeader';
import HabitInfoCard from './detail/HabitInfoCard';
import HabitLogForm from './detail/HabitLogForm';

interface HabitDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
}

function HabitDetail({ open, onOpenChange, habit }: HabitDetailProps) {
  const { updateHabit, deleteHabit } = useHabit();
  const { threeYearGoals } = useGoal();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // If no habit is provided, render nothing
  if (!habit) return null;
  
  // Memoize the associated goal to prevent unnecessary recalculations
  const associatedGoal = useMemo(() => {
    return habit.goalId 
      ? threeYearGoals?.find(goal => goal.id === habit.goalId)
      : null;
  }, [habit.goalId, threeYearGoals]);
  
  // Handler for adding logs
  const handleAddLog = useCallback((newLog: HabitLog) => {
    // Ensure we have logs array or default to empty array
    const updatedLogs = [...(habit.logs || []), newLog];
    
    // Update the habit with new logs
    updateHabit(habit.id, { 
      logs: updatedLogs
    });
  }, [habit, updateHabit]);
  
  // Handler for deleting habits
  const handleDeleteHabit = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id);
      onOpenChange(false);
    }
  }, [habit.id, deleteHabit, onOpenChange]);
  
  // Handler for edit mode
  const handleEditClick = useCallback(() => {
    setIsEditMode(true);
  }, []);
  
  // Handler for dialog open change
  const handleEditDialogOpenChange = useCallback((open: boolean) => {
    setIsEditMode(open);
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <HabitDetailHeader 
            habitName={habit.name}
            onEdit={handleEditClick}
            onDelete={handleDeleteHabit}
          />
          
          <div className="space-y-6 pt-4">
            {/* Habit Info */}
            <HabitInfoCard 
              habit={habit}
              associatedGoal={associatedGoal}
            />
            
            {/* Add new log */}
            <HabitLogForm 
              habit={habit}
              onAddLog={handleAddLog}
            />
            
            {/* Log history */}
            <div>
              <h3 className="text-sm font-medium mb-2">History</h3>
              <HabitLogList 
                logs={habit.logs || []}
                habitUnit={habit.metric}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {isEditMode && (
        <AddHabitDialog
          open={isEditMode}
          onOpenChange={handleEditDialogOpenChange}
          editHabit={habit}
        />
      )}
    </>
  );
}

// Use React.memo with custom comparison to prevent unnecessary re-renders
export default React.memo(HabitDetail, (prevProps, nextProps) => {
  // Only render if these specific props change
  if (prevProps.open !== nextProps.open) return false;
  if (!prevProps.habit && !nextProps.habit) return true;
  if (!prevProps.habit || !nextProps.habit) return false;
  
  // Deep comparison of habit properties that would affect rendering
  return (
    prevProps.habit.id === nextProps.habit.id &&
    prevProps.habit.name === nextProps.habit.name &&
    prevProps.habit.updatedAt === nextProps.habit.updatedAt &&
    JSON.stringify(prevProps.habit.logs || []) === JSON.stringify(nextProps.habit.logs || []) &&
    prevProps.onOpenChange === nextProps.onOpenChange
  );
});
