
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGoal } from '@/contexts/GoalContext';
import { Habit } from '@/types/habit';
import { useHabitForm } from './form/useHabitForm';
import HabitFormContent from './form/HabitFormContent';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-lg border-0 shadow-md">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/5">
          <div className="px-5 py-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground/90">
              {editHabit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-muted/40"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        
        <div className="px-5 py-4 max-h-[80vh] overflow-y-auto">
          <HabitFormContent
            editHabit={editHabit}
            goals={threeYearGoals || []}
            {...formState}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
