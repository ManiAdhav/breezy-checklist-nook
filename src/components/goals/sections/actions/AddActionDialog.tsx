
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { format, addDays } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

interface AddActionDialogProps {
  goalId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddActionDialog: React.FC<AddActionDialogProps> = ({ 
  goalId, 
  isOpen, 
  onOpenChange 
}) => {
  const { addTask } = useTask();
  const { threeYearGoals, plans, ninetyDayTargets } = useGoal();
  
  const [newActionTitle, setNewActionTitle] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [actionStartDate, setActionStartDate] = useState<Date>(new Date());
  const [actionEndDate, setActionEndDate] = useState<Date>(addDays(new Date(), 7));
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  const getPlansForGoal = () => {
    if (!goal) return [];
    
    // Get all targets for this goal
    const targetsForGoal = ninetyDayTargets.filter(target => 
      target.threeYearGoalId === goalId
    );
    
    // Get all plans for these targets
    const plansForTargets = plans.filter(plan => 
      targetsForGoal.some(target => target.id === plan.ninetyDayTargetId)
    );
    
    return plansForTargets;
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
      
      resetForm();
    } catch (error) {
      console.error("Error adding action:", error);
      toast({
        title: "Error",
        description: "Failed to add action",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setNewActionTitle('');
    setSelectedPlanId('');
    setActionStartDate(new Date());
    setActionEndDate(addDays(new Date(), 7));
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Action for {goal?.title}</DialogTitle>
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
                {getPlansForGoal().map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>{plan.title}</SelectItem>
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
