
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGoal } from '@/contexts/GoalContext';
import { Habit } from '@/types/habit';
import { useHabitForm } from './form/useHabitForm';
import HabitFormContent from './form/HabitFormContent';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit;
}

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange, 
  editHabit 
}) => {
  // Get the goals context
  const { threeYearGoals } = useGoal();
  
  // Use our custom hook to handle form state and logic
  const formState = useHabitForm(open, onOpenChange, editHabit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
        </DialogHeader>
        
        <HabitFormContent
          editHabit={editHabit}
          goals={threeYearGoals || []}
          {...formState}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
