
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check } from 'lucide-react';
import { Habit } from '@/types/habit';
import HabitIconSelector from './HabitIconSelector';
import MetricSelector from './MetricSelector';
import FrequencySelector from './FrequencySelector';
import DateAndGoalSelector from './DateAndGoalSelector';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        {/* Habit Name and Icon */}
        <div className="flex items-center gap-3">
          <HabitIconSelector
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
            showIconSelector={showIconSelector}
            toggleIconSelector={toggleIconSelector}
          />
          <div className="flex-1">
            <Input
              placeholder="Habit name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-0 border-b border-border/20 rounded-none px-0 py-1.5 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
          </div>
        </div>
        
        {/* Metric - How to Measure */}
        <MetricSelector
          metric={metric}
          setMetric={setMetric}
          metricValue={metricValue}
          setMetricValue={setMetricValue}
          customMetric={customMetric}
          setCustomMetric={setCustomMetric}
        />
        
        {/* Connected Goal & End Date */}
        <DateAndGoalSelector
          endDate={endDate}
          setEndDate={setEndDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          goalId={goalId}
          setGoalId={setGoalId}
          goals={goals}
        />
        
        {/* Frequency & Reminders */}
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
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editHabit ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Update Habit
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Habit
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default HabitFormContent;
