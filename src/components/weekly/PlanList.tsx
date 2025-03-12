
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGoal } from '@/contexts/GoalContext';
import { Plan } from '@/types/task';
import PlanItem from './PlanItem';
import PlanForm from './PlanForm';

interface PlanListProps {
  plans: Plan[];
  targetId?: string;
}

const PlanList: React.FC<PlanListProps> = ({ plans, targetId }) => {
  const { ninetyDayTargets } = useGoal();
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const navigate = useNavigate();

  // Filter plans by targetId if provided
  const filteredPlans = targetId
    ? plans.filter(plan => plan.ninetyDayTargetId === targetId)
    : plans;

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-4">
      {showForm ? (
        <PlanForm 
          onClose={handleClose}
          plan={editingPlan}
          targetId={targetId}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {targetId ? 'Plans for this Target' : 'All Plans'}
            </h2>
            <Button onClick={() => setShowForm(true)} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Plan</span>
            </Button>
          </div>
          
          {filteredPlans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No plans found. Click the button above to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlans.map(plan => (
                <PlanItem 
                  key={plan.id} 
                  plan={plan} 
                  onEdit={() => handleEditPlan(plan)}
                  targetName={ninetyDayTargets.find(t => t.id === plan.ninetyDayTargetId)?.title || 'Unknown Target'}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlanList;
