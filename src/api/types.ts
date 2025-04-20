
import { Task, List, Goals, NinetyDayTarget } from '@/types/task';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
