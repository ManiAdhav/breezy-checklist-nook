
import { useState } from 'react';
import { Task, List } from '@/types/task';
import { saveData } from '@/utils/dataSync';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useTaskOperations = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customLists, setCustomLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Task operations
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const newTask: Task = {
        ...task,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      
      // Save tasks to storage
      await saveData('tasks', 'tasks', newTasks);
      
      return newTask;
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
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      );
      
      setTasks(updatedTasks);
      
      // Save tasks to storage
      await saveData('tasks', 'tasks', updatedTasks);
      
      return updatedTasks.find(task => task.id === id);
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
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      
      // Save tasks to storage
      await saveData('tasks', 'tasks', updatedTasks);
      
      return true;
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
      const task = tasks.find(t => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }
      
      const updatedTask = { ...task, completed: !task.completed, updatedAt: new Date() };
      const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
      
      setTasks(updatedTasks);
      
      // Save tasks to storage
      await saveData('tasks', 'tasks', updatedTasks);
      
      return updatedTask;
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
