
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Frequency options
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
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

interface FrequencySelectorProps {
  frequency: string;
  setFrequency: (frequency: string) => void;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequency,
  setFrequency,
  selectedDays,
  toggleDaySelection
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
      </div>
    </div>
  );
};

export default FrequencySelector;
