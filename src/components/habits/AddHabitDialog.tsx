
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGoal } from '@/contexts/GoalContext';
import { Habit } from '@/types/habit';
import { useHabitForm } from './form/useHabitForm';
import HabitFormContent from './form/HabitFormContent';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit;
  onSuccess?: () => void;
}

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange, 
  editHabit,
  onSuccess 
}) => {
  // Get the goals context
  const { threeYearGoals } = useGoal();
  
  // Use our custom hook to handle form state and logic
  const formState = useHabitForm(open, onOpenChange, editHabit, onSuccess);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle>
            {editHabit ? 'Edit Habit' : 'New Habit'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted/40"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <HabitFormContent
          form={formState.form}
          editHabit={editHabit}
          goals={threeYearGoals || []}
          selectedIcon={formState.selectedIcon}
          setSelectedIcon={formState.setSelectedIcon}
          showIconSelector={formState.showIconSelector}
          toggleIconSelector={formState.toggleIconSelector}
          selectedDays={formState.selectedDays}
          toggleDaySelection={formState.toggleDaySelection}
          timeOfDay={formState.timeOfDay}
          setTimeOfDay={formState.setTimeOfDay}
          reminders={formState.reminders}
          setReminders={formState.setReminders}
          showDatePicker={formState.showDatePicker}
          setShowDatePicker={formState.setShowDatePicker}
          onSubmit={formState.onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
