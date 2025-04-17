
import { List } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';
import { saveData } from '@/utils/dataSync';
import { toast } from '@/hooks/use-toast';

export const useListOperations = (
  setCustomLists: React.Dispatch<React.SetStateAction<List[]>>,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedListId: React.Dispatch<React.SetStateAction<string>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  customLists: List[],
  selectedListId: string
) => {
  const addList = async (name: string, color?: string, icon?: string) => {
    setIsLoading(true);
    try {
      const newList: List = {
        id: uuidv4(),
        name,
        color,
        icon,
      };

      const updatedLists = [...customLists, newList];
      setCustomLists(updatedLists);
      setSelectedListId(newList.id);
      
      // Save to storage
      await saveData('lists', 'customLists', updatedLists);
      
      toast({
        title: "Success",
        description: `List "${name}" created successfully`,
      });
      
      return newList;
    } catch (error) {
      console.error('Error adding list:', error);
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateList = async (id: string, updates: Partial<List>) => {
    setIsLoading(true);
    try {
      const listToUpdate = customLists.find(list => list.id === id);
      if (!listToUpdate) throw new Error('List not found');

      const updatedList = { ...listToUpdate, ...updates };
      const updatedLists = customLists.map(list => 
        list.id === id ? updatedList : list
      );

      setCustomLists(updatedLists);
      
      // Save to storage
      await saveData('lists', 'customLists', updatedLists);
      
      toast({
        title: "Success",
        description: `List "${updatedList.name}" updated successfully`,
      });
      
      return updatedList;
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
    setIsLoading(true);
    try {
      const listToDelete = customLists.find(list => list.id === id);
      if (!listToDelete) throw new Error('List not found');

      // Update lists
      const updatedLists = customLists.filter(list => list.id !== id);
      setCustomLists(updatedLists);

      // If the deleted list was selected, select the first custom list or the inbox
      if (selectedListId === id) {
        setSelectedListId(updatedLists.length > 0 ? updatedLists[0].id : 'inbox');
      }

      // Update tasks that were in the deleted list
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => 
          task.listId === id ? { ...task, listId: 'inbox' } : task
        );
        
        // Save updated tasks to storage
        saveData('tasks', 'tasks', updatedTasks);
        
        return updatedTasks;
      });
      
      // Save updated lists to storage
      await saveData('lists', 'customLists', updatedLists);
      
      toast({
        title: "Success",
        description: `List "${listToDelete.name}" deleted successfully`,
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: "Error",
        description: "Failed to delete list",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { addList, updateList, deleteList };
};
