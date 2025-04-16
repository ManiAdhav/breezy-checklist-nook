
import React from 'react';
import { Habit } from '@/types/habit';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface HabitCardProps {
  habit: Habit & { streak: number };
  onClick: () => void;
  isSelected: boolean;
}

const HabitCard = ({ habit, onClick, isSelected }: HabitCardProps) => {
  // Use React.memo to prevent unnecessary re-renders
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
          <div className="font-semibold">{habit.streak}</div>
          <div className="text-xs text-gray-500">day streak</div>
        </div>
      </div>
    </div>
  );
};

// Optimize memo comparison with a custom comparison function
// This helps prevent unnecessary re-renders by doing a more precise comparison
const MemoizedHabitCard = React.memo(HabitCard, (prevProps, nextProps) => {
  // Only re-render if any of these specific props change
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.onClick !== nextProps.onClick) return false;
  
  // Deep comparison of the habit object properties that affect rendering
  const prevHabit = prevProps.habit;
  const nextHabit = nextProps.habit;
  
  return (
    prevHabit.id === nextHabit.id &&
    prevHabit.name === nextHabit.name &&
    prevHabit.metric === nextHabit.metric &&
    prevHabit.icon === nextHabit.icon &&
    prevHabit.streak === nextHabit.streak
  );
});

MemoizedHabitCard.displayName = 'HabitCard';

export default MemoizedHabitCard;
