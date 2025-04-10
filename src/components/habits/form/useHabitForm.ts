
import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import { useHabit } from '@/contexts/HabitContext';
import { METRIC_OPTIONS } from '../constants/habit-constants';

export const useHabitForm = (
  open: boolean,
  onOpenChange: (open: boolean) => void,
  editHabit?: Habit
) => {
  // Get needed context hooks
  const { addHabit, updateHabit } = useHabit();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [metric, setMetric] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [customMetric, setCustomMetric] = useState('');
  const [goalId, setGoalId] = useState('none');
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [reminders, setReminders] = useState<string[]>([]);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Reset form when dialog opens/closes or editing habit changes
  useEffect(() => {
    if (open) {
      if (editHabit) {
        setName(editHabit.name);
        
        // Check if metric is one of our predefined options
        if (METRIC_OPTIONS.includes(editHabit.metric)) {
          setMetric(editHabit.metric);
          setCustomMetric('');
        } else {
          setMetric('custom');
          setCustomMetric(editHabit.metric);
        }
        
        setGoalId(editHabit.goalId || 'none');
        setSelectedIcon(editHabit.icon || 'Activity');
        setFrequency(editHabit.frequency || 'daily');
        setSelectedDays(editHabit.selectedDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
        setTimeOfDay(editHabit.timeOfDay || '');
        setReminders(editHabit.reminders || []);
        setEndDate(editHabit.endDate);
      } else {
        setName('');
        setMetric('steps');
        setMetricValue('');
        setCustomMetric('');
        setGoalId('none');
        setSelectedIcon('Activity');
        setFrequency('daily');
        setSelectedDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
        setTimeOfDay('');
        setReminders([]);
        setEndDate(undefined);
      }
      setShowIconSelector(false);
      setShowDatePicker(false);
    }
  }, [open, editHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    // Determine the final metric value
    const finalMetric = metric === 'custom' ? customMetric : metric;
    
    if (!finalMetric.trim()) return;
    
    try {
      if (editHabit) {
        updateHabit(editHabit.id, {
          name,
          metric: finalMetric,
          goalId: goalId !== 'none' ? goalId : undefined,
          icon: selectedIcon,
          frequency,
          selectedDays,
          timeOfDay,
          reminders,
          endDate
        });
        toast({
          title: "Habit updated",
          description: `${name} has been updated successfully.`
        });
      } else {
        addHabit({
          name,
          metric: finalMetric,
          goalId: goalId !== 'none' ? goalId : undefined,
          tags: [],
          icon: selectedIcon,
          frequency,
          selectedDays,
          timeOfDay,
          reminders,
          endDate
        });
        toast({
          title: "Habit added",
          description: `${name} has been added to your habits.`
        });
      }
      
      // Reset and close
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error handling habit:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setName('');
    setMetric('steps');
    setMetricValue('');
    setCustomMetric('');
    setGoalId('none');
    setSelectedIcon('Activity');
    setFrequency('daily');
    setSelectedDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
    setTimeOfDay('anytime');
    setReminders([]);
    setEndDate(undefined);
  };

  const toggleIconSelector = () => {
    setShowIconSelector(!showIconSelector);
  };

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      // Don't allow deselecting if it's the last selected day
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return {
    // Form state
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
    
    // Form actions
    handleSubmit,
    resetForm
  };
};
