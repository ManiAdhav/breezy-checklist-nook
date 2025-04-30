
import React from 'react';
import { Target } from 'lucide-react';

interface SelectedGoalBadgeProps {
  goalTitle: string;
}

const SelectedGoalBadge: React.FC<SelectedGoalBadgeProps> = ({ goalTitle }) => {
  if (!goalTitle) return null;
  
  return (
    <div className="absolute top-1 right-12 bg-primary/15 text-primary text-xs px-2.5 py-1 rounded-full flex items-center font-medium">
      <Target className="w-3 h-3 mr-1" />
      {goalTitle}
    </div>
  );
};

export default SelectedGoalBadge;
