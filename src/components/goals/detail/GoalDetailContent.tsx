
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
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="h-full">
        {/* Goal Description and Progress */}
        <GoalProgress goal={goal} />
        
        {/* Tabs for different sections */}
        <div className="px-6 py-4 pb-20">
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
    </ScrollArea>
  );
};

export default GoalDetailContent;
