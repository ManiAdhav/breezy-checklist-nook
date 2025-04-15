
import React, { useCallback } from 'react';
import { Habit } from '@/types/habit';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface HabitCardProps {
  habit: Habit & { streak: number };
  onClick: () => void;
  isSelected: boolean;
}

const HabitCard = ({ habit, onClick, isSelected }: HabitCardProps) => {
  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <div 
      onClick={handleClick}
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
const MemoizedHabitCard = React.memo(HabitCard, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.habit.id === nextProps.habit.id &&
    prevProps.habit.name === nextProps.habit.name &&
    prevProps.habit.updatedAt === nextProps.habit.updatedAt &&
    prevProps.habit.streak === nextProps.habit.streak &&
    prevProps.onClick === nextProps.onClick
  );
});

MemoizedHabitCard.displayName = 'HabitCard';

export default MemoizedHabitCard;
