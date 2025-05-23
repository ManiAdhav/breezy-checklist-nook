
export type Priority = 'high' | 'medium' | 'low' | 'none';

export interface List {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
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
  goalId?: string; // Added field to associate actions directly with goals
  isAction?: boolean; // New field to identify action items
  startDate?: Date;  // New field specific to actions
  tags?: string[]; // Array of tag IDs
  recurring?: boolean; // Whether this is a recurring task
  recurringPattern?: string; // The pattern for recurrence (daily, weekly, monthly, custom)
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';

export interface Vision {
  id: string;
  title: string;
  description?: string;
  areaOfLife: string;
  targetDate: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goals {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
  icon?: string;
  visionId?: string; // Add visionId to map goal to vision
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
  createdAt: Date;
  updatedAt: Date;
}
