
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Bell, Plus, X } from 'lucide-react';
import { FREQUENCY_OPTIONS, DAYS_OF_WEEK } from '../constants/habit-constants';

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
  timeOfDay = '',
  setTimeOfDay = () => {},
  reminders = [],
  setReminders = () => {}
}) => {
  const [newReminderTime, setNewReminderTime] = useState('');

  const addReminder = () => {
    if (newReminderTime && !reminders.includes(newReminderTime)) {
      setReminders([...reminders, newReminderTime]);
      setNewReminderTime('');
    }
  };

  const removeReminder = (time: string) => {
    setReminders(reminders.filter(t => t !== time));
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg border border-border">
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs font-medium">How often?</Label>
          
          <RadioGroup 
            value={frequency}
            onValueChange={setFrequency}
            className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          {frequency === 'weekly' && (
            <div className="mt-3">
              <Label className="text-muted-foreground text-xs font-medium mb-2 block">Select days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={selectedDays.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-3 min-w-[52px]"
                    onClick={() => toggleDaySelection(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg border border-border">
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs font-medium">Reminder times</Label>
          
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              placeholder="Add time"
              className="w-auto max-w-[150px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReminder}
              disabled={!newReminderTime}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add reminder</span>
            </Button>
          </div>
          
          {reminders.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {reminders.map((time, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-background px-3 py-1.5 rounded-md border border-border"
                >
                  <span className="text-sm font-medium">{time}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2 hover:bg-muted"
                    onClick={() => removeReminder(time)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove reminder</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrequencySelector;
