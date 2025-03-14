
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Task } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface AddActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddActionDialog: React.FC<AddActionDialogProps> = ({ open, onOpenChange }) => {
  const { addTask } = useTask();
  const { threeYearGoals, plans, ninetyDayTargets } = useGoal();
  
  const [newActionTitle, setNewActionTitle] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [actionStartDate, setActionStartDate] = useState<Date>(new Date());
  const [actionEndDate, setActionEndDate] = useState<Date>(addDays(new Date(), 7));
  
  const getPlansForSelect = () => {
    // Get all plans
    return plans.map(plan => {
      // Find the associated target
      const target = ninetyDayTargets.find(target => target.id === plan.ninetyDayTargetId);
      // Find the associated goal
      const goal = target ? threeYearGoals.find(goal => goal.id === target.threeYearGoalId) : null;
      
      return {
        ...plan,
        targetName: target?.title || 'Unknown Target',
        goalName: goal?.title || 'Unknown Goal'
      };
    });
  };
  
  const resetForm = () => {
    setNewActionTitle('');
    setSelectedPlanId('');
    setActionStartDate(new Date());
    setActionEndDate(addDays(new Date(), 7));
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

    if (!selectedPlanId) {
      toast({
        title: "Error",
        description: "Please select a plan for this action",
        variant: "destructive",
      });
      return;
    }

    const newAction: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newActionTitle,
      completed: false,
      priority: 'medium',
      listId: 'inbox',
      planId: selectedPlanId,
      startDate: actionStartDate,
      dueDate: actionEndDate,
      isAction: true,
    };

    try {
      await addTask(newAction);
      
      toast({
        title: "Action added",
        description: "Your new action has been added successfully",
      });
      
      // Reset form
      resetForm();
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Action</DialogTitle>
        </DialogHeader>
        
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
          
          <div className="space-y-2">
            <Label htmlFor="plan-select">Associated Plan</Label>
            <Select 
              value={selectedPlanId} 
              onValueChange={setSelectedPlanId}
            >
              <SelectTrigger id="plan-select">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {getPlansForSelect().map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.title} ({plan.goalName} → {plan.targetName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {format(actionStartDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={actionStartDate}
                    onSelect={(date) => date && setActionStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {format(actionEndDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={actionEndDate}
                    onSelect={(date) => date && setActionEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddAction}>Add Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddActionDialog;
