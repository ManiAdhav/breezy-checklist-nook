
import React from 'react';
import { Task } from '@/types/task';
import ActionPlanHeader from './ActionPlanHeader';
import ActionTaskItem from './ActionTaskItem';

interface ActionPlanGroupProps {
  planId: string;
  planTitle: string;
  targetTitle: string;
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const ActionPlanGroup: React.FC<ActionPlanGroupProps> = ({ 
  planId, 
  planTitle, 
  targetTitle, 
  tasks,
  toggleTaskCompletion,
  deleteTask 
}) => {
  return (
    <div key={planId} className="border-t">
      <ActionPlanHeader planTitle={planTitle} targetTitle={targetTitle} />
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
