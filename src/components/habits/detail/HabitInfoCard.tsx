
import React from 'react';
import { format } from 'date-fns';
import { Target } from 'lucide-react';
import { Habit } from '@/types/habit';

interface HabitInfoCardProps {
  habit: Habit;
  associatedGoal: { id: string; title: string } | null;
}

const HabitInfoCard: React.FC<HabitInfoCardProps> = ({ habit, associatedGoal }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Details</h3>
      <div className="bg-muted p-3 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">Metric:</p>
          <p className="text-sm font-medium">{habit.metric}</p>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">Current streak:</p>
          <p className="text-sm font-medium">{habit.streak || 0} days</p>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm">Total logs:</p>
          <p className="text-sm font-medium">{habit.logs?.length || 0} entries</p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm">Created:</p>
          <p className="text-sm font-medium">
            {format(new Date(habit.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        
        {associatedGoal && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center text-sm">
              <Target className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Goal:</span>
              <span className="font-medium">{associatedGoal.title}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitInfoCard;
