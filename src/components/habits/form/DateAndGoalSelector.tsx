
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface DateAndGoalSelectorProps {
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  goalId: string;
  setGoalId: (id: string) => void;
  goals: Array<{ id: string; title: string }>;
}

const DateAndGoalSelector: React.FC<DateAndGoalSelectorProps> = ({
  endDate,
  setEndDate,
  showDatePicker,
  setShowDatePicker,
  goalId,
  setGoalId,
  goals
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
              {endDate ? format(endDate, 'MMM d, yyyy') : 'End date (optional)'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                setShowDatePicker(false);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Select value={goalId} onValueChange={(value) => setGoalId(value)}>
        <SelectTrigger className="bg-background border-muted w-10">
          <DynamicIcon name="Goal" className="h-4 w-4 text-muted-foreground" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {goals && goals.map((goal) => (
            <SelectItem key={goal.id} value={goal.id}>
              {goal.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateAndGoalSelector;
