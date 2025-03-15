
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { NinetyDayTarget, GoalStatus } from '@/types/task';
import { CheckCircle2, Circle, Calendar, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGoal } from '@/hooks/useGoalContext';

interface MilestoneItemProps {
  milestone: NinetyDayTarget;
  toggleMilestoneStatus: (id: string) => void;
  onEdit: (milestone: NinetyDayTarget) => void;
  onDelete: (id: string) => void;
  getStatusClasses: (status: GoalStatus) => string;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  toggleMilestoneStatus,
  onEdit,
  onDelete,
  getStatusClasses
}) => {
  const { plans } = useGoal();
  
  // Get plans associated with this milestone, safely handle undefined
  const milestonePlans = plans?.filter(plan => plan.ninetyDayTargetId === milestone.id) || [];
  
  return (
    <div 
      className="flex items-start p-3 border border-border rounded-md bg-card"
    >
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 mr-2 rounded-full ${
          milestone.status === 'completed' ? 'text-green-500' :
          milestone.status === 'in_progress' ? 'text-blue-500' : 
          milestone.status === 'abandoned' ? 'text-red-500' : 'text-gray-500'
        }`}
        onClick={() => toggleMilestoneStatus(milestone.id)}
      >
        {milestone.status === 'completed' ? (
          <CheckCircle2 className="h-5 w-5 fill-green-500" />
        ) : milestone.status === 'in_progress' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </Button>
      
      <div className="flex-1 min-w-0">
        <div className={`font-medium ${milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
          {milestone.title}
        </div>
        
        {milestone.description && (
          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {milestone.description}
          </div>
        )}
        
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>
            {format(new Date(milestone.startDate), 'MMM d, yyyy')} - {format(new Date(milestone.endDate), 'MMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClasses(milestone.status)}`}>
            {milestone.status === 'not_started' ? 'Not Started' :
            milestone.status === 'in_progress' ? 'In Progress' :
            milestone.status === 'completed' ? 'Completed' : 'Abandoned'}
          </span>
        </div>
        
        {/* Display associated plans */}
        {milestonePlans.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground mb-1">Associated Plans:</div>
            <div className="space-y-1">
              {milestonePlans.map(plan => (
                <div key={plan.id} className="text-xs bg-muted/40 px-2 py-1 rounded">
                  {plan.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(milestone)}>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => onDelete(milestone.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MilestoneItem;
