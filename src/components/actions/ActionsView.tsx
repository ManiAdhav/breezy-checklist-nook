
import React from 'react';
import { Task } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';
import { useGoal } from '@/contexts/GoalContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, MoreHorizontal, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ActionsViewProps {
  tasks: Task[];
}

const ActionsView: React.FC<ActionsViewProps> = ({ tasks }) => {
  const { toggleTaskCompletion, deleteTask } = useTask();
  const { plans, ninetyDayTargets, threeYearGoals } = useGoal();

  // Function to get plan details including its associated target and goal
  const getPlanDetails = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return { planTitle: 'Unknown Plan', targetTitle: '', goalTitle: '', goalId: '' };

    const target = ninetyDayTargets.find(t => t.id === plan.ninetyDayTargetId);
    if (!target) return { planTitle: plan.title, targetTitle: 'Unknown Target', goalTitle: '', goalId: '' };

    const goal = threeYearGoals.find(g => g.id === target.threeYearGoalId);
    
    return {
      planTitle: plan.title,
      targetTitle: target.title,
      goalTitle: goal ? goal.title : 'Unknown Goal',
      goalId: goal ? goal.id : ''
    };
  };

  // Group tasks by goalId first, then by planId
  const tasksByGoal: { [key: string]: { goal: string, plans: { [key: string]: Task[] } } } = {};
  
  tasks.forEach(task => {
    if (!task.planId) {
      // Handle unassigned tasks
      if (!tasksByGoal['unassigned']) {
        tasksByGoal['unassigned'] = { 
          goal: 'Unassigned Actions', 
          plans: { 'unassigned': [] } 
        };
      }
      tasksByGoal['unassigned'].plans['unassigned'].push(task);
      return;
    }
    
    const { goalId, goalTitle, planTitle } = getPlanDetails(task.planId);
    const goalKey = goalId || 'unknown';
    
    if (!tasksByGoal[goalKey]) {
      tasksByGoal[goalKey] = { 
        goal: goalTitle || 'Unknown Goal', 
        plans: {} 
      };
    }
    
    if (!tasksByGoal[goalKey].plans[task.planId]) {
      tasksByGoal[goalKey].plans[task.planId] = [];
    }
    
    tasksByGoal[goalKey].plans[task.planId].push(task);
  });

  return (
    <div className="space-y-6">
      {Object.keys(tasksByGoal).length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No actions found. Add an action to get started.</p>
        </div>
      ) : (
        Object.entries(tasksByGoal).map(([goalId, { goal, plans: goalPlans }]) => (
          <div key={goalId} className="border rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-muted/50 border-b flex items-center">
              <h3 className="text-sm font-medium">{goal}</h3>
            </div>
            <div className="divide-y">
              {Object.entries(goalPlans).map(([planId, planTasks]) => {
                const { planTitle, targetTitle } = planId !== 'unassigned' 
                  ? getPlanDetails(planId) 
                  : { planTitle: 'Unassigned Actions', targetTitle: '' };
                  
                return (
                  <div key={planId} className="border-t">
                    <div className="px-4 py-2 bg-muted/20 border-b">
                      <div className="flex items-center">
                        <ChevronRight className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{planTitle}</p>
                      </div>
                      {targetTitle && (
                        <p className="text-xs text-muted-foreground ml-5 mt-0.5">
                          {targetTitle}
                        </p>
                      )}
                    </div>
                    <ul>
                      {planTasks.map(task => (
                        <li key={task.id} className="px-4 py-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => toggleTaskCompletion(task.id)}
                                id={`task-${task.id}`}
                                className="mt-0.5"
                              />
                              <div className="ml-3">
                                <label
                                  htmlFor={`task-${task.id}`}
                                  className={`text-sm leading-tight ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                                >
                                  {task.title}
                                </label>
                                
                                {(task.startDate || task.dueDate) && (
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      {task.startDate && format(new Date(task.startDate), 'MMM d')}
                                      {task.startDate && task.dueDate && ' - '}
                                      {task.dueDate && format(new Date(task.dueDate), 'MMM d')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => deleteTask(task.id)}
                                  className="text-destructive"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActionsView;
