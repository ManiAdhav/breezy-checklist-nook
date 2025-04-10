
import React from 'react';
import { Habit } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  
  // Calculate progress percentage
  const todayLog = recentLogs.find(log => {
    const logDate = new Date(log.date);
    const today = new Date();
    return (
      logDate.getDate() === today.getDate() &&
      logDate.getMonth() === today.getMonth() &&
      logDate.getFullYear() === today.getFullYear()
    );
  });
  
  const progress = todayLog 
    ? Math.min(100, (todayLog.value / habit.metric.target) * 100) 
    : 0;

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6">{habit.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {habit.metric.target} {habit.metric.unit} {habit.metric.type === 'duration' ? 'per day' : ''}
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
      
      <div className="mt-3">
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>
            {todayLog 
              ? `${todayLog.value} / ${habit.metric.target} ${habit.metric.unit}` 
              : `0 / ${habit.metric.target} ${habit.metric.unit}`}
          </span>
          
          {streak.lastLoggedDate && (
            <span>
              Last: {format(new Date(streak.lastLoggedDate), 'MMM d')}
            </span>
          )}
        </div>
      </div>
      
      {habit.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {habit.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
};

export default HabitCard;
