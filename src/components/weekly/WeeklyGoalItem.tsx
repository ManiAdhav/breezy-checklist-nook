
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface WeeklyGoalItemProps {
  onView: () => void;
}

const WeeklyGoalItem: React.FC<WeeklyGoalItemProps> = ({ onView }) => {
  return (
    <div className="p-3 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">The Weekly Plans feature has been removed.</p>
        <Button variant="ghost" size="sm" onClick={onView}>
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
      </div>
    </div>
  );
};

export default WeeklyGoalItem;
