
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Target, MoreHorizontal, X, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { useGoal } from '@/hooks/useGoalContext';
import { format } from 'date-fns';
import { Plan, GoalStatus } from '@/types/task';

interface PlanSectionProps {
  goalId: string;
}

const PlanSection: React.FC<PlanSectionProps> = ({ goalId }) => {
  const { plans, ninetyDayTargets, addPlan, updatePlan, deletePlan } = useGoal();
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Get targets for this goal
  const goalTargets = ninetyDayTargets.filter(target => target.threeYearGoalId === goalId);
  
  // Get plans for this goal (via targets)
  const goalPlans = plans?.filter(plan => 
    goalTargets.some(target => target.id === plan.ninetyDayTargetId)
  ) || [];
  
  // Form state
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planPriority, setPlanPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [planStatus, setPlanStatus] = useState<GoalStatus>('not_started');
  const [planStartDate, setPlanStartDate] = useState('');
  const [planEndDate, setPlanEndDate] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  
  useEffect(() => {
    // Set default target if available
    if (goalTargets.length > 0 && !selectedTargetId) {
      setSelectedTargetId(goalTargets[0].id);
    }
  }, [goalTargets, selectedTargetId]);
  
  const getPriorityClasses = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusClasses = (status: GoalStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'abandoned':
        return 'text-red-500 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const openCreatePlanDialog = () => {
    setEditingPlan(null);
    setPlanTitle('');
    setPlanDescription('');
    setPlanPriority('medium');
    setPlanStatus('not_started');
    
    // Set default dates
    const today = new Date();
    setPlanStartDate(format(today, 'yyyy-MM-dd'));
    setPlanEndDate(format(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
    
    setIsPlanDialogOpen(true);
  };

  const openEditPlanDialog = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanTitle(plan.title);
    setPlanDescription(plan.description || '');
    setPlanPriority('medium'); // Assuming this is not part of the Plan type
    setPlanStatus(plan.status);
    setPlanStartDate(format(new Date(plan.startDate), 'yyyy-MM-dd'));
    setPlanEndDate(format(new Date(plan.endDate), 'yyyy-MM-dd'));
    setSelectedTargetId(plan.ninetyDayTargetId);
    setIsPlanDialogOpen(true);
  };

  const handleSavePlan = async () => {
    if (!planTitle.trim()) {
      toast({
        title: "Error",
        description: "Plan title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTargetId) {
      toast({
        title: "Error",
        description: "Please select a milestone",
        variant: "destructive",
      });
      return;
    }

    try {
      const planData = {
        title: planTitle,
        description: planDescription,
        status: planStatus,
        startDate: new Date(planStartDate),
        endDate: new Date(planEndDate),
        ninetyDayTargetId: selectedTargetId,
      };
      
      if (editingPlan) {
        // Update existing plan
        await updatePlan(editingPlan.id, planData);
        toast({
          title: "Plan updated",
          description: "Your plan has been updated successfully",
        });
      } else {
        // Create new plan
        await addPlan(planData);
        toast({
          title: "Plan created",
          description: "Your new plan has been created",
        });
      }
      setIsPlanDialogOpen(false);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlan(id);
      toast({
        title: "Plan deleted",
        description: "Your plan has been deleted",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Strategies to achieve your goal</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 text-xs rounded-lg"
          onClick={openCreatePlanDialog}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Plan
        </Button>
      </div>
      
      {goalPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground mb-2 text-sm">No plans yet</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-1"
            onClick={openCreatePlanDialog}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Your First Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {goalPlans.map(plan => {
            // Find the associated target
            const target = ninetyDayTargets.find(t => t.id === plan.ninetyDayTargetId);
            
            return (
              <div 
                key={plan.id}
                className="p-3.5 border border-border rounded-lg bg-card hover:bg-card/80 transition-colors"
              >
                <div className="flex justify-between">
                  <div className="font-medium flex items-center text-sm">
                    <Target className="h-4 w-4 mr-2 text-primary" />
                    {plan.title}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => openEditPlanDialog(plan)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive cursor-pointer"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {plan.description && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {plan.description}
                  </p>
                )}
                
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusClasses(plan.status)}`}>
                    {plan.status === 'not_started' ? 'Not Started' : 
                     plan.status === 'in_progress' ? 'In Progress' : 
                     plan.status === 'completed' ? 'Completed' : 'Abandoned'}
                  </span>
                  
                  {target && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Milestone: {target.title}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plan-title">Title</Label>
              <Input
                id="plan-title"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                placeholder="Enter plan title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Enter plan description"
                className="min-h-24 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-start-date">Start Date</Label>
                <Input
                  id="plan-start-date"
                  type="date"
                  value={planStartDate}
                  onChange={(e) => setPlanStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-end-date">End Date</Label>
                <Input
                  id="plan-end-date"
                  type="date"
                  value={planEndDate}
                  onChange={(e) => setPlanEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-priority">Priority</Label>
              <Select value={planPriority} onValueChange={(value) => setPlanPriority(value as 'high' | 'medium' | 'low')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-status">Status</Label>
              <Select value={planStatus} onValueChange={(value) => setPlanStatus(value as GoalStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-milestone">Milestone</Label>
              <Select 
                value={selectedTargetId} 
                onValueChange={setSelectedTargetId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a milestone" />
                </SelectTrigger>
                <SelectContent>
                  {goalTargets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      {target.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanSection;
