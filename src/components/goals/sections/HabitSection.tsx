
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Repeat, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';

interface HabitSectionProps {
  goalId: string;
}

// Placeholder data for demonstration
const demoHabits = [
  { 
    id: 'h1', 
    title: 'Daily practice session', 
    frequency: 'daily',
    streakCount: 5,
    lastCompleted: new Date(),
    progress: 70
  },
  { 
    id: 'h2', 
    title: 'Weekly review', 
    frequency: 'weekly',
    streakCount: 3,
    lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    progress: 85
  },
  { 
    id: 'h3', 
    title: 'Monthly assessment test', 
    frequency: 'monthly',
    streakCount: 2,
    lastCompleted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    progress: 100
  },
];

const HabitSection: React.FC<HabitSectionProps> = ({ goalId }) => {
  const [habits, setHabits] = useState(demoHabits);
  
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
  
  const isCompletedToday = (habit: typeof demoHabits[0]) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastCompleted = new Date(habit.lastCompleted).setHours(0, 0, 0, 0);
    return today === lastCompleted;
  };
  
  const toggleHabitCompletion = (id: string) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id === id) {
          const completed = isCompletedToday(habit);
          
          if (completed) {
            return { 
              ...habit, 
              lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000),
              streakCount: Math.max(0, habit.streakCount - 1)
            };
          } else {
            return { 
              ...habit, 
              lastCompleted: new Date(),
              streakCount: habit.streakCount + 1
            };
          }
        }
        return habit;
      })
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Consistent activities that support your goal</p>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Habit
        </Button>
      </div>
      
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
          <p className="text-muted-foreground mb-2">No habits yet</p>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Habit
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => {
            const completed = isCompletedToday(habit);
            
            return (
              <div 
                key={habit.id}
                className="p-3 border border-border rounded-md bg-card"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 mr-2 rounded-full ${
                          completed ? 'text-green-500' : 'text-gray-500'
                        }`}
                        onClick={() => toggleHabitCompletion(habit.id)}
                      >
                        {completed ? (
                          <CheckCircle2 className="h-5 w-5 fill-green-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
                      {habit.title}
                    </div>
                    
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Repeat className="h-3.5 w-3.5 mr-1" />
                      <span>{getFrequencyLabel(habit.frequency)}</span>
                      <span className="mx-2">•</span>
                      <span>{habit.streakCount} streak</span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">Consistency</span>
                        <span>{habit.progress}%</span>
                      </div>
                      <Progress value={habit.progress} className="h-1.5" />
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HabitSection;
