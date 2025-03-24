
import { useState, useEffect } from 'react';
import { Task, Priority } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { toast } from '@/hooks/use-toast';

interface UseTaskFormProps {
  editingTask: Task | null;
  defaultDueDate?: Date;
  onClose: () => void;
}

export const useTaskForm = ({ editingTask, defaultDueDate, onClose }: UseTaskFormProps) => {
  const { addTask, updateTask, lists, customLists } = useTask();
  
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>('none');
  const [listId, setListId] = useState('inbox');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with editingTask data or defaults
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setNotes(editingTask.notes || '');
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
      setListId(editingTask.listId);
      setSelectedGoalId(editingTask.goalId || '');
    } else {
      // Reset form for new task
      setTitle('');
      setNotes('');
      setDueDate(defaultDueDate);
      setPriority('none');
      setListId('inbox');
      setSelectedGoalId('');
    }
  }, [editingTask, defaultDueDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    const taskData = {
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate,
      priority,
      listId,
      goalId: selectedGoalId || undefined,
      completed: editingTask ? editingTask.completed : false,
    };
    
    try {
      if (editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask(taskData);
      }
      
      onClose();
      
      toast({
        title: editingTask ? "Task updated" : "Task added",
        description: editingTask 
          ? "Your task was updated successfully" 
          : "Your task was added successfully",
      });
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allLists = [...lists, ...customLists];
  
  return {
    title,
    setTitle,
    notes,
    setNotes,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    listId,
    setListId,
    selectedGoalId,
    setSelectedGoalId,
    isSubmitting,
    handleSubmit,
    allLists,
    isEditing: !!editingTask
  };
};
