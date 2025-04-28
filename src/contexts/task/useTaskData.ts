import { useEffect } from 'react';
import { fetchData } from '@/utils/dataSync';
import { toast } from '@/hooks/use-toast';
import { Task, List } from '@/types/task';

export const useTaskData = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setCustomLists: React.Dispatch<React.SetStateAction<List[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const fetchTaskData = async () => {
      setIsLoading(true);
      console.log('Fetching tasks and lists data...');
      
      try {
        // Type assertion to ensure type safety
        const [tasksData, listsData] = await Promise.all([
          fetchData('tasks', 'tasks') as Promise<Task[]>,
          fetchData('lists', 'customLists') as Promise<List[]>
        ]);
        
        // Process tasks date fields
        const processedTasks = tasksData.map(task => ({
          ...(task as Task),
          createdAt: task.createdAt instanceof Date 
            ? task.createdAt 
            : new Date(task.createdAt || Date.now()),
          updatedAt: task.updatedAt instanceof Date 
            ? task.updatedAt 
            : new Date(task.updatedAt || Date.now()),
          dueDate: task.dueDate 
            ? (task.dueDate instanceof Date 
              ? task.dueDate 
              : new Date(task.dueDate)) 
            : undefined,
          startDate: task.startDate 
            ? (task.startDate instanceof Date 
              ? task.startDate 
              : new Date(task.startDate)) 
            : undefined
        }));
        
        console.log(`Loaded ${processedTasks.length} tasks successfully:`, processedTasks);
        setTasks(processedTasks);
        
        console.log(`Loaded ${listsData.length} custom lists successfully:`, listsData);
        setCustomLists(listsData);
      } catch (error) {
        console.error('Error loading task data:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks and lists. Using cached data if available.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskData();
    
    // Set up a refresh interval to periodically fetch data
    const refreshInterval = setInterval(() => {
      console.log('Refreshing task and list data...');
      fetchTaskData();
    }, 300000); // Refresh every 5 minutes instead of every minute to reduce load
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [setTasks, setCustomLists, setIsLoading]);
};
