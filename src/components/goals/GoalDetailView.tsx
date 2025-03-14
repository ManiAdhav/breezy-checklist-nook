
import React, { useState } from 'react';
import { useGoal } from '@/hooks/useGoalContext';
import { ThreeYearGoal } from '@/types/task';
import { 
  Target, 
  Flag,
  ListChecks,
  Repeat,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import GoalHeader from './sections/GoalHeader';
import GoalProgress from './sections/GoalProgress';
import SectionHeader from './sections/SectionHeader';
import EditGoalDialog from './dialogs/EditGoalDialog';
import MilestoneSection from './sections/MilestoneSection';
import PlanSection from './sections/PlanSection';
import TaskSection from './sections/TaskSection';
import HabitSection from './sections/HabitSection';
import ActionsSection from './sections/ActionsSection';

interface GoalDetailViewProps {
  goalId: string;
  onBack: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ goalId, onBack }) => {
  const { threeYearGoals } = useGoal();
  
  const goal = threeYearGoals.find(g => g.id === goalId);
  
  const [openSections, setOpenSections] = useState({
    milestones: true,
    plans: true,
    tasks: true,
    habits: false,
    actions: true,
  });

  // Edit goal state
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
      <GoalHeader 
        goal={goal} 
        onBack={onBack} 
        onEdit={() => setIsEditGoalDialogOpen(true)} 
      />
      
      <div className="flex-1 overflow-y-auto">
        {/* Goal Description and Progress */}
        <GoalProgress goal={goal} />
        
        {/* Sections */}
        <div className="divide-y divide-border">
          {/* Actions Section */}
          <Collapsible 
            open={openSections.actions}
            className="px-6 py-4 bg-background"
          >
            <SectionHeader 
              icon={ListChecks} 
              title="Actions" 
              isOpen={openSections.actions} 
              onToggle={() => toggleSection('actions')}
              iconColor="text-blue-500" 
            />
            <CollapsibleContent>
              <div className="pt-4">
                <ActionsSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Milestones Section */}
          <Collapsible 
            open={openSections.milestones}
            className="px-6 py-4 bg-background"
          >
            <SectionHeader 
              icon={Flag} 
              title="Milestones" 
              isOpen={openSections.milestones} 
              onToggle={() => toggleSection('milestones')} 
            />
            <CollapsibleContent>
              <div className="pt-4">
                <MilestoneSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Plans Section */}
          <Collapsible 
            open={openSections.plans}
            className="px-6 py-4 bg-background"
          >
            <SectionHeader 
              icon={Target} 
              title="Plans" 
              isOpen={openSections.plans} 
              onToggle={() => toggleSection('plans')} 
            />
            <CollapsibleContent>
              <div className="pt-4">
                <PlanSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Tasks Section */}
          <Collapsible 
            open={openSections.tasks}
            className="px-6 py-4 bg-background"
          >
            <SectionHeader 
              icon={ListChecks} 
              title="Tasks" 
              isOpen={openSections.tasks} 
              onToggle={() => toggleSection('tasks')} 
            />
            <CollapsibleContent>
              <div className="pt-4">
                <TaskSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Habits Section */}
          <Collapsible 
            open={openSections.habits}
            className="px-6 py-4 bg-background"
          >
            <SectionHeader 
              icon={Repeat} 
              title="Habits" 
              isOpen={openSections.habits} 
              onToggle={() => toggleSection('habits')} 
            />
            <CollapsibleContent>
              <div className="pt-4">
                <HabitSection goalId={goal.id} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      {/* Edit Goal Dialog */}
      <EditGoalDialog 
        goal={goal} 
        isOpen={isEditGoalDialogOpen} 
        onOpenChange={setIsEditGoalDialogOpen} 
      />
      
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
