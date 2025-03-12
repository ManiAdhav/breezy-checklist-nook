
import React from 'react';
import { Plan } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';

interface PlanItemProps {
  plan: Plan;
  onEdit: () => void;
  targetName: string;
}

const PlanItem: React.FC<PlanItemProps> = ({ plan, onEdit, targetName }) => {
  const { deletePlan, updatePlan } = useGoal();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-200 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'abandoned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      deletePlan(plan.id);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <Badge className={getStatusColor(plan.status)}>
            {plan.status.replace('_', ' ')}
          </Badge>
        </div>
        {targetName && <CardDescription>Target: {targetName}</CardDescription>}
      </CardHeader>
      {plan.description && (
        <CardContent className="pt-0 pb-2">
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PlanItem;
