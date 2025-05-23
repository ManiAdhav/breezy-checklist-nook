
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Task } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import ActionGoalSelector from './ActionGoalSelector';
import ActionDatePicker from './ActionDatePicker';

interface ActionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ActionForm: React.FC<ActionFormProps> = ({ onSuccess, onCancel }) => {
  const { addTask } = useTask();
  const [newActionTitle, setNewActionTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [actionStartDate, setActionStartDate] = useState<Date>(new Date());
  const [actionEndDate, setActionEndDate] = useState<Date>(addDays(new Date(), 7));

  const handleGoalChange = (goalId: string) => {
    setSelectedGoalId(goalId);
  };

  const handleAddAction = async () => {
    if (!newActionTitle.trim()) {
      toast({
        title: "Error",
        description: "Action title is required",
        variant: "destructive",
      });
      return;
    }

    // Check if goal is selected
    if (!selectedGoalId) {
      toast({
        title: "Error",
        description: "Please select a goal for this action",
        variant: "destructive",
      });
      return;
    }

    const newAction: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newActionTitle,
      completed: false,
      priority: 'medium',
      listId: 'inbox',
      goalId: selectedGoalId,
      startDate: actionStartDate,
      dueDate: actionEndDate,
      isAction: true,
    };

    try {
      await addTask(newAction);
      onSuccess();
    } catch (error) {
      console.error("Error adding action:", error);
      toast({
        title: "Error",
        description: "Failed to add action",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="action-title">Action Name</Label>
          <Input
            id="action-title"
            value={newActionTitle}
            onChange={(e) => setNewActionTitle(e.target.value)}
            placeholder="Enter action title"
          />
        </div>
        
        <ActionGoalSelector 
          selectedGoalId={selectedGoalId} 
          onGoalChange={handleGoalChange} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <ActionDatePicker 
            label="Start Date" 
            date={actionStartDate} 
            onDateChange={setActionStartDate} 
          />
          
          <ActionDatePicker 
            label="End Date" 
            date={actionEndDate} 
            onDateChange={setActionEndDate} 
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleAddAction}>Add Action</Button>
      </DialogFooter>
    </>
  );
};

export default ActionForm;
