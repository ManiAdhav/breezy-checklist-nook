
import { Goals, NinetyDayTarget } from '@/types/task';

export interface GoalContextType {
  threeYearGoals: Goals[];
  ninetyDayTargets: NinetyDayTarget[];
  addThreeYearGoal: (goal: Omit<Goals, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goals | undefined>;
  updateThreeYearGoal: (id: string, updates: Partial<Goals>) => void;
  deleteThreeYearGoal: (id: string) => void;
  addNinetyDayTarget: (target: Omit<NinetyDayTarget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<NinetyDayTarget | undefined>;
  updateNinetyDayTarget: (id: string, updates: Partial<NinetyDayTarget>) => void;
  deleteNinetyDayTarget: (id: string) => void;
  isLoading: boolean;
}
