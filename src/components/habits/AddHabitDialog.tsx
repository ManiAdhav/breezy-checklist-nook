
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl border border-border/40 shadow-lg">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/20">
          <DialogHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-medium">
                {editHabit ? 'Edit Habit' : 'New Habit'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
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
