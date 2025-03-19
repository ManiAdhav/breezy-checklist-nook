import { useState, useEffect } from 'react';
import { NinetyDayTarget, GoalStatus, Goals } from '@/types/task';

interface UseNinetyDayTargetFormProps {
  initialTarget?: NinetyDayTarget;
  threeYearGoals: Goals[];
}

const useNinetyDayTargetForm = ({ initialTarget, threeYearGoals }: UseNinetyDayTargetFormProps) => {
  const [title, setTitle] = useState(initialTarget?.title || '');
  const [description, setDescription] = useState(initialTarget?.description || '');
  const [startDate, setStartDate] = useState(initialTarget?.startDate ? new Date(initialTarget.startDate) : new Date());
  const [endDate, setEndDate] = useState(initialTarget?.endDate ? new Date(initialTarget.endDate) : new Date());
  const [status, setStatus] = useState<GoalStatus>(initialTarget?.status || 'not_started');
  const [threeYearGoalId, setThreeYearGoalId] = useState(initialTarget?.threeYearGoalId || (threeYearGoals.length > 0 ? threeYearGoals[0].id : ''));
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  useEffect(() => {
    if (initialTarget) {
      setTitle(initialTarget.title);
      setDescription(initialTarget.description || '');
      setStartDate(new Date(initialTarget.startDate));
      setEndDate(new Date(initialTarget.endDate));
      setStatus(initialTarget.status);
      setThreeYearGoalId(initialTarget.threeYearGoalId);
    } else if (threeYearGoals.length > 0) {
      setThreeYearGoalId(threeYearGoals[0].id);
    }
  }, [initialTarget, threeYearGoals]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    threeYearGoalId,
    setThreeYearGoalId,
    startDateOpen,
    setStartDateOpen,
    endDateOpen,
    setEndDateOpen,
  };
};

export default useNinetyDayTargetForm;
