
import { Task, Goals, NinetyDayTarget } from '@/types/task';

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
  goalId: string,
  ninetyDayTargets: NinetyDayTarget[],
  threeYearGoals: Goals[]
): PlanDetails => {
  const goal = threeYearGoals.find(g => g.id === goalId);
  const target = ninetyDayTargets.find(t => t.threeYearGoalId === goalId);
  
  return {
    planTitle: target ? target.title : 'Unknown Plan',
    targetTitle: target ? target.title : 'Unknown Target',
    goalTitle: goal ? goal.title : 'Unknown Goal',
    goalId: goal ? goal.id : ''
  };
};

export const groupTasksByGoal = (
  tasks: Task[],
  ninetyDayTargets: NinetyDayTarget[],
  threeYearGoals: Goals[]
): TasksByGoal => {
  const tasksByGoal: TasksByGoal = {};
  
  tasks.forEach(task => {
    if (!task.goalId) {
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
    
    const goalId = task.goalId;
    const goal = threeYearGoals.find(g => g.id === goalId);
    const goalTitle = goal ? goal.title : 'Unknown Goal';
    
    if (!tasksByGoal[goalId]) {
      tasksByGoal[goalId] = { 
        goal: goalTitle, 
        plans: {} 
      };
    }
    
    // Use the goalId as a direct grouping key
    const planKey = goalId;
    
    if (!tasksByGoal[goalId].plans[planKey]) {
      tasksByGoal[goalId].plans[planKey] = [];
    }
    
    tasksByGoal[goalId].plans[planKey].push(task);
  });
  
  return tasksByGoal;
};
