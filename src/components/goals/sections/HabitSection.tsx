
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Repeat, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal,
  Calendar,
  Info,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';
import { useHabit } from '@/contexts/HabitContext';
import { format, isToday } from 'date-fns';
import { Habit } from '@/types/habit';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface HabitSectionProps {
  goalId: string;
  limit?: number;
}

const HabitSection: React.FC<HabitSectionProps> = ({ goalId, limit }) => {
  const { habits, habitLogs, logProgress, getHabitStreak, addHabit } = useHabit();
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Filter habits for this goal
  const goalHabits = habits.filter(habit => habit.goalId === goalId);
  
  // Apply limit if specified
  const displayHabits = limit ? goalHabits.slice(0, limit) : goalHabits;
  const hasMoreHabits = limit && goalHabits.length > limit;
  
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
  
  const isCompletedToday = (habit: Habit) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return habitLogs.some(log => {
      const logDate = new Date(log.date).setHours(0, 0, 0, 0);
      return logDate === today && log.habitId === habit.id;
    });
  };
  
  const calculateProgress = (habit: Habit) => {
    const streak = getHabitStreak(habit.id);
    
    // For the progress bar, we'll use the current streak vs target streak
    // or a percentage based on completion rate
    let progress = 0;
    
    if (habit.targetStreak && habit.targetStreak > 0) {
      // Calculate based on target streak
      progress = Math.min(100, (streak.current / habit.targetStreak) * 100);
    } else {
      // Calculate based on consistency - last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.setHours(0, 0, 0, 0);
      });
      
      const completedDays = last7Days.filter(day => 
        habitLogs.some(log => 
          log.habitId === habit.id && 
          new Date(log.date).setHours(0, 0, 0, 0) === day
        )
      ).length;
      
      progress = Math.round((completedDays / 7) * 100);
    }
    
    return progress;
  };
  
  const toggleHabitCompletion = (habit: Habit) => {
    const completed = isCompletedToday(habit);
    
    if (completed) {
      // Remove today's log (simplified - in a real app, you'd want to delete the specific log)
      toast({
        title: "Cannot undo habit completion",
        description: "This feature is not implemented yet.",
        variant: "destructive"
      });
      return;
    }
    
    // Add a log for today
    logProgress({
      habitId: habit.id,
      date: new Date(),
      value: habit.metric === 'boolean' ? true : 1, // Default values
      notes: ''
    });
    
    toast({
      title: "Habit logged for today",
      description: `You've completed "${habit.name}" for today!`,
    });
  };
  
  const handleAddHabit = () => {
    // In a real implementation, this would open a form to add a habit
    setIsAddHabitDialogOpen(true);
  };
  
  const handleViewHabitDetail = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsHabitDetailOpen(true);
  };
  
  const handleAddBasicHabit = () => {
    // This is a simplified version, in a real app you'd want to collect more information
    const newHabit = {
      name: "New Habit",
      description: "Track your new daily habit",
      frequency: "daily",
      metric: "boolean",
      goalId: goalId,
      startDate: new Date(),
      icon: "activity"
    };
    
    addHabit(newHabit)
      .then(() => {
        setIsAddHabitDialogOpen(false);
        toast({
          title: "Habit created",
          description: "Your new habit has been created successfully.",
        });
      })
      .catch(error => {
        console.error("Error creating habit:", error);
        toast({
          title: "Error creating habit",
          description: "There was a problem creating your habit.",
          variant: "destructive"
        });
      });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Consistent activities that support your goal</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={handleAddHabit}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Habit
        </Button>
      </div>
      
      {goalHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-md">
          <Repeat className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
          <p className="text-muted-foreground mb-2">No habits yet</p>
          <Button variant="outline" size="sm" onClick={handleAddHabit}>
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Habit
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayHabits.map(habit => {
            const completed = isCompletedToday(habit);
            const progress = calculateProgress(habit);
            const streak = getHabitStreak(habit.id);
            
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
                        onClick={() => toggleHabitCompletion(habit)}
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
                      <DropdownMenuItem onClick={() => handleViewHabitDetail(habit)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
          
          {hasMoreHabits && (
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              +{goalHabits.length - limit} more habits
            </Button>
          )}
        </div>
      )}
      
      {/* Simple Add Habit Dialog */}
      <Dialog open={isAddHabitDialogOpen} onOpenChange={setIsAddHabitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This is a simplified habit creation flow. Click the button below to create a basic daily habit.
            </p>
            <div className="flex items-center mt-4 p-4 bg-muted/30 rounded-md">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-xs text-muted-foreground">
                For a more detailed habit setup, please use the dedicated Habits page.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddHabitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBasicHabit}>
              Create Simple Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Habit Detail Dialog */}
      <Dialog open={isHabitDetailOpen} onOpenChange={setIsHabitDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedHabit?.name}</DialogTitle>
          </DialogHeader>
          {selectedHabit && (
            <div className="py-4">
              <div className="grid gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Habit Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="text-muted-foreground">
                          {selectedHabit.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium mr-1">Start Date:</span>
                      <span className="text-muted-foreground">
                        {format(new Date(selectedHabit.startDate), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium mr-1">Frequency:</span>
                      <span className="text-muted-foreground">
                        {getFrequencyLabel(selectedHabit.frequency)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Current Streak</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold">
                        {getHabitStreak(selectedHabit.id).current}
                      </span>
                      <span className="text-muted-foreground ml-2">days</span>
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleHabitCompletion(selectedHabit)}
                        disabled={isCompletedToday(selectedHabit)}
                      >
                        {isCompletedToday(selectedHabit) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Completed Today
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4 mr-2" />
                            Mark Complete for Today
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {habitLogs
                      .filter(log => log.habitId === selectedHabit.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((log, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between text-sm p-2 border-b border-border last:border-0"
                        >
                          <span className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            {format(new Date(log.date), 'MMMM d, yyyy')}
                          </span>
                          {isToday(new Date(log.date)) && (
                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                      ))}
                    {habitLogs.filter(log => log.habitId === selectedHabit.id).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No activity recorded yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsHabitDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HabitSection;
