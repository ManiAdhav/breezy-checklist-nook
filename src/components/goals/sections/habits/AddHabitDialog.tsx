
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AddHabitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBasicHabit: () => void;
}

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddBasicHabit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This is a simplified habit creation flow. Click the button below to create a basic daily habit.
          </p>
          <div className="flex items-center mt-4 p-4 bg-muted/30 rounded-md">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-xs text-muted-foreground">
              For a more detailed habit setup, please use the dedicated Habits page.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddBasicHabit}>
            Create Simple Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
