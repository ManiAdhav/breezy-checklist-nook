
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { useVision } from '@/contexts/VisionContext';
import { GoalStatus, Goals } from '@/types/task';
import { Dialog } from '@/components/ui/dialog';
import { icons } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTask } from '@/contexts/TaskContext';
import GoalForm from './form/GoalForm';
import { Action } from './form/GoalForm';
import { getRandomIcon } from './form/IconSelector';

type GoalType = 'threeYear' | 'ninetyDay';

interface MindMapGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoalType?: GoalType;
  initialGoalId?: string;
  editingGoal?: Goals;
  onSave?: () => void;
}

const MindMapGoalForm: React.FC<MindMapGoalFormProps> = ({
  isOpen,
  onClose,
  initialGoalType = 'threeYear',
  initialGoalId,
  editingGoal,
  onSave,
}) => {
  const { addThreeYearGoal, updateThreeYearGoal, addNinetyDayTarget, updateNinetyDayTarget } = useGoal();
  const { visions } = useVision();
  const { addTask } = useTask();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
  const [status, setStatus] = useState<string>('not_started');
  const [icon, setIcon] = useState<keyof typeof icons>('Target');
  const [threeYearGoalId, setThreeYearGoalId] = useState('');
  const [visionId, setVisionId] = useState('');
  const [actions, setActions] = useState<Action[]>([{ id: Date.now(), text: '' }]);
  
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setStartDate(new Date(editingGoal.startDate));
      setEndDate(new Date(editingGoal.endDate));
      setStatus(editingGoal.status);
      setVisionId(editingGoal.visionId || '');
      // Make sure the icon is valid
      if (editingGoal.icon && editingGoal.icon in icons) {
        setIcon(editingGoal.icon as keyof typeof icons);
      } else {
        setIcon('Target');
      }
    } else if (initialGoalId) {
      // Fetch goal details based on initialGoalId and initialGoalType
      // For simplicity, let's assume you have functions to fetch goal details
      // and populate the form fields accordingly.
    } else {
      resetForm();
    }
  }, [editingGoal, initialGoalId]);
  
  const addAction = () => {
    setActions([...actions, { id: Date.now(), text: '' }]);
  };
  
  const updateAction = (id: number, text: string) => {
    setActions(actions.map(action => action.id === id ? { ...action, text } : action));
  };
  
  const removeAction = (id: number) => {
    setActions(actions.filter(action => action.id !== id));
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    setStatus('not_started');
    setIcon(getRandomIcon());
    setVisionId('');
    setActions([{ id: Date.now(), text: '' }]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Start and end dates are required",
        variant: "destructive",
      });
      return;
    }
    
    // Check if any actions are empty
    const validActions = actions.filter(action => action.text.trim() !== '');
    
    let goalId: string | undefined;
    
    // Create the goal data
    const goalData = {
      title,
      description,
      startDate,
      endDate,
      status: status as GoalStatus,
      icon,
      visionId: visionId !== 'none' ? visionId : undefined,
    };
    
    // Update or create the goal
    if (editingGoal) {
      updateThreeYearGoal(editingGoal.id, goalData);
      goalId = editingGoal.id;
      
      toast({
        title: "Goal updated",
        description: "Your goal has been updated in the mind map"
      });
    } else if (initialGoalId) {
      if (initialGoalType === 'threeYear') {
        updateThreeYearGoal(initialGoalId, goalData);
      } else {
        updateNinetyDayTarget(initialGoalId, {
          ...goalData,
          threeYearGoalId,
        });
      }
      
      goalId = initialGoalId;
      
      toast({
        title: "Goal updated",
        description: "Your goal has been updated in the mind map"
      });
    } else {
      try {
        const result = await addThreeYearGoal(goalData);
        goalId = result?.id;
        toast({
          title: "Goal created",
          description: "Your new goal has been added to the mind map"
        });
      } catch (error) {
        console.error("Error creating goal:", error);
        toast({
          title: "Error",
          description: "Failed to create goal",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Create actions for this goal if we have a valid goal ID
    if (goalId && validActions.length > 0) {
      try {
        // Now create tasks for each action
        for (const action of validActions) {
          await addTask({
            title: action.text,
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            goalId: goalId,
            startDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            isAction: true,
          });
        }
        
        toast({
          title: "Actions created",
          description: `${validActions.length} action(s) have been added to your tasks`
        });
      } catch (error) {
        console.error("Error creating actions:", error);
        toast({
          title: "Error",
          description: "Failed to create actions",
          variant: "destructive",
        });
      }
    }
    
    // Reset form and close
    resetForm();
    if (onSave) onSave();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <GoalForm
        title={title}
        description={description}
        startDate={startDate}
        endDate={endDate}
        status={status}
        icon={icon}
        visionId={visionId}
        actions={actions}
        isEditing={!!editingGoal || !!initialGoalId}
        
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onStatusChange={setStatus}
        onIconChange={setIcon}
        onVisionChange={setVisionId}
        
        onAddAction={addAction}
        onUpdateAction={updateAction}
        onRemoveAction={removeAction}
        
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
};

export default MindMapGoalForm;
