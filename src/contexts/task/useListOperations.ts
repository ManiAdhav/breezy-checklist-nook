import { List } from '@/types/task';
import * as TaskService from '@/api/taskService';
import { toast } from '@/hooks/use-toast';

export const useListOperations = (
  setCustomLists: React.Dispatch<React.SetStateAction<List[]>>,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedListId: React.Dispatch<React.SetStateAction<string>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  customLists: List[],
  selectedListId: string
) => {
  // List operations
  const addList = async (list: Omit<List, 'id'>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.createList(list);
      
      if (response.success && response.data) {
        // Ensure we're adding a valid list object to the state
        setCustomLists(prevLists => [...prevLists, response.data!]);
        setSelectedListId(response.data!.id);
        
        // Log the list creation for debugging
        console.log('List created:', response.data);
        
        toast({
          title: "List added",
          description: `"${list.name}" was added successfully.`,
        });
      } else {
        throw new Error(response.error || 'Failed to add list');
      }
    } catch (error) {
      console.error('Error adding list:', error);
      toast({
        title: "Error",
        description: "Failed to add list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateList = async (id: string, updates: Partial<List>) => {
    setIsLoading(true);
    try {
      const response = await TaskService.updateList(id, updates);
      
      if (response.success && response.data) {
        setCustomLists(prevLists => 
          prevLists.map(list => 
            list.id === id ? response.data! : list
          )
        );
        toast({
          title: "List updated",
          description: "Your list was updated successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to update list');
      }
    } catch (error) {
      console.error('Error updating list:', error);
      toast({
        title: "Error",
        description: "Failed to update list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteList = async (id: string) => {
    // Find the list name before deletion for the toast
    const listToDelete = customLists.find(list => list.id === id);
    
    setIsLoading(true);
    try {
      const response = await TaskService.deleteList(id);
      
      if (response.success) {
        setCustomLists(prevLists => prevLists.filter(list => list.id !== id));
        
        // If the deleted list was selected, switch to inbox
        if (selectedListId === id) {
          setSelectedListId('inbox');
        }
        
        // Update task references in the state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.listId === id 
              ? { ...task, listId: 'inbox' } 
              : task
          )
        );
        
        toast({
          title: "List deleted",
          description: `"${listToDelete?.name}" was deleted and its tasks moved to Inbox.`,
          variant: "destructive",
        });
      } else {
        throw new Error(response.error || 'Failed to delete list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: "Error",
        description: "Failed to delete list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { addList, updateList, deleteList };
};
