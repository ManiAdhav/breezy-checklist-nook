
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Habit, HabitLog } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import AddHabitDialog from './AddHabitDialog';
import HabitLogList from './HabitLogList';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HabitDetailProps {
  habit: Habit;
  onClose: () => void;
}

const HabitDetail: React.FC<HabitDetailProps> = ({ habit, onClose }) => {
  const { getHabitLogs, logProgress, deleteHabit, getHabitStreak } = useHabit();
  const [logValue, setLogValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const logs = getHabitLogs(habit.id);
  const streak = getHabitStreak(habit.id);
  
  // Check if there's already a log for the selected date
  const existingLog = logs.find(log => {
    const logDate = new Date(log.date);
    return (
      logDate.getDate() === selectedDate.getDate() &&
      logDate.getMonth() === selectedDate.getMonth() &&
      logDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!logValue) return;
    
    try {
      const value = parseFloat(logValue);
      
      if (isNaN(value) || value < 0) {
        toast({
          title: "Invalid value",
          description: "Please enter a valid positive number.",
          variant: "destructive"
        });
        return;
      }
      
      logProgress({
        habitId: habit.id,
        date: selectedDate,
        value
      });
      
      setLogValue('');
      
      toast({
        title: "Progress logged",
        description: `You've logged ${value} ${habit.metric.unit} for ${format(selectedDate, 'MMM d, yyyy')}.`
      });
    } catch (error) {
      console.error('Error logging progress:', error);
      toast({
        title: "Error",
        description: "There was an error logging your progress. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = () => {
    try {
      deleteHabit(habit.id);
      onClose();
      toast({
        title: "Habit deleted",
        description: "Your habit has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "There was an error deleting your habit. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const calculateProgress = () => {
    if (!existingLog) return 0;
    return Math.min(100, (existingLog.value / habit.metric.target) * 100);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-xl">{habit.name}</CardTitle>
            <div className="flex gap-1 mt-1">
              {habit.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Streak and Progress Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Daily Target</h3>
                  <p className="text-gray-500">
                    {habit.metric.target} {habit.metric.unit} {habit.metric.type === 'duration' ? 'per day' : ''}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold">{streak.current}</div>
                  <div className="text-sm text-gray-500">day streak</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Today's Progress</span>
                  <span>
                    {existingLog ? existingLog.value : 0} / {habit.metric.target} {habit.metric.unit}
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              
              <form onSubmit={handleLogSubmit} className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium">Log Progress</h3>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 ml-1"
                        >
                          <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs text-gray-500 ml-1">
                            {format(selectedDate, 'MMM d, yyyy')}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date) {
                              setSelectedDate(date);
                              setCalendarOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={`Enter ${habit.metric.unit}`}
                      value={logValue}
                      onChange={(e) => setLogValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">Log</Button>
                  </div>
                  
                  {existingLog && (
                    <p className="text-xs text-amber-600">
                      You've already logged {existingLog.value} {habit.metric.unit} for this date. 
                      This will overwrite the previous entry.
                    </p>
                  )}
                </div>
              </form>
            </div>
            
            {/* History Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">History</h3>
              <HabitLogList logs={logs} habitUnit={habit.metric.unit} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AddHabitDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editHabit={habit}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the habit
              "{habit.name}" and all its logged data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HabitDetail;
