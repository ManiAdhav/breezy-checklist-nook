
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import { Goals, GoalStatus } from '@/types/task';
import { useGoal } from '@/hooks/useGoalContext';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface GoalHeaderProps {
  goal: Goals;
  onBack: () => void;
  onEdit: () => void;
  milestoneCount?: number;
  planCount?: number;
  taskCount?: number;
  actionCount?: number;
  habitCount?: number;
}

const GoalHeader: React.FC<GoalHeaderProps> = ({ 
  goal, 
  onBack, 
  onEdit,
  milestoneCount = 0,
  planCount = 0,
  taskCount = 0,
  actionCount = 0,
  habitCount = 0
}) => {
  const { updateThreeYearGoal } = useGoal();
  
  // Get the status label based on the goal's status value
  const getStatusLabel = (status: GoalStatus): string => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed',
      abandoned: 'Abandoned',
    };
    return labels[status];
  };
  
  const handleStatusUpdate = (status: GoalStatus) => {
    updateThreeYearGoal(goal.id, { status });
    
    toast({
      title: "Goal status updated",
      description: `Status changed to ${getStatusLabel(status)}`,
    });
  };
  
  // Format dates for display
  const startDate = format(new Date(goal.startDate), 'MMM d, yyyy');
  const endDate = format(new Date(goal.endDate), 'MMM d, yyyy');
  
  return (
    <div className="py-3 px-6 flex flex-col border-b border-border sticky top-0 bg-background shadow-sm z-10">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2 h-9 px-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="ml-auto flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <div className="flex items-center">
            <select 
              value={goal.status}
              onChange={(e) => handleStatusUpdate(e.target.value as GoalStatus)}
              className="text-sm border border-input rounded-md px-3 h-9 bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <h2 className="text-xl font-semibold tracking-tight">{goal.title}</h2>
        <div className="flex items-center mt-1 justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
            {startDate} - {endDate}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={milestoneCount > 0 ? "default" : "outline"} className="bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-none">
              {milestoneCount} {milestoneCount === 1 ? 'Milestone' : 'Milestones'}
            </Badge>
            <Badge variant={planCount > 0 ? "default" : "outline"} className="bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-none">
              {planCount} {planCount === 1 ? 'Plan' : 'Plans'}
            </Badge>
            <Badge variant={taskCount > 0 ? "default" : "outline"} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-none">
              {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
            </Badge>
            <Badge variant={actionCount > 0 ? "default" : "outline"} className="bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100 border-none">
              {actionCount} {actionCount === 1 ? 'Action' : 'Actions'}
            </Badge>
            <Badge variant={habitCount > 0 ? "default" : "outline"} className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100 border-none">
              {habitCount} {habitCount === 1 ? 'Habit' : 'Habits'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalHeader;
