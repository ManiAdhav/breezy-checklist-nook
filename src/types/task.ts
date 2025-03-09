
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
  weeklyGoalId?: string; // Reference to associated weekly goal
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';

export interface ThreeYearGoal {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
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
  threeYearGoalId: string; // Reference to parent goal
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
  ninetyDayTargetId: string; // Reference to parent target
  createdAt: Date;
  updatedAt: Date;
}
