
import React, { useState } from 'react';
import { Plan } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import PlanItem from './PlanItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PlanForm from './PlanForm';
import { Plus } from 'lucide-react';

interface PlanListProps {
  plans: Plan[];
}

const PlanList: React.FC<PlanListProps> = ({ plans }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const { ninetyDayTargets } = useGoal();

  const handleCreate = () => {
    setCurrentPlan(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentPlan(null);
  };

  const getTargetName = (targetId: string): string => {
    const target = ninetyDayTargets.find(t => t.id === targetId);
    return target ? target.title : 'Unknown Target';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg border-gray-300">
          <p className="text-muted-foreground">
            No plans yet. Click the button above to create one.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <PlanItem 
              key={plan.id} 
              plan={plan} 
              onEdit={() => handleEdit(plan)} 
              targetName={getTargetName(plan.ninetyDayTargetId)}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
          </DialogHeader>
          <PlanForm 
            initialPlan={currentPlan} 
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanList;
