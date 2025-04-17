
import React from 'react';
import ProgressCategory from './ProgressCategory';
import { CalendarCheck, Target, ListChecks, Repeat } from 'lucide-react';

interface ProgressCategoriesProps {
  milestoneCompletionPercentage: number;
  completedMilestones: number;
  goalMilestonesLength: number;
  planCompletionPercentage: number;
  completedPlans: number;
  goalPlansLength: number;
  taskCompletionPercentage: number;
  completedTasks: number;
  goalTasksLength: number;
  actionCompletionPercentage: number;
  completedActions: number;
  goalActionsLength: number;
  habitCompletionPercentage: number;
  goalHabitsLength: number;
}

const ProgressCategories: React.FC<ProgressCategoriesProps> = ({
  milestoneCompletionPercentage,
  completedMilestones,
  goalMilestonesLength,
  planCompletionPercentage,
  completedPlans,
  goalPlansLength,
  taskCompletionPercentage,
  completedTasks,
  goalTasksLength,
  actionCompletionPercentage,
  completedActions,
  goalActionsLength,
  habitCompletionPercentage,
  goalHabitsLength
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6 text-xs">
      <div className="space-y-4">
        <ProgressCategory
          label="Milestones"
          icon={CalendarCheck}
          color="text-purple-600"
          value={milestoneCompletionPercentage}
          completed={completedMilestones}
          total={goalMilestonesLength}
          indicatorClassName="bg-purple-500"
        />
        <ProgressCategory
          label="Plans"
          icon={Target}
          color="text-blue-600"
          value={planCompletionPercentage}
          completed={completedPlans}
          total={goalPlansLength}
          indicatorClassName="bg-blue-500"
        />
      </div>
      
      <div className="space-y-4">
        <ProgressCategory
          label="Tasks"
          icon={ListChecks}
          color="text-yellow-600"
          value={taskCompletionPercentage}
          completed={completedTasks}
          total={goalTasksLength}
          indicatorClassName="bg-yellow-500"
        />
        <ProgressCategory
          label="Actions"
          icon={ListChecks}
          color="text-red-600"
          value={actionCompletionPercentage}
          completed={completedActions}
          total={goalActionsLength}
          indicatorClassName="bg-red-500"
        />
      </div>
      
      <div className="flex flex-col">
        <ProgressCategory
          label="Habits"
          icon={Repeat}
          color="text-green-600"
          value={habitCompletionPercentage}
          completed={goalHabitsLength}
          total="habits"
          indicatorClassName="bg-green-500"
        />
      </div>
    </div>
  );
};

export default ProgressCategories;
