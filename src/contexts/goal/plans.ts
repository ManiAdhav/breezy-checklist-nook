
import { Plan } from '@/types/task';
import * as GoalService from '@/api/goalService';
import { toast } from '@/hooks/use-toast';

export const fetchPlans = async (
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.getPlans();
    if (response.success && response.data) {
      setPlans(response.data);
    }
  } catch (error) {
    console.error('Error loading plans:', error);
    toast({
      title: "Error",
      description: "Failed to load plans data",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const addPlan = async (
  plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>,
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.createPlan(plan);
    
    if (response.success && response.data) {
      setPlans(prevPlans => [...prevPlans, response.data!]);
      toast({
        title: "Plan added",
        description: "Your plan was added successfully.",
      });
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to add plan');
    }
  } catch (error) {
    console.error('Error adding plan:', error);
    toast({
      title: "Error",
      description: "Failed to add plan",
      variant: "destructive",
    });
    return undefined;
  } finally {
    setIsLoading(false);
  }
};

export const updatePlan = async (
  id: string, 
  updates: Partial<Plan>,
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.updatePlan(id, updates);
    
    if (response.success && response.data) {
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === id ? response.data! : plan
        )
      );
      toast({
        title: "Plan updated",
        description: "Your plan was updated successfully.",
      });
    } else {
      throw new Error(response.error || 'Failed to update plan');
    }
  } catch (error) {
    console.error('Error updating plan:', error);
    toast({
      title: "Error",
      description: "Failed to update plan",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const deletePlan = async (
  id: string,
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.deletePlan(id);
    
    if (response.success) {
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
      
      toast({
        title: "Plan deleted",
        description: "Your plan was deleted successfully.",
        variant: "destructive",
      });
    } else {
      throw new Error(response.error || 'Failed to delete plan');
    }
  } catch (error) {
    console.error('Error deleting plan:', error);
    toast({
      title: "Error",
      description: "Failed to delete plan",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
