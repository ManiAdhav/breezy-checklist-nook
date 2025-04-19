
import React from 'react';
import { Flag, ListChecks, Repeat, Shapes, Target } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MilestoneSection from '../sections/MilestoneSection';
import PlanSection from '../sections/PlanSection';
import TaskSection from '../sections/TaskSection';
import HabitSection from '../sections/HabitSection';
import GoalDetailOverview from './GoalDetailOverview';

interface GoalTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  goalId: string;
  milestoneCount: number;
  planCount: number;
  taskCount: number;
  habitCount: number;
}

const GoalTabs: React.FC<GoalTabsProps> = ({
  activeTab,
  onTabChange,
  goalId,
  milestoneCount,
  planCount,
  taskCount,
  habitCount
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full h-full flex flex-col">
      <TabsList className="sticky top-0 z-10 grid grid-cols-5 mb-6 w-full bg-background">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <Shapes className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="milestones" className="flex items-center space-x-2">
          <Flag className="h-4 w-4" />
          <span>Milestones</span>
          {milestoneCount > 0 && <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{milestoneCount}</span>}
        </TabsTrigger>
        <TabsTrigger value="plans" className="flex items-center space-x-2">
          <Target className="h-4 w-4" />
          <span>Plans</span>
          {planCount > 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded-full">{planCount}</span>}
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center space-x-2">
          <ListChecks className="h-4 w-4" />
          <span>Tasks</span>
          {taskCount > 0 && <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-1.5 py-0.5 rounded-full">{taskCount}</span>}
        </TabsTrigger>
        <TabsTrigger value="habits" className="flex items-center space-x-2">
          <Repeat className="h-4 w-4" />
          <span>Habits</span>
          {habitCount > 0 && <span className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-1.5 py-0.5 rounded-full">{habitCount}</span>}
        </TabsTrigger>
      </TabsList>
      
      <div className="flex-1 overflow-auto">
        <TabsContent value="overview" className="mt-0 h-full">
          <GoalDetailOverview goalId={goalId} onTabChange={onTabChange} />
        </TabsContent>
        
        <TabsContent value="milestones" className="mt-0 h-full">
          <Card className="h-full">
            <CardContent className="p-6 h-full overflow-auto">
              <MilestoneSection goalId={goalId} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans" className="mt-0 h-full">
          <Card className="h-full">
            <CardContent className="p-6 h-full overflow-auto">
              <PlanSection goalId={goalId} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-0 h-full">
          <Card className="h-full">
            <CardContent className="p-6 h-full overflow-auto">
              <TaskSection goalId={goalId} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="habits" className="mt-0 h-full">
          <Card className="h-full">
            <CardContent className="p-6 h-full overflow-auto">
              <HabitSection goalId={goalId} />
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default GoalTabs;
