
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Bell, Plus, X, Calendar } from 'lucide-react';
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
    <div className="space-y-5">
      {/* Frequency Section */}
      <div className="space-y-3">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary mr-2" />
          <span>Frequency</span>
        </div>
        
        <RadioGroup 
          value={frequency}
          onValueChange={setFrequency}
          className="flex flex-wrap gap-2"
        >
          {FREQUENCY_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.value}
                className="px-3 py-1.5 text-sm rounded-full bg-muted/30 
                         cursor-pointer hover:bg-muted/50 transition-colors
                         peer-data-[state=checked]:bg-primary/15 peer-data-[state=checked]:text-primary"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {frequency === 'weekly' && (
          <div className="mt-2">
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full p-0 w-8 h-8 text-xs ${
                    selectedDays.includes(day.value) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/30 text-muted-foreground border-0 hover:bg-muted/50'
                  }`}
                  onClick={() => toggleDaySelection(day.value)}
                >
                  {day.label.charAt(0)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Reminders Section */}
      <div className="space-y-3">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Bell className="h-4 w-4 text-primary mr-2" />
          <span>Reminders</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={newReminderTime}
            onChange={(e) => setNewReminderTime(e.target.value)}
            className="w-32 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            placeholder="Add time"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addReminder}
            disabled={!newReminderTime}
            className="h-9 bg-muted/30 text-primary border-0 hover:bg-primary/10"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
        
        {reminders.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {reminders.map((time, index) => (
              <div 
                key={index}
                className="inline-flex items-center bg-muted/40 px-2.5 py-1 rounded-full text-xs"
              >
                <span>{time}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 rounded-full hover:bg-muted-foreground/10"
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
  );
};

export default FrequencySelector;
