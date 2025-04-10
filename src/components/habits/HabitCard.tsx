
import React from 'react';
import { Habit } from '@/types/habit';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface HabitCardProps {
  habit: Habit;
  onClick: () => void;
  isSelected: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onClick, isSelected }) => {
  return (
    <div 
      onClick={onClick}
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary shadow-md' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <DynamicIcon name={habit.icon || 'Activity'} className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{habit.name}</h3>
            <p className="text-sm text-gray-500">{habit.metric}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{habit.streak || 0}</div>
          <div className="text-xs text-gray-500">day streak</div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
