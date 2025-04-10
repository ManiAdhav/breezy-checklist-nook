
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { FREQUENCY_OPTIONS, DAYS_OF_WEEK, TIME_OF_DAY_OPTIONS } from '../constants/habit-constants';

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
        
        <div className="mt-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={timeOfDay} 
            onValueChange={setTimeOfDay}
          >
            <SelectTrigger className="w-16">
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
      </div>
    </div>
  );
};

export default FrequencySelector;
