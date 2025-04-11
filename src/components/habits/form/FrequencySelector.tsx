
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Plus, X, Calendar } from 'lucide-react';
import { DAYS_OF_WEEK } from '../constants/habit-constants';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
      {/* Frequency Section */}
      <div className="space-y-2">
        <div className="flex items-center text-sm font-medium text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 text-primary/70 mr-2" />
          <span>Frequency</span>
        </div>
        
        <ToggleGroup 
          type="single" 
          value={frequency}
          onValueChange={(value) => {
            if (value) setFrequency(value);
          }}
          className="flex justify-start gap-2"
        >
          <ToggleGroupItem value="daily" className="text-xs border-0 bg-muted/30 data-[state=on]:bg-primary/20 data-[state=on]:text-primary">
            Daily
          </ToggleGroupItem>
          <ToggleGroupItem value="weekly" className="text-xs border-0 bg-muted/30 data-[state=on]:bg-primary/20 data-[state=on]:text-primary">
            Weekly
          </ToggleGroupItem>
        </ToggleGroup>
        
        {frequency === 'weekly' && (
          <div className="mt-2">
            <div className="grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-0 w-7 h-7 text-xs ${
                    selectedDays.includes(day.value) 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:bg-muted/40'
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
      <div className="space-y-2">
        <div className="flex items-center text-sm font-medium text-muted-foreground mb-2">
          <Bell className="h-4 w-4 text-primary/70 mr-2" />
          <span>Reminders</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={newReminderTime}
            onChange={(e) => setNewReminderTime(e.target.value)}
            className="w-32 border-0 border-b border-border/20 rounded-none px-0 py-1.5 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            placeholder="Add time"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={addReminder}
            disabled={!newReminderTime}
            className="h-8 text-primary hover:bg-primary/10"
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
                className="inline-flex items-center bg-muted/20 px-2 py-0.5 rounded-full text-xs"
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
