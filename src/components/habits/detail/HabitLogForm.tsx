
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Habit, HabitLog } from '@/types/habit';

interface HabitLogFormProps {
  habit: Habit;
  onAddLog: (log: HabitLog) => void;
}

const HabitLogForm: React.FC<HabitLogFormProps> = ({ habit, onAddLog }) => {
  const [logValue, setLogValue] = useState('');
  const [logDate, setLogDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
    
    onAddLog(newLog);
    
    // Reset form
    setLogValue('');
    setLogDate(new Date());
    setIsDatePickerOpen(false);
  };

  return (
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
  );
};

export default HabitLogForm;
