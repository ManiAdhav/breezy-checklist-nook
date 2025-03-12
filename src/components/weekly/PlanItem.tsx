
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar, CircleCheck, CircleDashed, CheckCircle2, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useGoal } from '@/contexts/GoalContext';
import { Plan } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface PlanItemProps {
  plan: Plan;
  onEdit: () => void;
  targetName?: string;
}

const PlanItem: React.FC<PlanItemProps> = ({ plan, onEdit, targetName }) => {
  const { deletePlan, updatePlan } = useGoal();

  const getStatusIcon = () => {
    switch (plan.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <CircleDashed className="h-4 w-4 text-blue-500" />;
      case 'abandoned':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CircleDashed className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleStatusChange = (status: 'not_started' | 'in_progress' | 'completed' | 'abandoned') => {
    updatePlan(plan.id, { status });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="py-4 px-4 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            {getStatusIcon()}
            <span>{plan.title}</span>
          </CardTitle>
          {targetName && (
            <CardDescription>
              <Link to={`/targets?targetId=${plan.ninetyDayTargetId}`}>
                <Badge variant="outline" className="hover:bg-secondary transition-colors">
                  {targetName}
                </Badge>
              </Link>
            </CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('not_started')}>
              Mark as Not Started
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('abandoned')}>
              Mark as Abandoned
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={() => deletePlan(plan.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 text-sm space-y-2">
        {plan.description && <p className="text-muted-foreground">{plan.description}</p>}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {format(new Date(plan.startDate), 'MMM d, yyyy')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanItem;
