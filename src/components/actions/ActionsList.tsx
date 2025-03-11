
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ActionsList: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, toggleTaskCompletion } = useTask();
  
  // Filter tasks that are actions and are not completed
  const actions = tasks.filter(task => task.isAction && !task.completed);
  
  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-xs font-medium">Actions</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={() => navigate('/actions')}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="max-h-[220px] overflow-y-auto">
        {actions.length > 0 ? (
          <div className="space-y-1">
            {actions.map(action => (
              <div 
                key={action.id} 
                className="flex items-start p-1.5 hover:bg-accent/20 rounded-md cursor-pointer text-xs"
                onClick={() => navigate('/actions')}
              >
                <Checkbox 
                  checked={action.completed}
                  className="mt-0.5 mr-2"
                  onCheckedChange={() => toggleTaskCompletion(action.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="line-clamp-2">{action.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-2">
            No actions yet
          </div>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2 text-xs"
        onClick={() => navigate('/actions')}
      >
        View All Actions
      </Button>
    </div>
  );
};

export default ActionsList;
