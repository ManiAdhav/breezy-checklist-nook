
import React, { useEffect } from 'react';
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
  selectedGoalId: string;
  selectedPlanId: string;
  onPlanChange: (planId: string) => void;
}

const ActionPlanSelector: React.FC<ActionPlanSelectorProps> = ({ 
  selectedGoalId,
  selectedPlanId, 
  onPlanChange 
}) => {
  const { threeYearGoals, plans, ninetyDayTargets } = useGoal();
  
  // Filter plans based on selected goal
  const filteredPlans = selectedGoalId
    ? plans.filter(plan => {
        const target = ninetyDayTargets.find(target => target.id === plan.ninetyDayTargetId);
        return target && target.threeYearGoalId === selectedGoalId;
      })
    : plans;
  
  // If the currently selected plan is not in the filtered list, reset it
  useEffect(() => {
    if (selectedPlanId && filteredPlans.length > 0) {
      const planExists = filteredPlans.some(plan => plan.id === selectedPlanId);
      if (!planExists) {
        onPlanChange('');
      }
    }
  }, [selectedGoalId, selectedPlanId, filteredPlans, onPlanChange]);
  
  const getPlansForSelect = () => {
    // Get filtered plans
    return filteredPlans.map(plan => {
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
          {getPlansForSelect().length === 0 ? (
            <SelectItem value="" disabled>
              {selectedGoalId ? "No plans for selected goal" : "No plans available"}
            </SelectItem>
          ) : (
            getPlansForSelect().map(plan => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActionPlanSelector;
