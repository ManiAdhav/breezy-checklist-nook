
import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { ThreeYearGoal } from '@/types/task';
import { Button } from '@/components/ui/button';
import { useGoal } from '@/contexts/GoalContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface MindMapNodeProps {
  goal: ThreeYearGoal;
  position: { x: number; y: number };
  onEdit: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'not_started': return 'bg-muted-foreground/20';
    case 'in_progress': return 'bg-blue-500/20';
    case 'completed': return 'bg-green-500/20';
    case 'abandoned': return 'bg-red-500/20';
    default: return 'bg-muted-foreground/20';
  }
};

const MindMapNode: React.FC<MindMapNodeProps> = ({ goal, position, onEdit }) => {
  const { deleteThreeYearGoal } = useGoal();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteThreeYearGoal(goal.id);
      toast({
        title: "Goal deleted",
        description: "Your goal has been removed from the mind map"
      });
    }
  };
  
  return (
    <div 
      className={cn(
        "absolute w-48 p-4 rounded-xl shadow-lg backdrop-blur-md",
        getStatusColor(goal.status),
        "border border-white/10 cursor-pointer transition-all duration-200 hover:shadow-xl",
        "-translate-x-1/2 -translate-y-1/2"
      )}
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={onEdit}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-sm line-clamp-2">{goal.title}</h3>
        <div className="flex space-x-1 ml-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-destructive" 
            onClick={handleDelete}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {format(new Date(goal.startDate), 'MMM d')} - {format(new Date(goal.endDate), 'MMM d, yyyy')}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-2 w-full bg-black/10 h-1 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full",
            goal.status === 'completed' ? 'bg-green-500' : 
            goal.status === 'in_progress' ? 'bg-blue-500' : 
            goal.status === 'abandoned' ? 'bg-red-500' : 'bg-muted-foreground'
          )}
          style={{ width: goal.status === 'completed' ? '100%' : goal.status === 'in_progress' ? '50%' : '0%' }}
        />
      </div>
    </div>
  );
};

export default MindMapNode;
