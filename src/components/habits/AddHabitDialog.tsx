
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHabit } from '@/contexts/HabitContext';
import { useTask } from '@/contexts/TaskContext';
import { Habit } from '@/types/habit';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goals } from '@/types/task';
import TagSelector from '@/components/tags/TagSelector';
import { toast } from '@/hooks/use-toast';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editHabit?: Habit;
}

type FormValues = {
  name: string;
  metricType: 'count' | 'duration' | 'boolean';
  metricUnit: string;
  metricTarget: number;
  goalId?: string;
  tags: string[];
};

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({ 
  open, 
  onOpenChange,
  editHabit
}) => {
  const { addHabit, updateHabit } = useHabit();
  const { goals } = useTask();

  const form = useForm<FormValues>({
    defaultValues: editHabit ? {
      name: editHabit.name,
      metricType: editHabit.metric.type,
      metricUnit: editHabit.metric.unit,
      metricTarget: editHabit.metric.target,
      goalId: editHabit.goalId,
      tags: editHabit.tags
    } : {
      name: '',
      metricType: 'count',
      metricUnit: 'times',
      metricTarget: 1,
      tags: []
    }
  });

  const onSubmit = (values: FormValues) => {
    try {
      if (editHabit) {
        updateHabit(editHabit.id, {
          name: values.name,
          metric: {
            type: values.metricType,
            unit: values.metricUnit,
            target: values.metricTarget
          },
          goalId: values.goalId,
          tags: values.tags
        });
        
        toast({
          title: "Habit updated",
          description: "Your habit has been updated successfully."
        });
      } else {
        addHabit({
          name: values.name,
          metric: {
            type: values.metricType,
            unit: values.metricUnit,
            target: values.metricTarget
          },
          goalId: values.goalId,
          tags: values.tags
        });
        
        toast({
          title: "Habit created",
          description: "Your new habit has been created successfully."
        });
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving habit:', error);
      toast({
        title: "Error",
        description: "There was an error saving your habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Generate suggested units based on metric type
  const suggestedUnits = {
    count: ['times', 'glasses', 'pages', 'steps', 'reps'],
    duration: ['minutes', 'hours'],
    boolean: ['completed']
  };

  // Get filtered goals (Active goals)
  const activeGoals = Array.isArray(goals) 
    ? goals.filter(goal => goal.status !== 'completed' && goal.status !== 'abandoned')
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editHabit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Habit name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Drink Water, Read, Exercise" {...field} />
                  </FormControl>
                  <FormDescription>
                    What habit do you want to track?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metricType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset unit when type changes
                        const defaultUnit = suggestedUnits[value as keyof typeof suggestedUnits][0];
                        form.setValue('metricUnit', defaultUnit);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="boolean">Yes/No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How will you measure progress?
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="metricTarget"
                rules={{ required: "Target is required", min: { value: 1, message: "Target must be at least 1" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Daily goal amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="metricUnit"
              rules={{ required: "Unit is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input placeholder="e.g., glasses, pages, minutes" {...field} />
                    </FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {form.watch('metricType') && 
                          suggestedUnits[form.watch('metricType') as keyof typeof suggestedUnits].map(unit => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription>
                    How to measure (e.g., glasses, minutes, pages)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {activeGoals.length > 0 && (
              <FormField
                control={form.control}
                name="goalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Goal (Optional)</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {activeGoals.map((goal: Goals) => (
                          <SelectItem key={goal.id} value={goal.id}>
                            {goal.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Connect this habit to one of your goals
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector
                      selectedTagIds={field.value}
                      onTagsChange={field.onChange}
                      enableAutoCreate={true}
                    />
                  </FormControl>
                  <FormDescription>
                    Add tags to categorize your habit
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editHabit ? 'Save Changes' : 'Create Habit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
