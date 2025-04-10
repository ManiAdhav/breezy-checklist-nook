
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

// Frequency options (removing monthly)
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

// Days of the week
export const DAYS_OF_WEEK = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

// Time options for the dropdown
export const TIME_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'anytime', label: 'Anytime' },
];

interface FrequencySelectorProps {
  frequency: string;
  setFrequency: (frequency: string) => void;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  timeOfDay?: string;
  setTimeOfDay?: (time: string) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequency,
  setFrequency,
  selectedDays,
  toggleDaySelection,
  timeOfDay = 'anytime',
  setTimeOfDay = () => {}
}) => {
  return (
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
        
        <div className="mt-4">
          <Label className="text-muted-foreground text-xs font-normal mb-2 block">What time of day?</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={timeOfDay} 
              onValueChange={setTimeOfDay}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencySelector;
