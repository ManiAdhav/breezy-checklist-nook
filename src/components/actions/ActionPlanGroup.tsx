
import React from 'react';
import { Task } from '@/types/task';
import ActionTaskItem from './ActionTaskItem';

interface ActionPlanGroupProps {
  goalId: string;
  goalTitle: string;
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const ActionPlanGroup: React.FC<ActionPlanGroupProps> = ({ 
  goalId, 
  goalTitle, 
  tasks,
  toggleTaskCompletion,
  deleteTask 
}) => {
  return (
    <div className="border-t">
      <div className="px-4 py-2 bg-muted/20 border-b">
        <p className="text-xs font-medium">{goalTitle}</p>
      </div>
      <ul>
        {tasks.map(task => (
          <ActionTaskItem 
            key={task.id} 
            task={task} 
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default ActionPlanGroup;
