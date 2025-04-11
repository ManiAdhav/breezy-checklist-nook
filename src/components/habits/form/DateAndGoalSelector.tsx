
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Target, Link2 } from 'lucide-react';
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
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Link2 className="h-4 w-4 text-primary mr-2" />
          <span>Connected Goal</span>
        </div>
        
        <Select value={goalId} onValueChange={(value) => setGoalId(value)}>
          <SelectTrigger className="bg-muted/30 border-0 focus:ring-1 focus:ring-primary flex items-center gap-2">
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
              <span>No goal</span>
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
      
      <div className="space-y-3">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <CalendarIcon className="h-4 w-4 text-primary mr-2" />
          <span>Target Date</span>
        </div>
        
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal bg-muted/30 border-0 hover:bg-muted/50 focus:ring-1 focus:ring-primary"
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'MMM d, yyyy') : 'Choose target date'}
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
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateAndGoalSelector;
