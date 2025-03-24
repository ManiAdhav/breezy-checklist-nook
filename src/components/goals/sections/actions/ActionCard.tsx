
import React from 'react';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface ActionCardProps {
  action: Task;
  onToggleTaskCompletion: (id: string) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, onToggleTaskCompletion }) => {
  return (
    <Card className="mb-3 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <Checkbox 
            checked={action.completed}
            className="mt-1"
            onCheckedChange={() => onToggleTaskCompletion(action.id)}
          />
          <div className="flex-1">
            <h3 className={`font-medium ${action.completed ? 'line-through text-muted-foreground' : ''}`}>
              {action.title}
            </h3>
            
            {action.startDate && action.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>
                  {format(new Date(action.startDate), 'MMM d, yyyy')} - {format(new Date(action.dueDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
          
          {action.completed && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
