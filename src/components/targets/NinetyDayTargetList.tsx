
import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import NinetyDayTargetItem from './NinetyDayTargetItem';
import NinetyDayTargetForm from './NinetyDayTargetForm';
import { Button } from '@/components/ui/button';
import { NinetyDayTarget } from '@/types/task';
import { Plus, Target } from 'lucide-react';

const NinetyDayTargetList: React.FC = () => {
  const { ninetyDayTargets, threeYearGoals } = useGoal();
  
  const [isTargetFormOpen, setIsTargetFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<NinetyDayTarget | null>(null);
  
  const handleAddTarget = () => {
    setEditingTarget(null);
    setIsTargetFormOpen(true);
  };
  
  const handleEditTarget = (target: NinetyDayTarget) => {
    setEditingTarget(target);
    setIsTargetFormOpen(true);
  };
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background z-10">
        <div>
          <h2 className="text-2xl font-semibold">90-Day Targets</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {ninetyDayTargets.length} targets
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleAddTarget} 
            className="flex items-center"
            disabled={threeYearGoals.length === 0}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Target</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {threeYearGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Target className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No three-year goals yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              You need to create a three-year goal before you can add 90-day targets.
            </p>
          </div>
        ) : ninetyDayTargets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Target className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No targets yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Add a 90-day target to break down your three-year goals.
            </p>
            <Button onClick={handleAddTarget} className="mt-6">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Target</span>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {ninetyDayTargets.map(target => (
              <NinetyDayTargetItem 
                key={target.id} 
                target={target} 
                onEdit={handleEditTarget}
              />
            ))}
          </div>
        )}
      </div>
      
      <NinetyDayTargetForm 
        isOpen={isTargetFormOpen} 
        onClose={() => setIsTargetFormOpen(false)} 
        editingTarget={editingTarget}
      />
    </div>
  );
};

export default NinetyDayTargetList;
