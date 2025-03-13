
import React from 'react';
import { format } from 'date-fns';
import { NinetyDayTarget, ThreeYearGoal, GoalStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MilestoneGridProps {
  filteredTargets: NinetyDayTarget[];
  threeYearGoals: ThreeYearGoal[];
  onEdit: (target: NinetyDayTarget) => void;
  onDelete: (id: string) => void;
  onStatusChange: (target: NinetyDayTarget, status: GoalStatus) => void;
  user?: any;
}

const MilestoneGrid: React.FC<MilestoneGridProps> = ({
  filteredTargets,
  threeYearGoals,
  onEdit,
  onDelete,
  onStatusChange,
  user
}) => {
  if (filteredTargets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="text-muted-foreground">No milestones yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTargets.map((target) => {
        const parentGoal = threeYearGoals.find(goal => goal.id === target.threeYearGoalId);
        
        return (
          <div key={target.id} className="bg-card rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{target.title}</h3>
                {parentGoal && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Part of: {parentGoal.title}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(target)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(target.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {target.description && (
              <p className="text-sm text-muted-foreground mb-3">{target.description}</p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <p>
                {format(new Date(target.startDate), 'MMM d')} - {format(new Date(target.endDate), 'MMM d')}
              </p>
              
              <select
                value={target.status}
                onChange={(e) => onStatusChange(target, e.target.value as GoalStatus)}
                className="bg-white border border-gray-300 rounded-md px-2 py-1 text-xs"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneGrid;
