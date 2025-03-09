
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { useGoal } from '@/contexts/GoalContext';
import { Pencil, Trash2, Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Tag from '@/components/ui/Tag';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      in_progress: '#8B5CF6', // purple
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

  // Calculate progress percentage (demo value for UI)
  const progressPercentage = 
    goal.status === 'completed' ? 100 :
    goal.status === 'in_progress' ? Math.floor(Math.random() * 60) + 20 :
    goal.status === 'not_started' ? 0 : 5;

  return (
    <div 
      className={`group bg-white rounded-3xl border border-border p-5 transition-all duration-150 ${
        isHovered ? 'shadow-md' : 'shadow-sm'
      } ${goal.status === 'completed' ? 'border-green-200 bg-green-50/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className="flex-1 min-w-0 mr-2">
          <div className="flex justify-between">
            <div className="font-medium text-lg">{goal.title}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(goal)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteThreeYearGoal(goal.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {goal.description && (
            <div className="text-sm text-muted-foreground mt-2">
              {goal.description}
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Tag 
              text={getStatusLabel(goal.status)} 
              color={getStatusColor(goal.status)}
            />
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(goal.startDate), 'MMM d, yyyy')} - {format(new Date(goal.endDate), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          <div className="mt-5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium">Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-value" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalItem;
