
import React from 'react';
import { Habit } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  isSelected: boolean;
  onClick: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isSelected, onClick }) => {
  const { getHabitLogs, getHabitStreak } = useHabit();
  
  const recentLogs = getHabitLogs(habit.id).slice(0, 5);
  const streak = getHabitStreak(habit.id);
  
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6">{habit.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {habit.metric}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center text-sm">
            <span className="font-semibold">{streak.current}</span>
            <span className="ml-1 text-gray-500">day streak</span>
          </div>
          
          {streak.longest > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Best: {streak.longest} days
            </div>
          )}
        </div>
      </div>
      
      {streak.lastLoggedDate && (
        <div className="mt-3 text-xs text-gray-500">
          Last entry: {format(new Date(streak.lastLoggedDate), 'MMM d, yyyy')}
        </div>
      )}
      
      {habit.tags && habit.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {habit.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitCard;
