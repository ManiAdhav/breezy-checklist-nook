
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface WeeklyGoalFormProps {
  onClose: () => void;
}

const WeeklyGoalForm: React.FC<WeeklyGoalFormProps> = ({ onClose }) => {
  return (
    <>
      <div className="py-4">
        <p className="text-center text-muted-foreground">
          The Weekly Plans feature has been removed.
          Please use Actions and Tasks instead to track your progress.
        </p>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );
};

export default WeeklyGoalForm;
