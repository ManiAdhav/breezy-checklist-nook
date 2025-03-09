
import React, { useState } from 'react';
import { useGoal } from '@/contexts/GoalContext';
import { ThreeYearGoal, GoalStatus } from '@/types/task';
import { format } from 'date-fns';
import { 
  Calendar, 
  Target, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  Circle,
  Plus,
  Flag,
  ListChecks,
  Repeat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MilestoneSection from './sections/MilestoneSection';
import PlanSection from './sections/PlanSection';
import TaskSection from './sections/TaskSection';
import HabitSection from './sections/HabitSection';
import { toast } from '@/hooks/use-toast';

interface GoalDetailViewProps {
  goalId: string;
  onBack: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ goalId, onBack }) => {
  const { threeYearGoals, updateThreeYearGoal } = useGoal();
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  const [openSections, setOpenSections] = useState({
    milestones: true,
    plans: true,
    tasks: true,
    habits: false,
  });
  
  // Simple progress calculation for demo purposes
  // In a real app, this would be calculated based on milestones, tasks, etc.
  const progressPercentage = 
    goal?.status === 'completed' ? 100 :
    goal?.status === 'in_progress' ? 65 : // Example value
    goal?.status === 'not_started' ? 0 : 5;
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const getStatusLabel = (status: GoalStatus): string => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed',
      abandoned: 'Abandoned',
    };
    return labels[status];
  };
  
  const getStatusColor = (status: GoalStatus): string => {
    const colors = {
      not_started: 'bg-gray-500',
      in_progress: 'bg-blue-500',
      completed: 'bg-green-500',
      abandoned: 'bg-red-500',
    };
    return colors[status];
  };
  
  const handleStatusUpdate = (status: GoalStatus) => {
    if (!goal) return;
    
    updateThreeYearGoal(goal.id, { status });
    
    toast({
      title: "Goal status updated",
      description: `Status changed to ${getStatusLabel(status)}`,
    });
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
  
  // Format dates for display
  const startDate = format(new Date(goal.startDate), 'MMM d, yyyy');
  const endDate = format(new Date(goal.endDate), 'MMM d, yyyy');
  
  // Get the icon component based on the goal's icon value
  const IconOptions = {
    Target: Target,
    Flag: Flag,
    // ... add all the other icons here
  };
  const GoalIcon = (goal.icon && IconOptions[goal.icon as keyof typeof IconOptions]) || Target;
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="py-4 px-6 flex justify-between items-center border-b border-border sticky top-0 bg-white z-10">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold tracking-tight flex items-center">
            <GoalIcon className="h-5 w-5 mr-2 text-primary" />
            {goal.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {startDate} - {endDate}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Status:</span>
            <select 
              value={goal.status}
              onChange={(e) => handleStatusUpdate(e.target.value as GoalStatus)}
              className="text-sm border border-input rounded-md px-2 py-1 bg-background"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Goal Description and Progress */}
        <div className="p-6 bg-muted/20 border-b border-border">
          <div className="mb-4">
            {goal.description && (
              <p className="text-muted-foreground mb-4">{goal.description}</p>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Overall Progress</h3>
              <span className="text-sm font-semibold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2.5" />
            
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${getStatusColor(goal.status)}`}></div>
                <span>{getStatusLabel(goal.status)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sections */}
        <div className="divide-y divide-border">
          {/* Milestones Section */}
          <Collapsible 
            open={openSections.milestones}
            onOpenChange={() => toggleSection('milestones')}
            className="p-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-colors">
              <div className="flex items-center">
                <Flag className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Milestones</h3>
              </div>
              {openSections.milestones ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <MilestoneSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Plans Section */}
          <Collapsible 
            open={openSections.plans}
            onOpenChange={() => toggleSection('plans')}
            className="p-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-colors">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Plans</h3>
              </div>
              {openSections.plans ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <PlanSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Tasks Section */}
          <Collapsible 
            open={openSections.tasks}
            onOpenChange={() => toggleSection('tasks')}
            className="p-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-colors">
              <div className="flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Tasks</h3>
              </div>
              {openSections.tasks ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <TaskSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Habits Section */}
          <Collapsible 
            open={openSections.habits}
            onOpenChange={() => toggleSection('habits')}
            className="p-4 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted/30 rounded-md transition-colors">
              <div className="flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Habits</h3>
              </div>
              {openSections.habits ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <HabitSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default GoalDetailView;
