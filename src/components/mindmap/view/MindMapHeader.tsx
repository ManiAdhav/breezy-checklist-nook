
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MindMapHeaderProps {
  onAddGoal: () => void;
}

const MindMapHeader: React.FC<MindMapHeaderProps> = ({ onAddGoal }) => {
  return (
    <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background z-10">
      <div>
        <h2 className="text-2xl font-semibold">Mind Map</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize your goals and their connections
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={onAddGoal}
          className="flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          <span>Add Goal</span>
        </Button>
      </div>
    </div>
  );
};

export default MindMapHeader;
