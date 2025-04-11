
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check } from 'lucide-react';
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
  reminders: string[];
  setReminders: (reminders: string[]) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  goals: Array<{ id: string; title: string; icon?: string }>;
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
  reminders,
  setReminders,
  endDate,
  setEndDate,
  showDatePicker,
  setShowDatePicker,
  goals,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Habit Name and Icon */}
      <div className="flex items-center gap-3 mb-4">
        <HabitIconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          showIconSelector={showIconSelector}
          toggleIconSelector={toggleIconSelector}
        />
        <div className="flex-1">
          <Input
            placeholder="What habit do you want to build?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-base border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      
      {/* Metric - How to Measure */}
      <div>
        <MetricSelector
          metric={metric}
          setMetric={setMetric}
          metricValue={metricValue}
          setMetricValue={setMetricValue}
          customMetric={customMetric}
          setCustomMetric={setCustomMetric}
        />
      </div>
      
      {/* Connected Goal & End Date */}
      <div>
        <DateAndGoalSelector
          endDate={endDate}
          setEndDate={setEndDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          goalId={goalId}
          setGoalId={setGoalId}
          goals={goals}
        />
      </div>
      
      {/* Frequency & Reminders */}
      <div>
        <FrequencySelector
          frequency={frequency}
          setFrequency={setFrequency}
          selectedDays={selectedDays}
          toggleDaySelection={toggleDaySelection}
          timeOfDay={timeOfDay}
          setTimeOfDay={setTimeOfDay}
          reminders={reminders}
          setReminders={setReminders}
        />
      </div>
      
      {/* Submit Button */}
      <div className="pt-2">
        <Button type="submit" className="w-full">
          {editHabit ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Habit
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default HabitFormContent;
