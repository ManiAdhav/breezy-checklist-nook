
import React, { useState } from 'react';
import { format } from 'date-fns';
import { WeeklyGoal, GoalStatus } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import { Pencil, Trash2, CheckCircle, Clock, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Tag from '@/components/ui/Tag';

interface WeeklyGoalItemProps {
  goal: WeeklyGoal;
  onEdit: (goal: WeeklyGoal) => void;
}

const WeeklyGoalItem: React.FC<WeeklyGoalItemProps> = ({ goal, onEdit }) => {
  const { deleteWeeklyGoal, updateWeeklyGoal, ninetyDayTargets } = useGoal();
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: GoalStatus): string => {
    const colors = {
      not_started: '#6B7280', // gray
      in_progress: '#3B82F6', // blue
      completed: '#10B981', // green
      abandoned: '#EF4444', // red
    };
    return colors[status];
  };

  const getStatusLabel = (status: GoalStatus): string => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed',
      abandoned: 'Abandoned',
    };
    return labels[status];
  };

  // Find the parent target
  const parentTarget = ninetyDayTargets.find(target => target.id === goal.ninetyDayTargetId);

  const toggleComplete = () => {
    const newStatus = goal.status === 'completed' ? 'in_progress' : 'completed';
    updateWeeklyGoal(goal.id, { status: newStatus });
  };

  return (
    <div 
      className={`group p-3 border border-border rounded-md transition-colors duration-150 ${
        isHovered ? 'bg-card/80' : 'bg-card'
      } ${goal.status === 'completed' ? 'border-green-200 bg-green-50/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 mr-2 ${goal.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`}
          onClick={toggleComplete}
        >
          <CheckCircle className={`h-5 w-5 ${goal.status === 'completed' ? 'fill-green-500' : ''}`} />
        </Button>
        
        <div className="flex-1 min-w-0 mr-2">
          <div className={`font-medium ${goal.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
            {goal.title}
          </div>
          
          {goal.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {goal.description}
            </div>
          )}

          {parentTarget && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Target className="h-3.5 w-3.5 mr-1" />
              <span>From target: {parentTarget.title}</span>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Tag 
              text={getStatusLabel(goal.status)} 
              color={getStatusColor(goal.status)}
            />
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(goal.startDate), 'MMM d')} - {format(new Date(goal.endDate), 'MMM d')}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(goal)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => deleteWeeklyGoal(goal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyGoalItem;
