
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plan, GoalStatus } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import { Pencil, Trash2, CheckCircle, Clock, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Tag from '@/components/ui/Tag';

interface PlanItemProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onView: (plan: Plan) => void;
}

const PlanItem: React.FC<PlanItemProps> = ({ plan, onEdit, onView }) => {
  const { deletePlan, updatePlan, ninetyDayTargets } = useGoal();
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

  // Find the parent target
  const parentTarget = ninetyDayTargets.find(target => target.id === plan.ninetyDayTargetId);

  const toggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking through to the view
    const newStatus = plan.status === 'completed' ? 'in_progress' : 'completed';
    updatePlan(plan.id, { status: newStatus });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking through to the view
    deletePlan(plan.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking through to the view
    onEdit(plan);
  };

  return (
    <div 
      className={`group p-3 border border-border rounded-lg transition-colors duration-150 ${
        isHovered ? 'bg-card/80' : 'bg-card'
      } ${plan.status === 'completed' ? 'border-green-200 bg-green-50/30' : ''} cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(plan)}
    >
      <div className="flex items-start">
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 mr-2 rounded-full ${plan.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`}
          onClick={toggleComplete}
        >
          <CheckCircle className={`h-5 w-5 ${plan.status === 'completed' ? 'fill-green-500' : ''}`} />
        </Button>
        
        <div className="flex-1 min-w-0 mr-2">
          <div className={`font-medium ${plan.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
            {plan.title}
          </div>
          
          {plan.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {plan.description}
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
              text={getStatusLabel(plan.status)} 
              color={getStatusColor(plan.status)}
            />
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(plan.startDate), 'MMM d')} - {format(new Date(plan.endDate), 'MMM d')}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanItem;
