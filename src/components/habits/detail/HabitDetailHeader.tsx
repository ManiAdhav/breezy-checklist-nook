
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, X } from 'lucide-react';

interface HabitDetailHeaderProps {
  habitName: string;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitDetailHeader: React.FC<HabitDetailHeaderProps> = ({ 
  habitName, 
  onEdit, 
  onDelete 
}) => {
  return (
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle>{habitName}</DialogTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};

export default HabitDetailHeader;
