
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { 
  Calendar,
  ChevronDown,
  ChevronRight,
  ListChecks
} from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActionsList from '@/components/actions/ActionsList';

const ActionsView: React.FC = () => {
  const { tasks, toggleTaskCompletion } = useTask();
  const { threeYearGoals, weeklyGoals, ninetyDayTargets } = useGoal();
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("actions");
  const navigate = useNavigate();

  // Get all actions
  const actionTasks = tasks.filter(task => task.isAction);

  // Group actions by goal
  const getGoalForAction = (task: typeof actionTasks[0]) => {
    if (!task.weeklyGoalId) return null;
    
    const weeklyGoal = weeklyGoals.find(wg => wg.id === task.weeklyGoalId);
    if (!weeklyGoal) return null;
    
    const target = ninetyDayTargets.find(t => t.id === weeklyGoal.ninetyDayTargetId);
    if (!target) return null;
    
    return threeYearGoals.find(g => g.id === target.threeYearGoalId);
  };

  // Group tasks by goal
  const tasksByGoal = actionTasks.reduce((groups, task) => {
    const goal = getGoalForAction(task);
    if (!goal) return groups;
    
    if (!groups[goal.id]) {
      groups[goal.id] = {
        goal,
        tasks: []
      };
    }
    
    groups[goal.id].tasks.push(task);
    return groups;
  }, {} as Record<string, { goal: (typeof threeYearGoals)[0], tasks: typeof actionTasks }>);

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <ListChecks className="mr-2 h-5 w-5 text-blue-500" />
        All Actions
      </h2>
      
      <Tabs 
        defaultValue="actions" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="actions" className="mt-4">
          {Object.keys(tasksByGoal).length > 0 ? (
            <div className="space-y-4">
              {Object.values(tasksByGoal).map(({ goal, tasks }) => (
                <div key={goal.id} className="border rounded-lg overflow-hidden bg-card">
                  <div 
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/40"
                    onClick={() => toggleGoalExpansion(goal.id)}
                  >
                    <div className="flex items-center">
                      {expandedGoalId === goal.id ? 
                        <ChevronDown className="h-4 w-4 mr-2" /> : 
                        <ChevronRight className="h-4 w-4 mr-2" />
                      }
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <Badge variant="outline">
                      {tasks.filter(t => !t.completed).length} active
                    </Badge>
                  </div>
                  
                  {expandedGoalId === goal.id && (
                    <div className="divide-y">
                      {tasks.map(task => (
                        <div key={task.id} className="p-3 hover:bg-muted/20 flex items-start gap-3">
                          <Checkbox 
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </div>
                            
                            {task.dueDate && (
                              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => navigate(`/goals?goalId=${goal.id}`)}
                          >
                            View Goal
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground border rounded-lg">
              <ListChecks className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No actions found</h3>
              <p className="text-sm">Create actions for your goals to track your progress.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="plans" className="mt-4">
          <ActionsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActionsView;
