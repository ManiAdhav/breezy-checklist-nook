import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Habit } from '@/types/habit';
import { useHabit } from '@/contexts/HabitContext';
import { Goal } from '@/types/goal';
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
});

// Define the form data type based on the schema
export type HabitFormData = z.infer<typeof habitFormSchema>;

// Adding support for onSuccess callback
export const useHabitForm = (
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  editHabit?: Habit,
  onSuccess?: () => void
) => {
  const { addHabit, updateHabit } = useHabit();
  
  // Initialize the form with react-hook-form
  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: editHabit?.name || "",
      description: editHabit?.description || "",
      metric: editHabit?.metric || "",
      target: editHabit?.target || 1,
      frequency: editHabit?.frequency || 'daily',
      startDate: editHabit?.startDate || new Date(),
      endDate: editHabit?.endDate || undefined,
      goalId: editHabit?.goalId || undefined,
    },
    mode: "onChange",
  });

  // Function to handle form submission
  const handleSubmit = async (data: HabitFormData) => {
    try {
      if (editHabit) {
        // Update existing habit
        updateHabit(editHabit.id, data);
        toast({
          title: "Success",
          description: "Habit updated successfully.",
        });
      } else {
        // Add new habit
        addHabit(data);
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
    onSubmit: form.handleSubmit(handleSubmit),
  };
};
