
import { Task, Goals, NinetyDayTarget, Plan } from '@/types/task';

export interface PlanDetails {
  planTitle: string;
  targetTitle: string;
  goalTitle: string;
  goalId: string;
}

export interface TasksByGoal {
  [key: string]: { 
    goal: string, 
    plans: { 
      [key: string]: Task[] 
    } 
  }
}

export const getPlanDetails = (
  planId: string,
  plans: Plan[],
  ninetyDayTargets: NinetyDayTarget[],
  threeYearGoals: Goals[]
): PlanDetails => {
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

export const groupTasksByGoal = (
  tasks: Task[],
  plans: Plan[],
  ninetyDayTargets: NinetyDayTarget[],
  threeYearGoals: Goals[]
): TasksByGoal => {
  const tasksByGoal: TasksByGoal = {};
  
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
    
    const { goalId, goalTitle, planTitle } = getPlanDetails(
      task.planId, 
      plans, 
      ninetyDayTargets, 
      threeYearGoals
    );
    
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
  
  return tasksByGoal;
};
