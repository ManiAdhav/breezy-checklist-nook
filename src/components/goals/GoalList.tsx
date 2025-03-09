
import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import GoalItem from './GoalItem';
import GoalForm from './GoalForm';
import { Button } from '@/components/ui/button';
import { ThreeYearGoal } from '@/types/task';
import { Plus, CheckCircle2 } from 'lucide-react';

const GoalList: React.FC = () => {
  const { threeYearGoals } = useGoal();
  
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ThreeYearGoal | null>(null);
  
  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsGoalFormOpen(true);
  };
  
  const handleEditGoal = (goal: ThreeYearGoal) => {
    setEditingGoal(goal);
    setIsGoalFormOpen(true);
  };
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background z-10">
        <div>
          <h2 className="text-2xl font-semibold">Three-Year Goals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {threeYearGoals.length} goals
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddGoal} className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Goal</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {threeYearGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted rounded-full p-6 mb-4">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No goals yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Add a three-year goal to start planning your future.
            </p>
            <Button onClick={handleAddGoal} className="mt-6">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Goal</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {threeYearGoals.map(goal => (
              <GoalItem 
                key={goal.id} 
                goal={goal} 
                onEdit={handleEditGoal}
              />
            ))}
          </div>
        )}
      </div>
      
      <GoalForm 
        isOpen={isGoalFormOpen} 
        onClose={() => setIsGoalFormOpen(false)} 
        editingGoal={editingGoal}
      />
    </div>
  );
};

export default GoalList;
