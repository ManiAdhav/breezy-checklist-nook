
import React from 'react';
import { Task } from '@/types/task';
import ActionHeader from './ActionHeader';
import ActionPlanGroup from './ActionPlanGroup';

interface PlanDetails {
  planTitle: string;
  targetTitle: string;
}

interface ActionGoalGroupProps {
  goalId: string;
  goalTitle: string;
  plans: { [key: string]: Task[] };
  getPlanDetails: (goalId: string) => PlanDetails;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const ActionGoalGroup: React.FC<ActionGoalGroupProps> = ({ 
  goalId, 
  goalTitle, 
  plans,
  getPlanDetails,
  toggleTaskCompletion,
  deleteTask
}) => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <ActionHeader title={goalTitle} />
      <div className="divide-y">
        {Object.entries(plans).map(([planId, planTasks]) => {
          const { planTitle, targetTitle } = planId !== 'unassigned' 
            ? getPlanDetails(planId) 
            : { planTitle: 'Unassigned Actions', targetTitle: '' };
            
          return (
            <ActionPlanGroup
              key={planId}
              goalId={planId}
              goalTitle={planTitle}
              tasks={planTasks}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActionGoalGroup;
