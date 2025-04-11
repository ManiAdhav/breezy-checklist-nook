
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Habit } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import { toast } from '@/hooks/use-toast';

// Define the schema for the habit form
const habitFormSchema = z.object({
  name: z.string().min(2, {
    message: "Habit name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  metric: z.string().min(1, {
    message: "Metric is required.",
  }),
  target: z.number().min(1, {
    message: "Target must be at least 1.",
  }),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  startDate: z.date(),
  endDate: z.date().optional(),
  goalId: z.string().optional(),
  icon: z.string().optional(),
  selectedDays: z.array(z.string()).optional(),
  timeOfDay: z.string().optional(),
  reminders: z.array(z.string()).optional(),
});

// Define the form data type based on the schema
export type HabitFormData = z.infer<typeof habitFormSchema>;

// Hook for managing form state and submissions
export const useHabitForm = (
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  editHabit?: Habit,
  onSuccess?: () => void
) => {
  const { addHabit, updateHabit } = useHabit();
  const [selectedIcon, setSelectedIcon] = useState<string>(editHabit?.icon || 'Activity');
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(editHabit?.selectedDays || []);
  const [timeOfDay, setTimeOfDay] = useState<string>(editHabit?.timeOfDay || '');
  const [reminders, setReminders] = useState<string[]>(editHabit?.reminders || []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Initialize form with default values
  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: editHabit?.name || "",
      description: editHabit?.description || "",
      metric: editHabit?.metric || "",
      target: editHabit?.target || 1,
      frequency: (editHabit?.frequency as 'daily' | 'weekly' | 'monthly') || 'daily',
      startDate: new Date(),
      endDate: editHabit?.endDate,
      goalId: editHabit?.goalId || undefined,
      icon: editHabit?.icon || 'Activity',
      selectedDays: editHabit?.selectedDays || [],
      timeOfDay: editHabit?.timeOfDay || '',
      reminders: editHabit?.reminders || [],
    },
    mode: "onChange",
  });
  
  const toggleIconSelector = () => setShowIconSelector(!showIconSelector);
  
  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (data: HabitFormData) => {
    try {
      // Merge form data with other state values
      const habitData = {
        ...data,
        icon: selectedIcon,
        selectedDays,
        timeOfDay,
        reminders,
        tags: [], // Add empty tags array to satisfy the type requirement
      };
      
      if (editHabit) {
        // Update existing habit
        updateHabit(editHabit.id, habitData);
        toast({
          title: "Success",
          description: "Habit updated successfully.",
        });
      } else {
        // Add new habit
        addHabit(habitData);
        toast({
          title: "Success",
          description: "Habit added successfully.",
        });
      }
      
      form.reset();
      onOpenChange(false);
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
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
    onSubmit: form.handleSubmit(handleSubmit),
  };
};
