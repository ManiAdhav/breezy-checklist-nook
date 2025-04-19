
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
  planCount: number;
  taskCount: number;
  habitCount: number;
}

const GoalDetailContent: React.FC<GoalDetailContentProps> = ({
  goal,
  activeTab,
  handleTabChange,
  goalId,
  milestoneCount,
  planCount,
  taskCount,
  habitCount
}) => {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Goal Description and Progress - Fixed height */}
      <div className="px-6 py-4 flex-shrink-0">
        <GoalProgress goal={goal} />
      </div>
      
      {/* Tabs for different sections - Takes remaining height and enables scrolling */}
      <div className="flex-1 min-h-0 px-6 pb-20">
        <GoalTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          goalId={goalId}
          milestoneCount={milestoneCount}
          planCount={planCount}
          taskCount={taskCount}
          habitCount={habitCount}
        />
      </div>
    </div>
  );
};

export default GoalDetailContent;
