
export interface Habit {
  id: string;
  name: string;
  metric: {
    type: 'count' | 'duration' | 'boolean';
    unit: string;
    target: number;
  };
  goalId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
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
