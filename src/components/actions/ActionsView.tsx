
import React from 'react';
import { Task } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import ActionGoalGroup from './ActionGoalGroup';
import EmptyActionState from './EmptyActionState';
import { groupTasksByGoal, getPlanDetails } from './utils/taskGroupingUtils';

interface ActionsViewProps {
  tasks: Task[];
}

const ActionsView: React.FC<ActionsViewProps> = ({ tasks }) => {
  const { toggleTaskCompletion, deleteTask } = useTask();
  const { plans, ninetyDayTargets, threeYearGoals } = useGoal();

  // Group tasks by goalId first, then by planId
  const tasksByGoal = groupTasksByGoal(tasks, plans, ninetyDayTargets, threeYearGoals);

  // Helper function to get plan details for each plan group
  const getPlanDetailsHelper = (planId: string) => {
    const { planTitle, targetTitle } = getPlanDetails(planId, plans, ninetyDayTargets, threeYearGoals);
    return { planTitle, targetTitle };
  };

  return (
    <div className="space-y-6">
      {Object.keys(tasksByGoal).length === 0 ? (
        <EmptyActionState />
      ) : (
        Object.entries(tasksByGoal).map(([goalId, { goal, plans: goalPlans }]) => (
          <ActionGoalGroup
            key={goalId}
            goalId={goalId}
            goalTitle={goal}
            plans={goalPlans}
            getPlanDetails={getPlanDetailsHelper}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
          />
        ))
      )}
    </div>
  );
};

export default ActionsView;
