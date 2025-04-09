
import { useState } from 'react';
import { Task, List } from '@/types/task';
import * as TaskService from '@/api/taskService';
import { toast } from '@/hooks/use-toast';
import { storeTasks } from '@/api/services/storage/supabase/tasks';

export const useTaskOperations = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customLists, setCustomLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Task operations
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.createTask(task);
      
      if (response.success && response.data) {
        const newTasks = [...tasks, response.data];
        setTasks(newTasks);
        
        // Also ensure tasks are saved to storage directly
        await storeTasks(newTasks);
        
        toast({
          title: "Task added",
          description: "Your task was added successfully.",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.updateTask(id, updates);
      
      if (response.success && response.data) {
        const updatedTasks = tasks.map(task => 
          task.id === id ? response.data! : task
        );
        setTasks(updatedTasks);
        
        // Also ensure tasks are saved to storage directly
        await storeTasks(updatedTasks);
        
        toast({
          title: "Task updated",
          description: "Your task was updated successfully.",
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await TaskService.deleteTask(id);
      
      if (response.success) {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        
        // Also ensure tasks are saved to storage directly
        await storeTasks(updatedTasks);
        
        toast({
          title: "Task deleted",
          description: "Your task was deleted successfully.",
          variant: "destructive",
        });
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const response = await TaskService.toggleTaskCompletion(id);
      
      if (response.success && response.data) {
        const updatedTasks = tasks.map(task => 
          task.id === id ? response.data! : task
        );
        setTasks(updatedTasks);
        
        // Also ensure tasks are saved to storage directly
        await storeTasks(updatedTasks);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to toggle task completion');
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { 
    tasks, 
    setTasks, 
    customLists, 
    setCustomLists, 
    isLoading, 
    setIsLoading, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion 
  };
};
