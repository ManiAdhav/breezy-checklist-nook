
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { FREQUENCY_OPTIONS, DAYS_OF_WEEK, TIME_OF_DAY_OPTIONS } from '../constants/habit-constants';

interface FrequencySelectorProps {
  frequency: string;
  setFrequency: (frequency: string) => void;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  timeOfDay?: string;
  setTimeOfDay?: (time: string) => void;
  reminders?: string[];
  setReminders?: (reminders: string[]) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequency,
  setFrequency,
  selectedDays,
  toggleDaySelection,
  timeOfDay = 'anytime',
  setTimeOfDay = () => {},
  reminders = [],
  setReminders = () => {}
}) => {
  const toggleReminder = (value: string) => {
    if (reminders.includes(value)) {
      setReminders(reminders.filter(r => r !== value));
    } else {
      setReminders([...reminders, value]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg border border-border">
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs font-normal">How often?</Label>
          
          <RadioGroup 
            value={frequency}
            onValueChange={setFrequency}
            className="flex flex-wrap gap-4"
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          {frequency === 'weekly' && (
            <div className="flex flex-wrap gap-2 mt-2">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => toggleDaySelection(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg border border-border">
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs font-normal">When do you want to do this?</Label>
          
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={timeOfDay} 
              onValueChange={setTimeOfDay}
            >
              <SelectTrigger className="w-auto min-w-16">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OF_DAY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {timeOfDay !== 'anytime' && (
            <div className="mt-2 space-y-2">
              <Label className="text-muted-foreground text-xs font-normal">Add reminders</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="reminder-5min" 
                    checked={reminders.includes('5min')}
                    onCheckedChange={() => toggleReminder('5min')}
                  />
                  <Label htmlFor="reminder-5min" className="text-sm">5 minutes before</Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="reminder-15min" 
                    checked={reminders.includes('15min')}
                    onCheckedChange={() => toggleReminder('15min')}
                  />
                  <Label htmlFor="reminder-15min" className="text-sm">15 minutes before</Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="reminder-30min" 
                    checked={reminders.includes('30min')}
                    onCheckedChange={() => toggleReminder('30min')}
                  />
                  <Label htmlFor="reminder-30min" className="text-sm">30 minutes before</Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="reminder-1hour" 
                    checked={reminders.includes('1hour')}
                    onCheckedChange={() => toggleReminder('1hour')}
                  />
                  <Label htmlFor="reminder-1hour" className="text-sm">1 hour before</Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrequencySelector;
