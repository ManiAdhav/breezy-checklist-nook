
import React, { useState } from 'react';
import { format } from 'date-fns';
import { NinetyDayTarget, GoalStatus } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import { Pencil, Trash2, Calendar, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Tag from '@/components/ui/Tag';

interface MilestoneItemProps {
  target: NinetyDayTarget;
  onEdit: (target: NinetyDayTarget) => void;
}

const MilestoneItem2: React.FC<MilestoneItemProps> = ({ target, onEdit }) => {
  const { deleteNinetyDayTarget, threeYearGoals } = useGoal();
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: GoalStatus): string => {
    const colors = {
      not_started: '#6B7280', // gray
      in_progress: '#60A5FA', // blue
      completed: '#34D399', // green
      abandoned: '#F87171', // red
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

  // Find the parent goal
  const parentGoal = threeYearGoals.find(goal => goal.id === target.threeYearGoalId);

  return (
    <div 
      className={`group p-4 border-b border-border transition-colors duration-150 ${
        isHovered ? 'bg-task-hover' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className="flex-1 min-w-0 mr-2">
          <div className="font-medium text-base">{target.title}</div>
          
          {target.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {target.description}
            </div>
          )}

          {parentGoal && (
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Target className="h-3.5 w-3.5 mr-1" />
              <span>Part of: {parentGoal.title}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3 mt-3">
            <Tag 
              text={getStatusLabel(target.status)} 
              color={getStatusColor(target.status)}
            />
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(target.startDate), 'MMM d, yyyy')} - {format(new Date(target.endDate), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Created {format(new Date(target.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onEdit(target)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
            onClick={() => deleteNinetyDayTarget(target.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneItem2;
