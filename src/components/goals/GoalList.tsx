
import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import GoalItem from './GoalItem';
import GoalForm from './GoalForm';
import { Button } from '@/components/ui/button';
import { ThreeYearGoal } from '@/types/task';
import { Plus, CheckCircle2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const GoalList: React.FC = () => {
  const { threeYearGoals } = useGoal();
  
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ThreeYearGoal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsGoalFormOpen(true);
  };
  
  const handleEditGoal = (goal: ThreeYearGoal) => {
    setEditingGoal(goal);
    setIsGoalFormOpen(true);
  };

  const filteredGoals = threeYearGoals.filter(goal => 
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (goal.description && goal.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="py-6 px-8 flex justify-between items-center border-b border-border sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Goals Timeline</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Define your long-term vision with these three-year goals
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search goals..." 
              className="pl-9 h-10 w-full rounded-full bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddGoal} className="flex items-center rounded-full h-10 px-4 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Goal</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted/50 rounded-full p-6 mb-4">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground/70" />
            </div>
            <h3 className="text-xl font-medium">No goals yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              {searchQuery ? 'No goals match your search criteria.' : 'Add a three-year goal to start planning your future.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleAddGoal} className="mt-6 rounded-full">
                <Plus className="h-4 w-4 mr-1.5" />
                <span>Add Goal</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map(goal => (
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
