
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
    <div className="space-y-6">
      {/* Frequency Selection Card */}
      <div className="bg-card shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Frequency
          </h3>
        </div>
        
        <div className="p-4">
          <RadioGroup 
            value={frequency}
            onValueChange={setFrequency}
            className="flex gap-4"
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer font-normal text-base">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          {frequency === 'weekly' && (
            <div className="mt-4">
              <div className="grid grid-cols-7 gap-2 mt-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={selectedDays.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full p-0 w-9 h-9 ${selectedDays.includes(day.value) ? 'bg-primary' : 'border-muted-foreground/30'}`}
                    onClick={() => toggleDaySelection(day.value)}
                  >
                    {day.label.charAt(0)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Reminders Card */}
      <div className="bg-card shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Reminders
          </h3>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              placeholder="Add time"
              className="w-auto max-w-[150px] border-input focus-visible:ring-primary"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReminder}
              disabled={!newReminderTime}
              className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {reminders.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {reminders.map((time, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-muted/60 px-3 py-1.5 rounded-full"
                >
                  <span className="text-sm">{time}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1.5 rounded-full hover:bg-muted-foreground/20"
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
