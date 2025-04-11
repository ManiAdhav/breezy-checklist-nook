
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
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { HabitFormData } from './useHabitForm';

interface HabitFormContentProps {
  form: UseFormReturn<HabitFormData>;
  editHabit?: Habit;
  goals: Array<{ id: string; title: string; icon?: string }>;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  showIconSelector: boolean;
  toggleIconSelector: () => void;
  selectedDays: string[];
  toggleDaySelection: (day: string) => void;
  timeOfDay: string;
  setTimeOfDay: (time: string) => void;
  reminders: string[];
  setReminders: (reminders: string[]) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const HabitFormContent: React.FC<HabitFormContentProps> = ({
  form,
  editHabit,
  goals,
  selectedIcon,
  setSelectedIcon,
  showIconSelector,
  toggleIconSelector,
  selectedDays,
  toggleDaySelection,
  timeOfDay,
  setTimeOfDay,
  reminders,
  setReminders,
  showDatePicker,
  setShowDatePicker,
  onSubmit
}) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Habit name"
                        {...field}
                        className="border-0 border-b border-border/20 rounded-none px-0 py-1.5 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Metric - How to Measure */}
          <FormField
            control={form.control}
            name="metric"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MetricSelector
                    metric={field.value}
                    setMetric={field.onChange}
                    metricValue={form.watch('target')?.toString() || '1'}
                    setMetricValue={(val) => form.setValue('target', Number(val))}
                    customMetric=""
                    setCustomMetric={() => {}}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Connected Goal & End Date */}
          <DateAndGoalSelector
            endDate={form.watch('endDate')}
            setEndDate={(date) => form.setValue('endDate', date)}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            goalId={form.watch('goalId') || ''}
            setGoalId={(id) => form.setValue('goalId', id)}
            goals={goals}
          />
          
          {/* Frequency & Reminders */}
          <FrequencySelector
            frequency={form.watch('frequency')}
            setFrequency={(freq) => form.setValue('frequency', freq as 'daily' | 'weekly' | 'monthly')}
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
    </Form>
  );
};

export default HabitFormContent;
