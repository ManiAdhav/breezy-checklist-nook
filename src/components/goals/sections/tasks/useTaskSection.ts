
import { useState, useEffect } from 'react';
import { Task, Priority } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';

export function useTaskSection(goalId: string) {
  const { tasks: allTasks, addTask, updateTask, deleteTask, toggleTaskCompletion: toggleGlobalTaskCompletion } = useTask();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<Date>(new Date());
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  
  // Load tasks from the global context whenever allTasks changes or goalId changes
  useEffect(() => {
    if (!goalId || !allTasks) return;
    
    const filteredTasks = allTasks.filter(task => task.goalId === goalId);
    console.log(`Loading ${filteredTasks.length} tasks for goal ${goalId}`);
    setTasks(filteredTasks);
  }, [allTasks, goalId]);
  
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
    console.log(`Toggling completion for task ${id}`);
    // Use the global task context to toggle task completion
    toggleGlobalTaskCompletion(id);
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
    
    // Update task order in database later if needed
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
      return;
    }

    console.log(`Saving task for goal ${goalId}: ${taskTitle}`);
    
    if (editingTask) {
      // Update existing task using global context
      updateTask(editingTask.id, { 
        title: taskTitle, 
        dueDate: taskDueDate, 
        priority: taskPriority 
      });
    } else {
      // Create new task using global context
      addTask({
        title: taskTitle,
        dueDate: taskDueDate,
        completed: false,
        priority: taskPriority,
        listId: 'inbox',
        goalId: goalId
      });
    }
    setIsTaskDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    console.log(`Deleting task ${id}`);
    // Use the global task context to delete the task
    deleteTask(id);
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
