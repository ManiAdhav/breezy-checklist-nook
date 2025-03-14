
import React from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionPlanSelectorProps {
  selectedPlanId: string;
  onPlanChange: (planId: string) => void;
}

const ActionPlanSelector: React.FC<ActionPlanSelectorProps> = ({ 
  selectedPlanId, 
  onPlanChange 
}) => {
  const { threeYearGoals, plans, ninetyDayTargets } = useGoal();
  
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
  
  return (
    <div className="space-y-2">
      <Label htmlFor="plan-select">Associated Plan</Label>
      <Select 
        value={selectedPlanId} 
        onValueChange={onPlanChange}
      >
        <SelectTrigger id="plan-select">
          <SelectValue placeholder="Select a plan (optional)" />
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
  );
};

export default ActionPlanSelector;
