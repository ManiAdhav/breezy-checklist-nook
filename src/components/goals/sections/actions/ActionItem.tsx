
import React from 'react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoal } from '@/hooks/useGoalContext';
import { useTask } from '@/contexts/TaskContext';

interface ActionItemProps {
  action: Task;
  expandedTaskId: string | null;
  selectedTab: string;
  onToggleTaskCompletion: (id: string) => void;
  onToggleTaskDetails: (id: string) => void;
  onTabChange: (value: string) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({
  action,
  expandedTaskId,
  selectedTab,
  onToggleTaskCompletion,
  onToggleTaskDetails,
  onTabChange
}) => {
  const { ninetyDayTargets, plans, threeYearGoals } = useGoal();
  const { tasks } = useTask();
  
  // Get related items
  const relatedGoal = threeYearGoals.find(g => g.id === action.goalId);
  const relatedMilestones = ninetyDayTargets.filter(m => m.threeYearGoalId === action.goalId);
  const relatedPlans = plans.filter(p => 
    relatedMilestones.some(m => m.id === p.ninetyDayTargetId)
  );
  const relatedTasks = tasks.filter(t => 
    t.id !== action.id && t.goalId === action.goalId
  );
  
  return (
    <div key={action.id} className="rounded-md border mb-2">
      <div 
        className="flex items-start p-2 hover:bg-accent/20 rounded-md cursor-pointer text-xs"
        onClick={() => onToggleTaskDetails(action.id)}
      >
        <Checkbox 
          checked={action.completed}
          className="mt-0.5 mr-2"
          onCheckedChange={() => onToggleTaskCompletion(action.id)}
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="flex-1 min-w-0">
          <div className="font-medium">{action.title}</div>
          
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            {action.startDate && action.dueDate && (
              <div className="flex items-center text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>
                  {format(new Date(action.startDate), 'MMM d')} - {format(new Date(action.dueDate), 'MMM d')}
                </span>
              </div>
            )}
            
            {relatedGoal && (
              <div className="text-xs text-primary-foreground bg-primary/80 px-1.5 py-0.5 rounded-sm">
                {relatedGoal.title}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {expandedTaskId === action.id && (
        <div className="p-2 bg-muted/20 text-xs border-t">
          <Tabs defaultValue="milestones" value={selectedTab} onValueChange={onTabChange}>
            <TabsList className="w-full grid grid-cols-4 h-8">
              <TabsTrigger value="milestones" className="text-[10px]">
                Milestones ({relatedMilestones.length})
              </TabsTrigger>
              <TabsTrigger value="plans" className="text-[10px]">
                Plans ({relatedPlans.length})
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-[10px]">
                Tasks ({relatedTasks.length})
              </TabsTrigger>
              <TabsTrigger value="details" className="text-[10px]">
                Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="milestones" className="p-2">
              {relatedMilestones.length > 0 ? (
                <div className="space-y-2">
                  {relatedMilestones.map(milestone => (
                    <div key={milestone.id} className="text-xs p-2 bg-background rounded-md border">
                      <div className="font-medium">{milestone.title}</div>
                      <div className="text-muted-foreground mt-1">{milestone.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No associated milestones found.</p>
              )}
            </TabsContent>
            
            <TabsContent value="plans" className="p-2">
              {relatedPlans.length > 0 ? (
                <div className="space-y-2">
                  {relatedPlans.map(plan => (
                    <div key={plan.id} className="text-xs p-2 bg-background rounded-md border">
                      <div className="font-medium">{plan.title}</div>
                      <div className="text-muted-foreground mt-1">{plan.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No associated plans found.</p>
              )}
            </TabsContent>
            
            <TabsContent value="tasks" className="p-2">
              {relatedTasks.length > 0 ? (
                <div className="space-y-2">
                  {relatedTasks.map(task => (
                    <div key={task.id} className="text-xs p-2 bg-background rounded-md border">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-muted-foreground mt-1">
                        {task.completed ? 'Completed' : 'Not completed'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No associated tasks found.</p>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="p-2">
              <div className="space-y-2">
                {action.notes && (
                  <div>
                    <div className="font-medium mb-1">Description</div>
                    <p className="text-muted-foreground">{action.notes}</p>
                  </div>
                )}
                <div>
                  <div className="font-medium mb-1">Status</div>
                  <p className="text-muted-foreground">
                    {action.completed ? 'Completed' : 'Not completed'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ActionItem;
