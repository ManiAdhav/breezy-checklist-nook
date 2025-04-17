
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GoalActionButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6">
      <Button size="icon" className="h-12 w-12 rounded-full shadow-md bg-primary hover:bg-primary/90 transition-colors">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default GoalActionButton;
