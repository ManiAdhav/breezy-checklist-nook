
export interface Habit {
  id: string;
  name: string;
  metric: string;
  goalId?: string;
  streak?: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  logs?: HabitLog[];
  icon?: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  value: number;
  notes?: string;
}

export interface HabitStreak {
  current: number;
  longest: number;
  lastLoggedDate?: Date;
}
