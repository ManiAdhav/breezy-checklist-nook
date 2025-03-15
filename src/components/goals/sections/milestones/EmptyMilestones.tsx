
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyMilestonesProps {
  onAddMilestone: () => void;
}

const EmptyMilestones: React.FC<EmptyMilestonesProps> = ({ onAddMilestone }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
      <p className="text-muted-foreground mb-2">No milestones yet</p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onAddMilestone}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Your First Milestone
      </Button>
    </div>
  );
};

export default EmptyMilestones;
