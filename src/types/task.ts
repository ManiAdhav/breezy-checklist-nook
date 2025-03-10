
export type Priority = 'high' | 'medium' | 'low' | 'none';

export interface List {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: Priority;
  listId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  weeklyGoalId?: string;
  isAction?: boolean; // New field to identify action items
  startDate?: Date;  // New field specific to actions
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';

export interface ThreeYearGoal {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
  icon?: string;
  targets?: NinetyDayTarget[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NinetyDayTarget {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
  threeYearGoalId: string;
  icon?: string;
  weeklyGoals?: WeeklyGoal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
  ninetyDayTargetId: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}
