
import React from 'react';
import { Task } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import ActionGoalGroup from './ActionGoalGroup';
import EmptyActionState from './EmptyActionState';
import { groupTasksByGoal, getPlanDetails } from './utils/taskGroupingUtils';

const ActionsView: React.FC = () => {
  const { tasks, toggleTaskCompletion, deleteTask, isLoading } = useTask();
  const { ninetyDayTargets, threeYearGoals } = useGoal();

  // Filter out only actions
  const actionTasks = tasks.filter(task => task.isAction);

  // Group tasks by goalId first, then by planId
  const tasksByGoal = groupTasksByGoal(actionTasks, ninetyDayTargets, threeYearGoals);

  // Helper function to get plan details for each goal group
  const getPlanDetailsHelper = (goalId: string) => {
    return getPlanDetails(goalId, ninetyDayTargets, threeYearGoals);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading actions...</div>;
  }

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
