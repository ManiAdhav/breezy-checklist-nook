
import React, { useState, useCallback } from 'react';
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

const HabitDetail: React.FC<HabitDetailProps> = ({ open, onOpenChange, habit }) => {
  const { updateHabit, deleteHabit } = useHabit();
  const { threeYearGoals } = useGoal();
  const [isEditMode, setIsEditMode] = useState(false);
  
  if (!habit) return null;
  
  // Memoize the handler to avoid recreating on every render
  const handleAddLog = useCallback((newLog: HabitLog) => {
    const updatedLogs = [...(habit.logs || []), newLog];
    
    // Calculate new streak
    let streak = habit.streak || 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = newLog.date.toDateString() === today.toDateString();
    const isYesterday = newLog.date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      // Log for today - increment streak if there was a log yesterday
      const hasYesterdayLog = habit.logs?.some(
        log => new Date(log.date).toDateString() === yesterday.toDateString()
      );
      if (hasYesterdayLog) {
        streak += 1;
      } else {
        streak = 1; // Reset streak to 1 if today but no yesterday log
      }
    } else if (isYesterday) {
      // Log for yesterday - set streak to 1 if there wasn't already a streak
      if (streak === 0) {
        streak = 1;
      }
    }
    
    // Update the habit with new logs and streak
    updateHabit(habit.id, { 
      logs: updatedLogs,
      streak
    });
  }, [habit, updateHabit]);
  
  const handleDeleteHabit = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id);
      onOpenChange(false);
    }
  }, [habit.id, deleteHabit, onOpenChange]);
  
  // Get associated goal if any
  const associatedGoal = habit.goalId 
    ? threeYearGoals?.find(goal => goal.id === habit.goalId)
    : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <HabitDetailHeader 
            habitName={habit.name}
            onEdit={() => setIsEditMode(true)}
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
          onOpenChange={setIsEditMode}
          editHabit={habit}
        />
      )}
    </>
  );
};

export default HabitDetail;
