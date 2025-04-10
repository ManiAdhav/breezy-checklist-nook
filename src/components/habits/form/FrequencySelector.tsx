
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Bell, Plus, X, Calendar } from 'lucide-react';
import { FREQUENCY_OPTIONS, DAYS_OF_WEEK } from '../constants/habit-constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            How often?
          </h3>
        </CardHeader>
        
        <CardContent className="px-4 pb-4">
          <RadioGroup 
            value={frequency}
            onValueChange={setFrequency}
            className="flex gap-4 mb-3"
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer font-normal text-sm">{option.label}</Label>
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
                    className={`rounded-full p-0 w-8 h-8 ${selectedDays.includes(day.value) ? 'bg-primary' : 'border-muted-foreground/20'}`}
                    onClick={() => toggleDaySelection(day.value)}
                  >
                    {day.label.charAt(0)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Reminders
          </h3>
        </CardHeader>
        
        <CardContent className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              className="w-28 border-input/50 focus-visible:ring-primary"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addReminder}
              disabled={!newReminderTime}
              className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>
          
          {reminders.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {reminders.map((time, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center bg-muted/50 px-2 py-1 rounded-full text-xs"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default FrequencySelector;
