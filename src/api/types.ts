
import { Task, List, ThreeYearGoal, NinetyDayTarget, WeeklyGoal } from '@/types/task';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
