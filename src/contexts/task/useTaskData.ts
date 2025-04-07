
import { useEffect } from 'react';
import * as TaskService from '@/api/taskService';
import { toast } from '@/hooks/use-toast';

export const useTaskData = (
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
  setCustomLists: React.Dispatch<React.SetStateAction<any[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log('Fetching tasks and lists data...');
      
      try {
        const [tasksResponse, listsResponse] = await Promise.all([
          TaskService.getTasks(),
          TaskService.getLists()
        ]);
        
        if (tasksResponse.success && tasksResponse.data) {
          console.log(`Loaded ${tasksResponse.data.length} tasks successfully`);
          setTasks(tasksResponse.data);
        } else {
          console.error('Failed to load tasks:', tasksResponse.error);
        }
        
        if (listsResponse.success && listsResponse.data) {
          console.log(`Loaded ${listsResponse.data.length} custom lists successfully:`, listsResponse.data);
          setCustomLists(listsResponse.data);
        } else {
          console.error('Failed to load lists:', listsResponse.error);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks and lists",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up a refresh interval to periodically fetch data
    const refreshInterval = setInterval(() => {
      console.log('Refreshing task and list data...');
      fetchData();
    }, 60000); // Refresh every minute
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [setTasks, setCustomLists, setIsLoading]);
};
