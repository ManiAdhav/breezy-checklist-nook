
import React from 'react';
import { Plan, GoalStatus } from '@/types/task';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGoal } from '@/contexts/GoalContext';
import { format } from 'date-fns';

interface PlanItemProps {
  plan: Plan;
  onEdit: () => void;
  targetName: string;
}

const PlanItem: React.FC<PlanItemProps> = ({ plan, onEdit, targetName }) => {
  const { deletePlan } = useGoal();

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'abandoned':
        return <Badge variant="destructive">Abandoned</Badge>;
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlan(plan.id);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{plan.title}</CardTitle>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the plan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {plan.description && (
          <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        )}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Target:</p>
            <p>{targetName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status:</p>
            <div className="mt-1">{getStatusBadge(plan.status)}</div>
          </div>
          <div>
            <p className="text-muted-foreground">Start Date:</p>
            <p>{format(new Date(plan.startDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">End Date:</p>
            <p>{format(new Date(plan.endDate), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanItem;
