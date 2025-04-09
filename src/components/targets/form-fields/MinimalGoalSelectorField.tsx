
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Goals } from '@/types/task';
import { Target } from 'lucide-react';
import DynamicIcon from '@/components/ui/dynamic-icon';

interface GoalSelectorFieldProps {
  goals: Goals[];
  selectedGoalId: string;
  setSelectedGoalId: (goalId: string) => void;
}

const MinimalGoalSelectorField: React.FC<GoalSelectorFieldProps> = ({ 
  goals, 
  selectedGoalId, 
  setSelectedGoalId 
}) => {
  const selectedGoal = goals.find(goal => goal.id === selectedGoalId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 h-8 ${selectedGoalId ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}`}
        >
          {selectedGoal?.icon ? (
            <DynamicIcon name={selectedGoal.icon} className="h-3.5 w-3.5" />
          ) : (
            <Target className="h-3.5 w-3.5" />
          )}
          <span>{selectedGoal?.title || 'Goal'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={selectedGoalId} onValueChange={setSelectedGoalId}>
          {goals.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-gray-500">No goals available</div>
          ) : (
            goals.map(goal => (
              <DropdownMenuRadioItem key={goal.id} value={goal.id} className="flex items-center gap-2">
                {goal.icon ? (
                  <DynamicIcon name={goal.icon} className="h-3.5 w-3.5" />
                ) : (
                  <Target className="h-3.5 w-3.5" />
                )}
                <span>{goal.title}</span>
              </DropdownMenuRadioItem>
            ))
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MinimalGoalSelectorField;
