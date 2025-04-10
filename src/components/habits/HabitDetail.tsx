
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Edit, Target, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Habit, HabitLog } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import AddHabitDialog from './AddHabitDialog';
import { useGoal } from '@/contexts/GoalContext';
import HabitLogList from './HabitLogList';

interface HabitDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
}

const HabitDetail: React.FC<HabitDetailProps> = ({ open, onOpenChange, habit }) => {
  const { updateHabit, deleteHabit } = useHabit();
  const { threeYearGoals } = useGoal();
  
  const [logValue, setLogValue] = useState('');
  const [logDate, setLogDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  if (!habit) return null;
  
  const handleAddLog = () => {
    if (!logValue.trim()) return;
    
    const numericValue = parseFloat(logValue);
    if (isNaN(numericValue)) return;
    
    const newLog: HabitLog = {
      id: `log-${Date.now()}`,
      habitId: habit.id,
      date: logDate,
      value: numericValue
    };
    
    const updatedLogs = [...(habit.logs || []), newLog];
    
    // Calculate new streak
    let streak = habit.streak || 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = logDate.toDateString() === today.toDateString();
    const isYesterday = logDate.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      // Log for today - increment streak if there was a log yesterday
      const hasYesterdayLog = habit.logs?.some(
        log => new Date(log.date).toDateString() === yesterday.toDateString()
      );
      if (hasYesterdayLog) {
        streak += 1;
      } else {
        streak = 1; // Reset streak to 1 if today but no yesterday log
      }
    } else if (isYesterday) {
      // Log for yesterday - set streak to 1 if there wasn't already a streak
      if (streak === 0) {
        streak = 1;
      }
    }
    
    // Update the habit with new logs and streak
    updateHabit(habit.id, { 
      logs: updatedLogs,
      streak
    });
    
    // Reset form
    setLogValue('');
    setLogDate(new Date());
    setIsDatePickerOpen(false);
  };
  
  const handleEditHabit = (updatedHabit: Habit) => {
    updateHabit(updatedHabit.id, updatedHabit);
    setIsEditMode(false);
  };
  
  const handleDeleteHabit = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id);
      onOpenChange(false);
    }
  };
  
  // Get associated goal if any
  const associatedGoal = habit.goalId 
    ? threeYearGoals?.find(goal => goal.id === habit.goalId)
    : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{habit.name}</DialogTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsEditMode(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDeleteHabit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {/* Habit Info */}
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
            
            {/* Add new log */}
            <div>
              <h3 className="text-sm font-medium mb-2">Log Progress</h3>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    type="number"
                    placeholder={`Enter ${habit.metric}`}
                    value={logValue}
                    onChange={(e) => setLogValue(e.target.value)}
                  />
                </div>
                
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={logDate}
                      onSelect={(date) => date && setLogDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Button onClick={handleAddLog}>Add</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Selected date: {format(logDate, 'MMM d, yyyy')}
              </p>
            </div>
            
            {/* Log history */}
            <div>
              <h3 className="text-sm font-medium mb-2">History</h3>
              <HabitLogList 
                logs={habit.logs || []}
                habitUnit={habit.metric}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {isEditMode && (
        <AddHabitDialog
          open={isEditMode}
          onOpenChange={setIsEditMode}
          onHabitAdded={handleEditHabit}
          editHabit={habit}
        />
      )}
    </>
  );
};

export default HabitDetail;
