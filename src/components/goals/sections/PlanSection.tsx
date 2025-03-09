
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Target, MoreHorizontal, X } from 'lucide-react';
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

interface PlanSectionProps {
  goalId: string;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const PlanSection: React.FC<PlanSectionProps> = ({ goalId }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planPriority, setPlanPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
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

  const openCreatePlanDialog = () => {
    setEditingPlan(null);
    setPlanTitle('');
    setPlanDescription('');
    setPlanPriority('medium');
    setIsPlanDialogOpen(true);
  };

  const openEditPlanDialog = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanTitle(plan.title);
    setPlanDescription(plan.description);
    setPlanPriority(plan.priority);
    setIsPlanDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (!planTitle.trim()) {
      toast({
        title: "Error",
        description: "Plan title is required",
        variant: "destructive",
      });
      return;
    }

    if (editingPlan) {
      // Update existing plan
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, title: planTitle, description: planDescription, priority: planPriority }
            : plan
        )
      );
      toast({
        title: "Plan updated",
        description: "Your plan has been updated successfully",
      });
    } else {
      // Create new plan
      const newPlan: Plan = {
        id: `p${Date.now()}`,
        title: planTitle,
        description: planDescription,
        priority: planPriority
      };
      setPlans(prevPlans => [...prevPlans, newPlan]);
      toast({
        title: "Plan created",
        description: "Your new plan has been created",
      });
    }
    setIsPlanDialogOpen(false);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
    toast({
      title: "Plan deleted",
      description: "Your plan has been deleted",
      variant: "destructive",
    });
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
      
      {plans.length === 0 ? (
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
          {plans.map(plan => (
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
              
              <div className="mt-3 flex items-center">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityClasses(plan.priority)}`}>
                  {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)} Priority
                </span>
              </div>
            </div>
          ))}
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
