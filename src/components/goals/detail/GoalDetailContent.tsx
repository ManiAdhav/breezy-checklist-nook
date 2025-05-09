
import React, { useEffect } from 'react';
import { Goals } from '@/types/task';
import GoalProgress from '../sections/GoalProgress';
import GoalTabs from './GoalTabs';

interface GoalDetailContentProps {
  goal: Goals;
  activeTab: string;
  handleTabChange: (value: string) => void;
  goalId: string;
  taskCount: number;
  habitCount: number;
}

const GoalDetailContent: React.FC<GoalDetailContentProps> = ({
  goal,
  activeTab,
  handleTabChange,
  goalId,
  taskCount,
  habitCount
}) => {
  // Use an effect to ensure data is loaded properly when the component mounts
  useEffect(() => {
    console.log(`GoalDetailContent mounted for goal: ${goalId}`);
    console.log(`Current counts - Tasks: ${taskCount}, Habits: ${habitCount}`);
    // This will run when the component mounts or when key data changes
  }, [goalId, taskCount, habitCount]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Goal Description and Progress - Fixed height */}
      <div className="px-6 py-4 flex-shrink-0">
        <GoalProgress goal={goal} />
      </div>
      
      {/* Tabs for different sections - Takes remaining height and enables scrolling */}
      <div className="flex-1 overflow-hidden px-6 pb-20">
        <GoalTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          goalId={goalId}
          taskCount={taskCount}
          habitCount={habitCount}
        />
      </div>
    </div>
  );
};

export default GoalDetailContent;
