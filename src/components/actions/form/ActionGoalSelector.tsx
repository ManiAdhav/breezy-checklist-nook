
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

interface ActionGoalSelectorProps {
  selectedGoalId: string;
  onGoalChange: (goalId: string) => void;
}

const ActionGoalSelector: React.FC<ActionGoalSelectorProps> = ({ 
  selectedGoalId, 
  onGoalChange 
}) => {
  const { threeYearGoals } = useGoal();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="goal-select">Associated Goal</Label>
      <Select 
        value={selectedGoalId} 
        onValueChange={onGoalChange}
      >
        <SelectTrigger id="goal-select">
          <SelectValue placeholder="Select a goal (optional)" />
        </SelectTrigger>
        <SelectContent>
          {threeYearGoals.map(goal => (
            <SelectItem key={goal.id} value={goal.id}>
              {goal.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActionGoalSelector;
