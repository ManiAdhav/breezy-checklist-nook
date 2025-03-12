
import { Task, List, ThreeYearGoal, NinetyDayTarget, Plan } from '@/types/task';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
