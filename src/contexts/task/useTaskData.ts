
import { useEffect } from 'react';
import { fetchData } from '@/utils/dataSync';
import { toast } from '@/hooks/use-toast';

export const useTaskData = (
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
  setCustomLists: React.Dispatch<React.SetStateAction<any[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Load data when component mounts
  useEffect(() => {
    const fetchTaskData = async () => {
      setIsLoading(true);
      console.log('Fetching tasks and lists data...');
      
      try {
        // Get data using our consistent sync utilities
        const [tasksData, listsData] = await Promise.all([
          fetchData('tasks', 'tasks'),
          fetchData('lists', 'customLists')
        ]);
        
        // Process tasks date fields
        const processedTasks = tasksData.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          startDate: task.startDate ? new Date(task.startDate) : undefined
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
