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
      try {
        const [tasksResponse, listsResponse] = await Promise.all([
          TaskService.getTasks(),
          TaskService.getLists()
        ]);
        
        if (tasksResponse.success && tasksResponse.data) {
          setTasks(tasksResponse.data);
        }
        
        if (listsResponse.success && listsResponse.data) {
          setCustomLists(listsResponse.data);
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
  }, [setTasks, setCustomLists, setIsLoading]);
};

