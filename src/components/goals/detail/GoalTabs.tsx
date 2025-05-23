
import React, { useEffect } from 'react';
import { ListChecks, Repeat, Shapes } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TaskSection from '../sections/TaskSection';
import HabitSection from '../sections/HabitSection';
import GoalDetailOverview from './GoalDetailOverview';
import { ScrollArea } from '@/components/ui/scroll-area';
import ActionsSection from '../sections/ActionsSection';

interface GoalTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  goalId: string;
  taskCount: number;
  habitCount: number;
}

const GoalTabs: React.FC<GoalTabsProps> = ({
  activeTab,
  onTabChange,
  goalId,
  taskCount,
  habitCount
}) => {
  useEffect(() => {
    console.log(`Active tab changed to: ${activeTab} for goal: ${goalId}`);
    console.log(`Current counts - Tasks: ${taskCount}, Habits: ${habitCount}`);
  }, [activeTab, goalId, taskCount, habitCount]);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="w-full h-full flex flex-col overflow-hidden"
      defaultValue="overview"
    >
      <TabsList className="sticky top-0 z-10 grid grid-cols-3 mb-6 w-full bg-background flex-shrink-0">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <Shapes className="h-4 w-4" />
          <span>Overview</span>
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
      
      <div className="flex-1 overflow-hidden">
        <TabsContent value="overview" className="h-full mt-0 overflow-hidden block">
          <ScrollArea className="h-full pr-4">
            <GoalDetailOverview goalId={goalId} onTabChange={onTabChange} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="tasks" className="h-full mt-0 overflow-hidden block">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <ScrollArea className="h-full pr-4">
                <TaskSection goalId={goalId} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="habits" className="h-full mt-0 overflow-hidden block">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <ScrollArea className="h-full pr-4">
                <HabitSection goalId={goalId} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default GoalTabs;
