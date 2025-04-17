
import React, { useState, useEffect } from 'react';
import { useGoal } from '@/hooks/useGoalContext';
import { useTask } from '@/contexts/TaskContext';
import { useHabit } from '@/contexts/HabitContext';
import { Goals, GoalStatus } from '@/types/task';
import { 
  Target, 
  Flag,
  ListChecks,
  Repeat,
  Calendar,
  Plus,
  Shapes
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import GoalHeader from './sections/GoalHeader';
import GoalProgress from './sections/GoalProgress';
import MilestoneSection from './sections/MilestoneSection';
import PlanSection from './sections/PlanSection';
import TaskSection from './sections/TaskSection';
import HabitSection from './sections/HabitSection';
import ActionsSection from './sections/ActionsSection';
import EditGoalDialog from './dialogs/EditGoalDialog';

interface GoalDetailViewProps {
  goalId: string;
  onBack: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ goalId, onBack }) => {
  const { threeYearGoals, ninetyDayTargets, plans } = useGoal();
  const { tasks } = useTask();
  const { habits } = useHabit();
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  // State for tabs and dialogs
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  
  // Count associated items
  const goalMilestones = ninetyDayTargets.filter(target => target.threeYearGoalId === goalId);
  const milestoneCount = goalMilestones.length;
  
  const goalPlans = plans.filter(plan => 
    goalMilestones.some(milestone => milestone.id === plan.ninetyDayTargetId)
  );
  const planCount = goalPlans.length;
  
  const goalTasks = tasks.filter(task => task.goalId === goalId);
  const taskCount = goalTasks.length;
  
  const goalActions = tasks.filter(task => task.isAction && task.goalId === goalId);
  const actionCount = goalActions.length;
  
  // Filter habits associated with this goal
  const goalHabits = habits.filter(habit => habit.goalId === goalId);
  const habitCount = goalHabits.length;
  
  // When active tab is clicked again, default to overview
  const handleTabChange = (value: string) => {
    if (value === activeTab) {
      setActiveTab("overview");
    } else {
      setActiveTab(value);
    }
  };
  
  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Target className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Goal not found</h2>
        <p className="text-muted-foreground mb-4">The goal you're looking for doesn't exist or has been removed.</p>
        <Button onClick={onBack}>Back to Goals</Button>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      {goal && <GoalHeader 
        goal={goal} 
        onBack={onBack} 
        onEdit={() => setIsEditGoalDialogOpen(true)}
        milestoneCount={milestoneCount}
        planCount={planCount}
        taskCount={taskCount}
        actionCount={actionCount}
        habitCount={habitCount}
      />}
      
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Goal Description and Progress */}
        <GoalProgress goal={goal} />
        
        {/* Tabs for different sections */}
        <div className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6 w-full">
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
            
            <TabsContent value="overview" className="mt-0 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Quick Overview of all sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Actions Section Summary */}
                    <div className="border rounded-lg p-4 bg-card/50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium flex items-center">
                          <ListChecks className="h-5 w-5 mr-2 text-blue-500" />
                          Actions
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab("tasks")}
                        >
                          View All
                        </Button>
                      </div>
                      <ActionsSection goalId={goal.id} limit={3} />
                    </div>
                    
                    {/* Habits Section Summary */}
                    <div className="border rounded-lg p-4 bg-card/50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium flex items-center">
                          <Repeat className="h-5 w-5 mr-2 text-green-500" />
                          Habits
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveTab("habits")}
                        >
                          View All
                        </Button>
                      </div>
                      <HabitSection goalId={goal.id} limit={3} />
                    </div>
                    
                    {/* Milestones Section Summary */}
                    <div className="border rounded-lg p-4 bg-card/50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium flex items-center">
                          <Flag className="h-5 w-5 mr-2 text-purple-500" />
                          Milestones
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab("milestones")}
                        >
                          View All
                        </Button>
                      </div>
                      <MilestoneSection goalId={goal.id} limit={3} />
                    </div>
                    
                    {/* Tasks Section Summary */}
                    <div className="border rounded-lg p-4 bg-card/50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium flex items-center">
                          <ListChecks className="h-5 w-5 mr-2 text-yellow-500" />
                          Tasks
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab("tasks")}
                        >
                          View All
                        </Button>
                      </div>
                      <TaskSection goalId={goal.id} limit={3} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="milestones" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <MilestoneSection goalId={goal.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="plans" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <PlanSection goalId={goal.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <TaskSection goalId={goal.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="habits" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <HabitSection goalId={goal.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Edit Goal Dialog */}
      {goal && <EditGoalDialog 
        goal={goal} 
        isOpen={isEditGoalDialogOpen} 
        onOpenChange={setIsEditGoalDialogOpen} 
      />}
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-12 w-12 rounded-full shadow-md bg-primary hover:bg-primary/90 transition-colors">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default GoalDetailView;
