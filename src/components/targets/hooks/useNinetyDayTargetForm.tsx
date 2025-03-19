
import { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { NinetyDayTarget, GoalStatus, Goals } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseNinetyDayTargetFormProps {
  editingTarget: NinetyDayTarget | null;
  onClose: () => void;
  user?: any;
  isOpen: boolean;
}

const useNinetyDayTargetForm = ({ editingTarget, onClose, user, isOpen }: UseNinetyDayTargetFormProps) => {
  const { addNinetyDayTarget, updateNinetyDayTarget, threeYearGoals } = useGoal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [threeYearGoalId, setThreeYearGoalId] = useState<string>('');
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  // Reset form when dialog opens/closes or editing target changes
  useEffect(() => {
    if (editingTarget) {
      setTitle(editingTarget.title);
      setDescription(editingTarget.description || '');
      setStartDate(new Date(editingTarget.startDate));
      setEndDate(new Date(editingTarget.endDate));
      setStatus(editingTarget.status);
      setThreeYearGoalId(editingTarget.threeYearGoalId);
    } else {
      setTitle('');
      setDescription('');
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
      setStatus('not_started');
      // Set default parent goal if available
      if (threeYearGoals.length > 0) {
        setThreeYearGoalId(threeYearGoals[0].id);
      } else {
        setThreeYearGoalId('');
      }
    }
  }, [editingTarget, threeYearGoals, isOpen]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !threeYearGoalId) return;
    
    const targetData = {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      status,
      threeYearGoalId
    };
    
    try {
      // Update local state
      let targetId;
      
      if (editingTarget) {
        updateNinetyDayTarget(editingTarget.id, targetData);
        targetId = editingTarget.id;
      } else {
        const newTarget = await addNinetyDayTarget(targetData);
        targetId = newTarget?.id;
      }
      
      // If user is logged in, save to Supabase
      if (user && targetId) {
        await supabase.from('user_entries').insert({
          user_id: user.id,
          content: JSON.stringify({
            action: editingTarget ? 'update' : 'create',
            target_id: targetId,
            target_data: targetData
          }),
          entry_type: editingTarget ? 'milestone_update' : 'milestone_create',
        });
        
        toast({
          title: editingTarget ? 'Milestone updated' : 'Milestone created',
          description: 'Your changes were saved and synced to the cloud',
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast({
        title: 'Error',
        description: 'There was a problem saving your milestone',
        variant: 'destructive',
      });
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    status,
    setStatus,
    threeYearGoalId,
    setThreeYearGoalId,
    startDateOpen,
    setStartDateOpen,
    endDateOpen,
    setEndDateOpen,
    handleSubmit,
    threeYearGoals
  };
};

export default useNinetyDayTargetForm;
