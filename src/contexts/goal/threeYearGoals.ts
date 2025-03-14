import { ThreeYearGoal, NinetyDayTarget } from '@/types/task';
import * as GoalService from '@/api/goalService';
import { toast } from '@/hooks/use-toast';

export const fetchThreeYearGoals = async (
  setThreeYearGoals: React.Dispatch<React.SetStateAction<ThreeYearGoal[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.getThreeYearGoals();
    if (response.success && response.data) {
      setThreeYearGoals(response.data);
    }
  } catch (error) {
    console.error('Error loading three year goals:', error);
    toast({
      title: "Error",
      description: "Failed to load goals data",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const addThreeYearGoal = async (
  goal: Omit<ThreeYearGoal, 'id' | 'createdAt' | 'updatedAt'>,
  setThreeYearGoals: React.Dispatch<React.SetStateAction<ThreeYearGoal[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.createThreeYearGoal(goal);
    
    if (response.success && response.data) {
      setThreeYearGoals(prevGoals => [...prevGoals, response.data!]);
      toast({
        title: "Goal added",
        description: "Your three-year goal was added successfully.",
      });
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to add goal');
    }
  } catch (error) {
    console.error('Error adding goal:', error);
    toast({
      title: "Error",
      description: "Failed to add goal",
      variant: "destructive",
    });
    return undefined;
  } finally {
    setIsLoading(false);
  }
};

export const updateThreeYearGoal = async (
  id: string, 
  updates: Partial<ThreeYearGoal>,
  setThreeYearGoals: React.Dispatch<React.SetStateAction<ThreeYearGoal[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.updateThreeYearGoal(id, updates);
    
    if (response.success && response.data) {
      setThreeYearGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === id ? response.data! : goal
        )
      );
      toast({
        title: "Goal updated",
        description: "Your three-year goal was updated successfully.",
      });
    } else {
      throw new Error(response.error || 'Failed to update goal');
    }
  } catch (error) {
    console.error('Error updating goal:', error);
    toast({
      title: "Error",
      description: "Failed to update goal",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

export const deleteThreeYearGoal = async (
  id: string,
  setThreeYearGoals: React.Dispatch<React.SetStateAction<ThreeYearGoal[]>>,
  setNinetyDayTargets: React.Dispatch<React.SetStateAction<NinetyDayTarget[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await GoalService.deleteThreeYearGoal(id);
    
    if (response.success) {
      setThreeYearGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
      
      setNinetyDayTargets(prevTargets => prevTargets.filter(target => target.threeYearGoalId !== id));
      
      toast({
        title: "Goal deleted",
        description: "Your three-year goal was deleted successfully.",
        variant: "destructive",
      });
    } else {
      throw new Error(response.error || 'Failed to delete goal');
    }
  } catch (error) {
    console.error('Error deleting goal:', error);
    toast({
      title: "Error",
      description: "Failed to delete goal",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
