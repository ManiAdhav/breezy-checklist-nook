
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import { Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Tag from '@/components/ui/Tag';

interface GoalItemProps {
  goal: ThreeYearGoal;
  onEdit: (goal: ThreeYearGoal) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onEdit }) => {
  const { deleteThreeYearGoal } = useGoal();
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
          <div className="font-medium text-base">{goal.title}</div>
          
          {goal.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {goal.description}
            </div>
          )}
          
          <div className="flex items-center space-x-3 mt-3">
            <Tag 
              text={getStatusLabel(goal.status)} 
              color={getStatusColor(goal.status)}
            />
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(goal.startDate), 'MMM d, yyyy')} - {format(new Date(goal.endDate), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Created {format(new Date(goal.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onEdit(goal)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
            onClick={() => deleteThreeYearGoal(goal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalItem;
