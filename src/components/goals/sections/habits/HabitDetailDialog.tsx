
import React from 'react';
import { format, isToday } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Calendar, 
  Repeat, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';
import { Habit, HabitLog, HabitStreak } from '@/types/habit';

interface HabitDetailDialogProps {
  habit: Habit | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  habitLogs: HabitLog[];
  streak: HabitStreak;
  isCompletedToday: boolean;
  onToggleCompletion: (habit: Habit) => void;
}

const HabitDetailDialog: React.FC<HabitDetailDialogProps> = ({
  habit,
  isOpen,
  onOpenChange,
  habitLogs,
  streak,
  isCompletedToday,
  onToggleCompletion
}) => {
  if (!habit) return null;

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{habit.name}</DialogTitle>
        </DialogHeader>
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
                      {habit.description || "No description provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium mr-1">Start Date:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(habit.startDate), 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center">
                  <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium mr-1">Frequency:</span>
                  <span className="text-muted-foreground">
                    {getFrequencyLabel(habit.frequency)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Current Streak</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold">
                    {streak.current}
                  </span>
                  <span className="text-muted-foreground ml-2">days</span>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onToggleCompletion(habit)}
                    disabled={isCompletedToday}
                  >
                    {isCompletedToday ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Completed Today
                      </>
                    ) : (
                      <>
                        <Circle className="mr-2 h-4 w-4" />
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
                {habitLogs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No activity recorded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitDetailDialog;
