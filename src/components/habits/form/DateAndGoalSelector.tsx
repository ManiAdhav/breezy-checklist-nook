
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface DateAndGoalSelectorProps {
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  goalId: string;
  setGoalId: (id: string) => void;
  goals: Array<{ id: string; title: string; icon?: string }>;
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
  const selectedGoal = goals.find(goal => goal.id === goalId);

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
              {endDate ? format(endDate, 'MMM d, yyyy') : 'End date'}
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
        <SelectTrigger className="bg-background border-muted w-36 flex items-center gap-2">
          {selectedGoal?.icon ? (
            <DynamicIcon name={selectedGoal.icon} className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Target className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="truncate">{selectedGoal?.title || 'Select goal'}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground inline mr-2" />
            <span>None</span>
          </SelectItem>
          {goals && goals.map((goal) => (
            <SelectItem key={goal.id} value={goal.id} className="flex items-center gap-2">
              {goal.icon ? (
                <DynamicIcon name={goal.icon} className="h-4 w-4 inline mr-2" />
              ) : (
                <Target className="h-4 w-4 inline mr-2" />
              )}
              <span>{goal.title}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateAndGoalSelector;
