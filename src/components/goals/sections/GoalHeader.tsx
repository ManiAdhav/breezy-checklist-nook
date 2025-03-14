
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { useGoal } from '@/hooks/useGoalContext';
import { toast } from '@/hooks/use-toast';

interface GoalHeaderProps {
  goal: ThreeYearGoal;
  onBack: () => void;
  onEdit: () => void;
}

const GoalHeader: React.FC<GoalHeaderProps> = ({ goal, onBack, onEdit }) => {
  const { updateThreeYearGoal } = useGoal();
  
  // Get the icon component based on the goal's icon value
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
    <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-background shadow-sm z-10">
      <Button variant="ghost" onClick={onBack} className="mr-2 hover:bg-background">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="flex-1">
        <h2 className="text-xl font-semibold tracking-tight flex items-center">
          {goal.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1 flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          {startDate} - {endDate}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <div className="flex items-center">
          <select 
            value={goal.status}
            onChange={(e) => handleStatusUpdate(e.target.value as GoalStatus)}
            className="text-sm border border-input rounded-md px-3 py-1.5 bg-background focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GoalHeader;
