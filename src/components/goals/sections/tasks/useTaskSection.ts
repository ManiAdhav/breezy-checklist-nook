
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Task, Priority } from '@/types/task';

export function useTaskSection(goalId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date>(new Date());
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  
  const getPriorityClasses = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };
  
  const toggleTaskStatus = (id: string) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };
  
  const moveTask = (id: string, direction: 'up' | 'down') => {
    const index = tasks.findIndex(t => t.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === tasks.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newTasks = [...tasks];
    [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];
    setTasks(newTasks);
  };

  const openCreateTaskDialog = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDueDate(new Date());
    setTaskPriority('medium');
    setIsTaskDialogOpen(true);
  };

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDueDate(new Date(task.dueDate || Date.now()));
    setTaskPriority(task.priority);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (editingTask) {
      // Update existing task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id 
            ? { 
                ...task, 
                title: taskTitle, 
                dueDate: taskDueDate, 
                priority: taskPriority 
              }
            : task
        )
      );
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: `t${Date.now()}`,
        title: taskTitle,
        dueDate: taskDueDate,
        completed: false,
        priority: taskPriority,
        listId: '', // Required by Task type
        createdAt: new Date(),
        updatedAt: new Date(),
        goalId: goalId
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast({
        title: "Task created",
        description: "Your new task has been created",
      });
    }
    setIsTaskDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted",
      variant: "destructive",
    });
  };

  return {
    tasks,
    isTaskDialogOpen,
    setIsTaskDialogOpen,
    editingTask,
    taskTitle,
    setTaskTitle,
    taskDueDate,
    setTaskDueDate,
    taskPriority,
    setTaskPriority,
    getPriorityClasses,
    toggleTaskStatus,
    moveTask,
    openCreateTaskDialog,
    openEditTaskDialog,
    handleSaveTask,
    handleDeleteTask
  };
}
