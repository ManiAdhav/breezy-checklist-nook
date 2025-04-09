import { useEffect } from 'react';
import * as TaskService from '@/api/taskService';
import { toast } from '@/hooks/use-toast';
import { getStoredTasks, getStoredCustomLists } from '@/api/services/storage/supabase';

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
        // Get data from API services
        const [tasksResponse, listsResponse] = await Promise.all([
          TaskService.getTasks(),
          TaskService.getLists()
        ]);
        
        // Also get direct storage data for debugging and fallback
        const localStorageTasks = await getStoredTasks();
        const localStorageLists = await getStoredCustomLists();
        
        console.log('Direct storage check - Tasks:', localStorageTasks);
        console.log('Direct storage check - Lists:', localStorageLists);
        
        if (tasksResponse.success && tasksResponse.data) {
          console.log(`Loaded ${tasksResponse.data.length} tasks successfully:`, tasksResponse.data);
          setTasks(tasksResponse.data);
        } else {
          console.error('Failed to load tasks:', tasksResponse.error);
          
          // If API failed but we have storage data, use that as fallback
          if (localStorageTasks && localStorageTasks.length > 0) {
            console.log('Using fallback tasks from storage');
            setTasks(localStorageTasks);
          }
        }
        
        if (listsResponse.success && listsResponse.data) {
          console.log(`Loaded ${listsResponse.data.length} custom lists successfully:`, listsResponse.data);
          setCustomLists(listsResponse.data);
        } else {
          console.error('Failed to load lists:', listsResponse.error);
          
          // If API failed but we have storage data, use that as fallback
          if (localStorageLists && localStorageLists.length > 0) {
            console.log('Using fallback lists from storage');
            setCustomLists(localStorageLists);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        
        // Last-ditch effort to get data directly from storage
        try {
          const storageTasks = await getStoredTasks();
          const storageLists = await getStoredCustomLists();
          
          console.log('Error recovery: Attempting to load directly from storage');
          
          if (storageTasks && storageTasks.length > 0) {
            console.log('Error recovery: Using tasks from storage');
            setTasks(storageTasks);
          }
          
          if (storageLists && storageLists.length > 0) {
            console.log('Error recovery: Using lists from storage');
            setCustomLists(storageLists);
          }
        } catch (storageError) {
          console.error('Error recovery failed:', storageError);
        }
        
        toast({
          title: "Error",
          description: "Failed to load tasks and lists. Using cached data if available.",
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
