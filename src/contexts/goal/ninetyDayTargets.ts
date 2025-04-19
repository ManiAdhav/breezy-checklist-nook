
import { NinetyDayTarget, Plan } from '@/types/task';
import * as GoalService from '@/api/goalService';
import { toast } from '@/hooks/use-toast';

export const fetchNinetyDayTargets = async (
  setNinetyDayTargets: React.Dispatch<React.SetStateAction<NinetyDayTarget[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.getNinetyDayTargets();
    if (response.success && response.data) {
      setNinetyDayTargets(response.data);
    }
  } catch (error) {
    console.error('Error loading ninety day targets:', error);
    toast({
      title: "Error",
      description: "Failed to load targets data",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const addNinetyDayTarget = async (
  target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>,
  setNinetyDayTargets: React.Dispatch<React.SetStateAction<NinetyDayTarget[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.createNinetyDayTarget(target);
    
    if (response.success && response.data) {
      setNinetyDayTargets(prevTargets => [...prevTargets, response.data!]);
      toast({
        title: "Target added",
        description: "Your 90-day target was added successfully.",
      });
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to add target');
    }
  } catch (error) {
    console.error('Error adding target:', error);
    toast({
      title: "Error",
      description: "Failed to add target",
      variant: "destructive",
    });
    return undefined;
  } finally {
    setIsLoading(false);
  }
};

export const updateNinetyDayTarget = async (
  id: string, 
  updates: Partial<NinetyDayTarget>,
  setNinetyDayTargets: React.Dispatch<React.SetStateAction<NinetyDayTarget[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.updateNinetyDayTarget(id, updates);
    
    if (response.success && response.data) {
      setNinetyDayTargets(prevTargets => 
        prevTargets.map(target => 
          target.id === id ? response.data! : target
        )
      );
      toast({
        title: "Target updated",
        description: "Your 90-day target was updated successfully.",
      });
    } else {
      throw new Error(response.error || 'Failed to update target');
    }
  } catch (error) {
    console.error('Error updating target:', error);
    toast({
      title: "Error",
      description: "Failed to update target",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const deleteNinetyDayTarget = async (
  id: string,
  setNinetyDayTargets: React.Dispatch<React.SetStateAction<NinetyDayTarget[]>>,
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.deleteNinetyDayTarget(id);
    
    if (response.success) {
      setNinetyDayTargets(prevTargets => prevTargets.filter(target => target.id !== id));
      
      setPlans(prevPlans => prevPlans.filter(plan => plan.ninetyDayTargetId !== id));
      
      toast({
        title: "Target deleted",
        description: "Your 90-day target was deleted successfully.",
        variant: "destructive",
      });
    } else {
      throw new Error(response.error || 'Failed to delete target');
    }
  } catch (error) {
    console.error('Error deleting target:', error);
    toast({
      title: "Error",
      description: "Failed to delete target",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
