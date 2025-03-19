
import React from 'react';
import { Goals } from '@/types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalSelectorFieldProps {
  goals: Goals[];
  selectedGoalId: string;
  setSelectedGoalId: (id: string) => void;
}

const GoalSelectorField: React.FC<GoalSelectorFieldProps> = ({
  goals,
  selectedGoalId,
  setSelectedGoalId
}) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Goal</div>
      <Select
        value={selectedGoalId}
        onValueChange={setSelectedGoalId}
        required
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a goal" />
        </SelectTrigger>
        <SelectContent>
          {goals.map((goal: Goals) => (
            <SelectItem key={goal.id} value={goal.id}>
              {goal.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GoalSelectorField;
