
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Circle, 
  MoreHorizontal,
  Calendar,
  Repeat 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';
import { Habit, HabitStreak } from '@/types/habit';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  progress: number;
  streak: HabitStreak;
  completed: boolean;
  onToggleCompletion: (habit: Habit) => void;
  onViewDetail: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  progress, 
  streak, 
  completed, 
  onToggleCompletion, 
  onViewDetail 
}) => {
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Every day';
      case 'weekly':
        return 'Every week';
      case 'monthly':
        return 'Every month';
      default:
        return frequency;
    }
  };

  return (
    <div className="p-3 border border-border rounded-md bg-card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-medium flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 mr-2 rounded-full ${
                completed ? 'text-green-500' : 'text-gray-500'
              }`}
              onClick={() => onToggleCompletion(habit)}
            >
              {completed ? (
                <CheckCircle2 className="h-5 w-5 fill-green-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </Button>
            {habit.name}
          </div>
          
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Repeat className="h-3.5 w-3.5 mr-1" />
            <span>{getFrequencyLabel(habit.frequency)}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(habit.startDate), 'MMM d, yyyy')}
            </span>
            <span className="mx-2">•</span>
            <span>{streak.current} day streak</span>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">Consistency</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetail(habit)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HabitCard;
