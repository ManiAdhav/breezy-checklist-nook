
import React from 'react';
import { Goals } from '@/types/task';
import { ScrollArea } from '@/components/ui/scroll-area';
import GoalProgress from '../sections/GoalProgress';
import GoalTabs from './GoalTabs';

interface GoalDetailContentProps {
  goal: Goals;
  activeTab: string;
  handleTabChange: (value: string) => void;
  goalId: string;
  milestoneCount: number;
  taskCount: number;
  habitCount: number;
}

const GoalDetailContent: React.FC<GoalDetailContentProps> = ({
  goal,
  activeTab,
  handleTabChange,
  goalId,
  milestoneCount,
  taskCount,
  habitCount
}) => {
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
          milestoneCount={milestoneCount}
          taskCount={taskCount}
          habitCount={habitCount}
        />
      </div>
    </div>
  );
};

export default GoalDetailContent;
