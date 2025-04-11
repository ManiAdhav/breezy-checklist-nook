
export interface Habit {
  id: string;
  name: string;
  description?: string;
  metric: string;
  target: number;
  goalId?: string;
  streak?: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  logs?: HabitLog[];
  icon?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  selectedDays?: string[];
  timeOfDay?: string;
  reminders?: string[];
  startDate?: Date;
  endDate?: Date;
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
