
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
      console.log('Fetching tasks and lists data from Supabase...');
      
      try {
        // Type assertion to ensure type safety
        const [tasksData, listsData] = await Promise.all([
          fetchData('tasks', 'tasks') as Promise<Task[]>,
          fetchData('lists', 'customLists') as Promise<List[]>
        ]);
        
        console.log(`Fetched ${tasksData.length} tasks from Supabase`);
        console.log('Tasks data:', JSON.stringify(tasksData, null, 2));
        
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
        
        console.log(`Processed ${processedTasks.length} tasks successfully from Supabase`);
        setTasks(processedTasks);
        
        console.log(`Loaded ${listsData.length} custom lists from Supabase`);
        console.log('Lists data:', JSON.stringify(listsData, null, 2));
        setCustomLists(listsData);
      } catch (error) {
        console.error('Error loading task data:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks and lists from Supabase.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Immediately fetch data when component mounts
    fetchTaskData();
    
    // Set up a refresh interval to periodically fetch data
    const refreshInterval = setInterval(() => {
      console.log('Refreshing task and list data from Supabase...');
      fetchTaskData();
    }, 30000); // Refresh every 30 seconds for more up-to-date data
    
    // Add a visibility change listener to refresh data when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, refreshing task data from Supabase...');
        fetchTaskData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setTasks, setCustomLists, setIsLoading]);
};
