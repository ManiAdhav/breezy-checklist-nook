
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Habit } from '@/types/habit';
import HabitIconSelector from './HabitIconSelector';
import MetricSelector from './MetricSelector';
import FrequencySelector from './FrequencySelector';
import DateAndGoalSelector from './DateAndGoalSelector';

interface HabitFormContentProps {
  editHabit?: Habit;
  name: string;
  setName: (name: string) => void;
  metric: string;
  setMetric: (metric: string) => void;
  metricValue: string;
  setMetricValue: (value: string) => void;
  customMetric: string;
  setCustomMetric: (metric: string) => void;
  goalId: string;
  setGoalId: (goalId: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  showIconSelector: boolean;
  toggleIconSelector: () => void;
  frequency: string;
  setFrequency: (frequency: string) => void;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  timeOfDay: string;
  setTimeOfDay: (time: string) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  goals: Array<{ id: string; title: string }>;
  handleSubmit: (e: React.FormEvent) => void;
}

const HabitFormContent: React.FC<HabitFormContentProps> = ({
  editHabit,
  name,
  setName,
  metric,
  setMetric,
  metricValue,
  setMetricValue,
  customMetric,
  setCustomMetric,
  goalId,
  setGoalId,
  selectedIcon,
  setSelectedIcon,
  showIconSelector,
  toggleIconSelector,
  frequency,
  setFrequency,
  selectedDays,
  toggleDaySelection,
  timeOfDay,
  setTimeOfDay,
  endDate,
  setEndDate,
  showDatePicker,
  setShowDatePicker,
  goals,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="flex items-center gap-3 mb-2">
        <HabitIconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          showIconSelector={showIconSelector}
          toggleIconSelector={toggleIconSelector}
        />
        <div className="flex-1">
          <Input
            placeholder="Enter habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-primary/20 focus-visible:ring-primary"
          />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <MetricSelector
        metric={metric}
        setMetric={setMetric}
        metricValue={metricValue}
        setMetricValue={setMetricValue}
        customMetric={customMetric}
        setCustomMetric={setCustomMetric}
      />
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <DateAndGoalSelector
          endDate={endDate}
          setEndDate={setEndDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          goalId={goalId}
          setGoalId={setGoalId}
          goals={goals}
        />
        
        <FrequencySelector
          frequency={frequency}
          setFrequency={setFrequency}
          selectedDays={selectedDays}
          toggleDaySelection={toggleDaySelection}
          timeOfDay={timeOfDay}
          setTimeOfDay={setTimeOfDay}
        />
      </div>
      
      <Button type="submit" className="w-full mt-6">
        {editHabit ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add Habit
          </>
        )}
      </Button>
    </form>
  );
};

export default HabitFormContent;
