
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Priority } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WeeklyTaskFormProps {
  planId: string;
  date: Date;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

type FormValues = z.infer<typeof formSchema>;

const WeeklyTaskForm: React.FC<WeeklyTaskFormProps> = ({ planId, date, onClose }) => {
  const { addTask } = useTask();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium' as Priority,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: values.title,
        description: values.description || '',
        priority: values.priority as Priority,
        completed: false,
        dueDate: date,
        listId: 'inbox',
        planId: planId,
      };
      
      await addTask(taskData);
      toast.success('Task added to your weekly plan');
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 pt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add more details about this task"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-2 space-x-2 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WeeklyTaskForm;
