
import React from 'react';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoalNotFoundProps {
  onBack: () => void;
}

const GoalNotFound: React.FC<GoalNotFoundProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Target className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Goal not found</h2>
      <p className="text-muted-foreground mb-4">The goal you're looking for doesn't exist or has been removed.</p>
      <Button onClick={onBack}>Back to Goals</Button>
    </div>
  );
};

export default GoalNotFound;
