
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useGoal } from '@/hooks/useGoalContext';
import { NinetyDayTarget, GoalStatus } from '@/types/task';

export function useMilestones(goalId: string) {
  const { ninetyDayTargets, updateNinetyDayTarget, addNinetyDayTarget, deleteNinetyDayTarget } = useGoal();
  
  // Filter milestones (90-day targets) related to this goal
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goalId);
  
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<NinetyDayTarget | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneDate, setMilestoneDate] = useState<Date>(new Date());
  const [milestoneEndDate, setMilestoneEndDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
  const [milestoneStatus, setMilestoneStatus] = useState<GoalStatus>('not_started');
  
  const getStatusClasses = (status: GoalStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100';
      case 'in_progress':
        return 'text-blue-500 bg-blue-100';
      case 'abandoned':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };
  
  const toggleMilestoneStatus = (id: string) => {
    const milestone = ninetyDayTargets.find(target => target.id === id);
    if (!milestone) return;
    
    const newStatus = 
      milestone.status === 'not_started' ? 'in_progress' :
      milestone.status === 'in_progress' ? 'completed' : 'not_started';
    
    updateNinetyDayTarget(id, { status: newStatus });
    
    toast({
      title: "Milestone status updated",
      description: `Milestone is now ${newStatus.replace('_', ' ')}`,
    });
  };

  const openCreateMilestoneDialog = () => {
    setEditingMilestone(null);
    setMilestoneTitle('');
    setMilestoneDescription('');
    setMilestoneDate(new Date());
    setMilestoneEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    setMilestoneStatus('not_started');
    setIsMilestoneDialogOpen(true);
  };

  const openEditMilestoneDialog = (milestone: NinetyDayTarget) => {
    setEditingMilestone(milestone);
    setMilestoneTitle(milestone.title);
    setMilestoneDescription(milestone.description || '');
    setMilestoneDate(new Date(milestone.startDate));
    setMilestoneEndDate(new Date(milestone.endDate));
    setMilestoneStatus(milestone.status);
    setIsMilestoneDialogOpen(true);
  };

  const handleSaveMilestone = async () => {
    if (!milestoneTitle.trim()) {
      toast({
        title: "Error",
        description: "Milestone title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingMilestone) {
        // Update existing milestone
        await updateNinetyDayTarget(editingMilestone.id, {
          title: milestoneTitle,
          description: milestoneDescription || undefined,
          startDate: milestoneDate,
          endDate: milestoneEndDate,
          status: milestoneStatus
        });
        
        toast({
          title: "Milestone updated",
          description: "Your milestone has been updated successfully",
        });
      } else {
        // Create new milestone
        await addNinetyDayTarget({
          title: milestoneTitle,
          description: milestoneDescription || undefined,
          startDate: milestoneDate,
          endDate: milestoneEndDate,
          status: milestoneStatus,
          threeYearGoalId: goalId
        });
        
        toast({
          title: "Milestone created",
          description: "Your new milestone has been created",
        });
      }
      
      setIsMilestoneDialogOpen(false);
    } catch (error) {
      console.error("Error saving milestone:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your milestone",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    try {
      await deleteNinetyDayTarget(id);
      
      toast({
        title: "Milestone deleted",
        description: "Your milestone has been deleted",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting your milestone",
        variant: "destructive",
      });
    }
  };

  return {
    goalMilestones,
    isMilestoneDialogOpen,
    setIsMilestoneDialogOpen,
    editingMilestone,
    milestoneTitle,
    setMilestoneTitle,
    milestoneDescription,
    setMilestoneDescription,
    milestoneDate,
    setMilestoneDate,
    milestoneEndDate,
    setMilestoneEndDate,
    milestoneStatus,
    setMilestoneStatus,
    getStatusClasses,
    toggleMilestoneStatus,
    openCreateMilestoneDialog,
    openEditMilestoneDialog,
    handleSaveMilestone,
    handleDeleteMilestone
  };
}
